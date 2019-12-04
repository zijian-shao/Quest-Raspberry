function initSsrSsenrlList() {

    function _getButtonString(text) {
        return '<a href="#" class="raspberry-btn">' + text + '</a>';
    }

    function _12hTo24h(str12) {
        str12 = str12.trim();
        var str24 = str12;
        var strSpl = str24.split(':');
        if (str12.match(/[AP]M/)) {
            str24 = str12.slice(0, -2).trim();
            strSpl = str24.split(':');
            if (str12.match(/PM/) && parseInt(strSpl[0]) < 12) {
                strSpl[0] = (parseInt(strSpl[0]) + 12).toString();
            }
        }
        if (strSpl[0].length < 2) strSpl[0] = '0' + strSpl[0];
        if (strSpl[1].length < 2) strSpl[1] = '0' + strSpl[1];
        str24 = strSpl.join(':');
        return str24;
    }

    function _normalizeQuestDate(date) {

        if (_normalizeQuestDate.initialized !== true) {

            _normalizeQuestDate.separator = dateFormatTpl.replace(/y/gi, '').replace(/m/gi, '').replace(/d/gi, '').charAt(0);
            var components = dateFormatTpl.split(_normalizeQuestDate.separator);
            _normalizeQuestDate.yIndex = 0;
            _normalizeQuestDate.mIndex = 0;
            _normalizeQuestDate.dIndex = 0;

            for (var i = 0; i < components.length; i++) {
                if (components[i].toLowerCase() === 'yyyy') {
                    _normalizeQuestDate.yIndex = i;
                } else if (components[i].toLowerCase() === 'mm') {
                    _normalizeQuestDate.mIndex = i;
                } else if (components[i].toLowerCase() === 'dd') {
                    _normalizeQuestDate.dIndex = i;
                }
            }

            _normalizeQuestDate.initialized = true;
        }

        var componentsInput = date.trim().split(_normalizeQuestDate.separator);
        return componentsInput[_normalizeQuestDate.yIndex] + componentsInput[_normalizeQuestDate.mIndex] + componentsInput[_normalizeQuestDate.dIndex];
    }

    function _loadTpl() {
        summaryTpl = window.localStorage.getItem('Raspberry.ExportSchedule.SummaryTpl');
        if (summaryTpl === null) {
            summaryTpl = '@code @type in @location';
            window.localStorage.setItem('Raspberry.ExportSchedule.SummaryTpl', summaryTpl);
        }
        descriptionTpl = window.localStorage.getItem('Raspberry.ExportSchedule.DescriptionTpl');
        if (descriptionTpl === null) {
            descriptionTpl = '@code-@section: @name (@type) in @location with @prof';
            window.localStorage.setItem('Raspberry.ExportSchedule.DescriptionTpl', descriptionTpl);
        }
        dateFormatTpl = window.localStorage.getItem('Raspberry.ExportSchedule.DateFormatTpl');
        if (dateFormatTpl === null) {
            dateFormatTpl = _getQuestDateFormat();
            if (dateFormatTpl === null)
                dateFormatTpl = 'yyyy/mm/dd';
            window.localStorage.setItem('Raspberry.ExportSchedule.DateFormatTpl', dateFormatTpl);
        }
        _normalizeQuestDate.initialized = false;
    }

    function _getQuestDateFormat() {

        // find all dates
        var dateList = [];

        var timeTable = $('table[id^="ACE_STDNT_ENRL_SS"] ' +
            'div[id^="win0divDERIVED_REGFRM1_DESCR"] ' +
            'table[id^="ACE_DERIVED_REGFRM1_DESCR"] ' +
            'table[id^="CLASS_MTG_VW"] ' +
            '> tbody > tr > td > table');

        timeTable.each(function (index, elem) {
            var dateElems = $(elem).find('tbody > tr[id^="trCLASS_MTG_VW"] span[id^="MTG_DATES"]');

            dateElems.each(function (i, e) {
                var dateSlice = $(e).text().trim().split(' - ');
                dateSlice.forEach(function (e) {
                    var s = e.trim();
                    if (/\d/.test(s) === true) {
                        dateList.push(s);
                    }
                });
            });
        });

        if (dateList.length === 0) return null;

        // separator
        var separators = dateList[0].replace(/\d/g, '');
        if (separators.length !== 2) return null;
        if (separators.charAt(0) !== separators.charAt(1)) return null;
        var separator = separators.charAt(0);

        // check date format
        var format = ['', '', ''];
        var stack1 = [], stack2 = [];
        var stack1Index = -1, stack2Index = -1;
        var stack1Result = -1, stack2Result = -1; // -1:init, 0:mm or dd, 1:dd
        dateList.forEach(function (d) {
            var components = d.split(separator);
            if (components[0].length === 4) {
                format[0] = 'yyyy';
                stack1.push(parseInt(components[1]));
                stack1Index = 1;
                stack2.push(parseInt(components[2]));
                stack2Index = 2;
            } else if (components[1].length === 4) {
                stack1.push(parseInt(components[0]));
                stack1Index = 0;
                format[1] = 'yyyy';
                stack2.push(parseInt(components[2]));
                stack2Index = 2;
            } else {
                stack1.push(parseInt(components[0]));
                stack1Index = 0;
                stack2.push(parseInt(components[1]));
                stack2Index = 1;
                format[2] = 'yyyy';
            }
        });

        var stackLength = stack1.length;
        for (var i = 0; i < stackLength; i++) {
            // -1:init, 0:mm or dd, 1: dd
            if (stack1Result <= 0) {
                if (stack1[i] <= 12) {
                    stack1Result = 0;
                } else {
                    stack1Result = 1;
                }
            }
            if (stack2Result <= 0) {
                if (stack2[i] <= 12) {
                    stack2Result = 0;
                } else {
                    stack2Result = 1;
                }
            }
            if (stack1Result === 1 || stack2Result === 1) {
                break;
            }
        }

        if (stack1Result === 0 && stack2Result === 0) {
            // assume stack1 is month
            format[stack1Index] = 'mm';
            format[stack2Index] = 'dd';
        } else if (stack1Result === 0 && stack2Result === 1) {
            // stack1 is month
            format[stack1Index] = 'mm';
            format[stack2Index] = 'dd';
        } else {
            // stack2 is month
            format[stack1Index] = 'dd';
            format[stack2Index] = 'mm';
        }

        return format.join(separator);
    }

    function _getCalendarText() {

        _loadTpl();

        var text = '';
        var titleList = [];
        var scheduleList = [];

        // course title
        var titleTable = $('table[id^="ACE_STDNT_ENRL_SS"] ' +
            'div[id^="win0divDERIVED_REGFRM1_DESCR"] ' +
            '> table > tbody > tr:first-child > td');

        titleTable.each(function (index, elem) {
            titleList.push($(elem).text().replace(/\s+/g, ' ').trim());
        });

        // course schedule
        var timeTable = $('table[id^="ACE_STDNT_ENRL_SS"] ' +
            'div[id^="win0divDERIVED_REGFRM1_DESCR"] ' +
            'table[id^="ACE_DERIVED_REGFRM1_DESCR"] ' +
            'table[id^="CLASS_MTG_VW"] ' +
            '> tbody > tr > td > table');

        timeTable.each(function (index, elem) {

            var self = $(elem);
            var prevClassNbr = '', prevSection = '', prevComponent = '';
            var schedule = [];

            // loop each row in time table
            $(elem).find('tbody > tr[id^="trCLASS_MTG_VW"]').each(function (index, elem) {

                var self = $(elem);
                var currClassNbr, currSection, currComponent, currDaysTimes, currRoom, currInstructor, currStartEndDate;

                currClassNbr = self.find('span[id^="DERIVED_CLS_DTL_CLASS_NBR"]').text().replace(/&nbsp;/gi, '').trim();

                if (currClassNbr !== prevClassNbr && currClassNbr !== '') {
                    currSection = self.find('a[id^="MTG_SECTION"]').text().replace(/&nbsp;/gi, '').trim();
                    currComponent = self.find('span[id^="MTG_COMP"]').text().replace(/&nbsp;/gi, '').trim();
                    prevClassNbr = currClassNbr;
                    prevSection = currSection;
                    prevComponent = currComponent;
                } else {
                    currClassNbr = prevClassNbr;
                    currSection = prevSection;
                    currComponent = prevComponent;
                }

                currDaysTimes = self.find('span[id^="MTG_SCHED"]').text().trim();
                currRoom = self.find('span[id^="MTG_LOC"]').text().replace(/\s+/g, ' ').trim();
                currInstructor = self.find('span[id^="DERIVED_CLS_DTL_SSR_INSTR_LONG"]').text().replace(/\s+/g, ' ').trim();
                currStartEndDate = self.find('span[id^="MTG_DATES"]').text().trim();

                schedule.push({
                    classNbr: currClassNbr,
                    section: currSection,
                    component: currComponent,
                    daysTimes: currDaysTimes,
                    room: currRoom,
                    instructor: currInstructor,
                    startEndDate: currStartEndDate
                });
            });

            scheduleList.push({
                courseName: titleList[index],
                scheduleData: schedule
            });
        });

        text += 'BEGIN:VCALENDAR\n';
        text += 'VERSION:2.0\n';
        text += 'PRODID:-//ZIJIAN SHAO//QUEST RASPBERRY//EN\n';

        // parse schedule list
        scheduleList.forEach(function (elem) {

            var courseNameSplit = elem.courseName.split(' - ');
            var courseCode = courseNameSplit.shift();
            var courseFullName = courseNameSplit.join(' - ');

            elem.scheduleData.forEach(function (elem) {

                // if time not known
                if (elem.daysTimes === 'TBA' || elem.daysTimes.replace(/&nbsp;/g, '') === '') {
                    warningMsg += '- [ ' + courseCode + ' (' + elem.component + ') ] is missing details (maybe meeting times are "To Be Announced"), so it is excluded from the exported ics file.\n';
                    return;
                }

                // begin
                text += 'BEGIN:VEVENT\n';

                // date start & end
                var startEndDateSplit = elem.startEndDate.split(' - ');
                var startDate = startEndDateSplit[0],
                    endDate = startEndDateSplit[1];
                // var icsStartDate = startDate.replace(/\//g, ''),
                //     icsEndDate = endDate.replace(/\//g, '');
                var icsStartDate = _normalizeQuestDate(startDate),
                    icsEndDate = _normalizeQuestDate(endDate);

                var days = elem.daysTimes.match(/^[A-Z]+ /gi)[0].trim();
                var times = elem.daysTimes.replace(days + ' ', '');
                var startTime = _12hTo24h(times.split(' - ')[0]),
                    endTime = _12hTo24h(times.split(' - ')[1]);
                var icsStartTime = startTime.replace(/:/g, '') + '00',
                    icsEndTime = endTime.replace(/:/g, '') + '00';

                text += 'DTSTART:' + icsStartDate + 'T' + icsStartTime + '\n';
                text += 'DTEND:' + icsStartDate + 'T' + icsEndTime + '\n';

                var icsDays = [];
                if (days.match(/U/)) icsDays.push('SU');
                if (days.match(/M/)) icsDays.push('MO');
                if (days.match(/(T[^h])|(T$)/)) icsDays.push('TU');
                if (days.match(/W/)) icsDays.push('WE');
                if (days.match(/Th/)) icsDays.push('TH');
                if (days.match(/F/)) icsDays.push('FR');
                if (days.match(/S/)) icsDays.push('SA');
                icsDays = icsDays.join(',');

                // recurrence rule
                if (startDate !== endDate) {
                    text += 'RRULE:FREQ=WEEKLY;UNTIL=' + icsEndDate + 'T' + icsEndTime + ';WKST=SU;BYDAY=' + icsDays + '\n';
                }

                // summary
                var tmpSummary = summaryTpl;
                tmpSummary = tmpSummary.replace(/@code/g, courseCode)
                    .replace(/@section/gi, elem.section)
                    .replace(/@name/gi, courseFullName)
                    .replace(/@type/gi, elem.component)
                    .replace(/@location/gi, elem.room)
                    .replace(/@prof/gi, elem.instructor);
                text += 'SUMMARY:' + tmpSummary + '\n';

                // location
                text += 'LOCATION:' + elem.room + '\n';

                // description
                var tmpDescription = descriptionTpl;
                tmpDescription = tmpDescription.replace(/@code/gi, courseCode)
                    .replace(/@section/gi, elem.section)
                    .replace(/@name/gi, courseFullName)
                    .replace(/@type/gi, elem.component)
                    .replace(/@location/gi, elem.room)
                    .replace(/@prof/gi, elem.instructor);
                text += 'DESCRIPTION:' + tmpDescription + '\n';

                // end
                text += 'END:VEVENT\n';

                scheduleCount++;
            });

        });

        text += 'END:VCALENDAR';

        return text;
    }

    function _getURI(text) {
        return 'data:text/calendar;charset=UTF-8,' + encodeURIComponent(text);
    }

    function exportSchedule() {

        var flag = $('#win0divPSPAGECONTAINER > #ACE_width');
        if (flag.attr('data-export-schedule') === '1') return;
        flag.attr('data-export-schedule', '1');

        // export schedule
        var title = $('#DERIVED_REGFRM1_SS_TRANSACT_TITLE');
        var listViewRadio = $('input[id^="DERIVED_REGFRM1_SSR_SCHED_FORMAT"][checked]');
        var listViewLabel = listViewRadio.next('label');

        var studentName = $('#DERIVED_SSTSNAV_PERSON_NAME').text().trim();
        var termInfo = $('span[id^="DERIVED_REGFRM1_SSR_STDNTKEY_DESCR"]').text().trim();
        var fileName = studentName.toLowerCase().replace(/ /g, '-') + '-'
            + termInfo.split(' | ')[0].toLowerCase().replace(/ /g, '-')
            + '-class-schedule.ics';

        if (typeof title !== typeof undefined && title.text().match(/My Class Schedule/gi)
            && typeof listViewRadio !== typeof undefined && listViewLabel.text().match(/List View/gi)) {
            var expLinkTxt = _getButtonString('Export schedule');
            var expLink = $(expLinkTxt);
            expLink.attr('id', 'raspberry-export-link')
                .css({'margin-top': '-4px', 'float': 'right'})
                .insertBefore(title)
                .on('click', function (e) {
                    e.preventDefault();
                    warningMsg = '';
                    scheduleCount = 0;

                    var link = document.createElement('a');
                    document.body.appendChild(link);
                    link.href = _getURI(_getCalendarText());

                    if (scheduleCount === 0) warningMsg += '- No available days or times. Export operation is aborted.\n';
                    if (warningMsg !== '') alert(warningMsg);

                    link.download = fileName;
                    if (scheduleCount > 0) link.click();
                    document.body.removeChild(link);
                });

            var confLinkTxt = _getButtonString('Settings');
            var confLink = $(confLinkTxt);
            confLink.attr('id', 'raspberry-export-config')
                .css({'margin-top': '-4px', 'margin-left': '5px', 'float': 'right'})
                .insertBefore(expLink)
                .on('click', function (e) {
                    e.preventDefault();
                    _loadTpl();

                    var popupContent = $('<form></form>');
                    popupContent.append('<p><strong>Export Event Template</strong></p>')
                        .append('<ul><li>The exported ics file will use these templates to generate summary and description.</li>' +
                            '<li>Possible placeholders: @code, @section, @name, @type, @location, @prof.</li>' +
                            '<li>Leave empty to reset to default.</li></ul>')
                        .append('<p><strong>Summary</strong></p>')
                        .append('<p><input type="text" name="raspberry-summary-tpl"></p>')
                        .append('<p><strong>Description</strong></p>')
                        .append('<p><input type="text" name="raspberry-description-tpl"></p>')
                        .append('<hr>')
                        .append('<p><strong>Quest Start/End Date Format</strong></p>')
                        .append('<ul><li>Quest may display start/end date in various formats. Modify this field if it\'s incorrect.</li>' +
                            '<li>Possible placeholders: yyyy, mm, dd. Use lowercase letters only.</li>' +
                            '<li>Leave empty to reset to default.</li></ul>')
                        .append('<p><input type="text" name="raspberry-date-format-tpl"></p>')
                        .append('<hr>')
                        .append('<p><button type="submit" class="raspberry-btn">Save Settings</button></p>');
                    var popupID = popupUtil('init', {
                        title: 'Export Settings',
                        content: popupContent,
                        wide: true
                    });
                    var popup = $('#' + popupID);
                    popup.find('input[name="raspberry-summary-tpl"]').val(summaryTpl);
                    popup.find('input[name="raspberry-description-tpl"]').val(descriptionTpl);
                    popup.find('input[name="raspberry-date-format-tpl"]').val(dateFormatTpl);
                    popup.find('form').on('submit', function (e) {
                        e.preventDefault();

                        var newSummaryTpl = popup.find('input[name="raspberry-summary-tpl"]').val();
                        var newDescriptionTpl = popup.find('input[name="raspberry-description-tpl"]').val();
                        var newDateFormatTpl = popup.find('input[name="raspberry-date-format-tpl"]').val();

                        if (newSummaryTpl !== '')
                            window.localStorage.setItem('Raspberry.ExportSchedule.SummaryTpl', newSummaryTpl);
                        else
                            window.localStorage.removeItem('Raspberry.ExportSchedule.SummaryTpl');

                        if (newDescriptionTpl !== '')
                            window.localStorage.setItem('Raspberry.ExportSchedule.DescriptionTpl', newDescriptionTpl);
                        else
                            window.localStorage.removeItem('Raspberry.ExportSchedule.DescriptionTpl');

                        if (newDateFormatTpl !== '')
                            window.localStorage.setItem('Raspberry.ExportSchedule.DateFormatTpl', newDateFormatTpl);
                        else
                            window.localStorage.removeItem('Raspberry.ExportSchedule.DateFormatTpl');

                        _loadTpl();

                        popupUtil('hide', popupID);
                    });

                    popupUtil('show', popupID);
                });
        }
    }

    function quickRowClick() {

        var flag = $('#win0divPSPAGECONTAINER');
        if (flag.attr('data-row-click') === '1') return;
        flag.attr('data-row-click', '1');

        // click row to select radio
        var tblHead = $('div[id^="win0divSSR_DUMMY_RECV1GP"]');
        if (tblHead.length && tblHead.text().match(/Select a term then select Continue/g)) {
            $('tr[id^="trSSR_DUMMY_RECV1"]').on('click', function (e) {
                $(this).find('input[type="radio"]').prop('checked', true);
            });
        }
    }

    var warningMsg = '', scheduleCount = 0;

    var summaryTpl, descriptionTpl, dateFormatTpl;
    _loadTpl();

    exportSchedule();
    quickRowClick();
    $('#win0divPAGECONTAINER').on('DOMSubtreeModified', function () {
        exportSchedule();
        quickRowClick();
    });
}

initSsrSsenrlList();
