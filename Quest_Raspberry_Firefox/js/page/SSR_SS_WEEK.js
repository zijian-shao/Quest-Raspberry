function initSsrSsWeek() {

    function _getButtonString(text) {
        return '<a href="#" class="raspberry-btn">' + text + '</a>';
    }

    function _getExportSettings() {

        var res = window.localStorage.getItem('Raspberry.ExportSchedule.ImageResolution');
        if (res === null) {
            res = '1920x1080';
            window.localStorage.setItem('Raspberry.ExportSchedule.ImageResolution', res);
        }

        var margin = window.localStorage.getItem('Raspberry.ExportSchedule.ImageMargins');
        if (margin === null) {
            margin = [50, 50, 50, 50];
            window.localStorage.setItem('Raspberry.ExportSchedule.ImageMargins', JSON.stringify(margin));
        } else {
            margin = JSON.parse(margin);
        }

        return {
            resolution: res,
            margins: margin
        };
    }

    function optimizeSchedule() {

        var schedHtml = $('#WEEKLY_SCHED_HTMLAREA');
        if (typeof schedHtml.attr('data-optimized') !== typeof undefined) return;
        schedHtml.attr('data-optimized', '1');

        schedHtml.find('td').each(function (i, e) {
            var self = $(e);
            if (self.has('span').length && self.attr('scope') != 'row') {
                self.addClass('raspberry-schedule-td');
            }
            if (self.text().replace(/&nbsp;/g, '').trim() === '') {
                self.addClass('raspberry-empty-sched-td');
            }
        });

        schedHtml.children('colgroup').first().attr('width', '1%');

    }

    function calendarToCanvas(fileName) {
        var configs = _getExportSettings();
        var imgWidth = Number(configs.resolution.split('x')[0]);
        var imgHeight = Number(configs.resolution.split('x')[1]);

        // block page
        var pageBlock = document.createElement('div');
        pageBlock.className = 'raspberry-export-block-page';
        document.body.appendChild(pageBlock);

        // adjust ratio
        var calArea = document.getElementById("WEEKLY_SCHED_HTMLAREA");
        var currW = calArea.offsetWidth;
        var currH = calArea.offsetHeight;
        var ratio = currW / currH;
        var r16to9 = 16 / 9;
        var loopCount = 0;

        do {
            if (ratio > r16to9) currW -= 10; // too wide
            else if (ratio < r16to9) currW += 10; // too high
            else break;
            calArea.style.width = currW + 'px';
            currH = calArea.offsetHeight;
            ratio = currW / currH;
            loopCount++;
            if (loopCount > 300) break;
        } while (ratio < 1.75 || ratio > 1.81);

        // calendar to img
        html2canvas(calArea, {
            logging: false,
            windowWidth: currW,
            scale: 4
        }).then(function (canvas) {

            calArea.style.width = '';

            // add white borders
            var imgDiv = document.createElement('div');
            imgDiv.className = 'raspberry-export-image-div';
            imgDiv.style.width = imgWidth + 'px';
            imgDiv.style.height = imgHeight + 'px';
            imgDiv.appendChild(canvas);

            var newCanvasHeight = imgHeight - configs.margins[0] - configs.margins[2];
            canvas.style.width = '';
            canvas.style.height = newCanvasHeight + 'px';

            document.body.appendChild(imgDiv);

            // export file
            html2canvas(imgDiv, {
                logging: false,
                width: imgWidth,
                height: imgHeight,
                scale: 1
            }).then(function (imgCanvas) {

                document.body.removeChild(imgDiv);

                var link = document.createElement('a');
                document.body.appendChild(link);
                link.href = imgCanvas.toDataURL('image/png');
                link.download = fileName;
                link.click();
                document.body.removeChild(link);

                document.body.removeChild(pageBlock);

            });

        });
    }

    function exportImage() {

        if (isBrowser('firefox')) return;

        var flag = $('#win0divPSPAGECONTAINER > #ACE_width');
        if (flag.attr('data-export-schedule') === '1') return;
        flag.attr('data-export-schedule', '1');

        var title = $('#DERIVED_REGFRM1_SS_TRANSACT_TITLE');
        var listViewRadio = $('input[id^="DERIVED_REGFRM1_SSR_SCHED_FORMAT"][checked]');
        var listViewLabel = listViewRadio.next('label');

        var studentName = $('#DERIVED_SSTSNAV_PERSON_NAME').text().trim().toLowerCase().replace(/ /g, '-');
        var weekInfo = $('div[id^="win0divDERIVED_CLASS_S_DESCR"] > table > tbody > tr:first-child > td').text()
            .split(' - ')[0].toLowerCase().replace(/Week of /gi, '');
        weekInfo = weekInfo.split('/');
        weekInfo.forEach(function (el) {
            if (el.length === 1) el = '0' + el;
        });
        weekInfo = weekInfo.join('-');
        var fileName = studentName + '-' + weekInfo + '-class-schedule.png';

        if (typeof title !== typeof undefined && title.text().match(/My Class Schedule/gi)
            && typeof listViewRadio !== typeof undefined && listViewLabel.text().match(/Weekly Calendar View/gi)) {
            var expLinkTxt = _getButtonString('Export as image');
            var expLink = $(expLinkTxt);
            expLink.attr('id', 'raspberry-export-link')
                .css({'margin-top': '-4px', 'float': 'right'})
                .insertBefore(title)
                .on('click', function (e) {
                    e.preventDefault();
                    calendarToCanvas(fileName);
                });

            var confLinkTxt = _getButtonString('Settings');
            var confLink = $(confLinkTxt);
            confLink.attr('id', 'raspberry-export-config')
                .css({'margin-top': '-4px', 'margin-left': '5px', 'float': 'right'})
                .insertBefore(expLink)
                .on('click', function (e) {
                    e.preventDefault();
                    var popupContent = $('<form></form>');
                    popupContent.append('<p><strong>Image Resolution</strong></p>')
                        .append('<p><label><input type="radio" name="raspberry-resolution" value="1366x768"> 1366x768</label>' +
                            '<label><input type="radio" name="raspberry-resolution" value="1920x1080"> 1920x1080</label>' +
                            '<label><input type="radio" name="raspberry-resolution" value="2880x1620"> 2880x1620</label>' +
                            '<label><input type="radio" name="raspberry-resolution" value="3840x2160"> 3840x2160</label></p>')
                        .append('<hr>')
                        .append('<p><strong>Image Margins</strong></p>')
                        .append('<p class="raspberry-margin"><label><span>Top:</span><input type="number" min="0" max="500" step="1" name="raspberry-margin-top" value="0" required> px</label>' +
                            '<label class="hidden"><span>Left:</span><input type="number" min="0" max="500" step="1" name="raspberry-margin-left" value="0" required> px</label>' +
                            '<label><span>Bottom:</span><input type="number" min="0" max="500" step="1" name="raspberry-margin-bottom" value="0" required> px</label>' +
                            '<label class="hidden"><span>Right:</span><input type="number" min="0" max="500" step="1" name="raspberry-margin-right" value="0" required> px</label></p>')
                        .append('<hr>')
                        .append('<p><button type="submit" class="raspberry-btn">Save Settings</button></p>');
                    var popupID = popupUtil('init', {
                        title: 'Export Settings',
                        content: popupContent
                    });
                    var popup = $('#' + popupID);
                    var configs = _getExportSettings();
                    popup.find('input[name="raspberry-resolution"]').filter('[value="' + configs.resolution + '"]').prop('checked', true);
                    popup.find('input[name="raspberry-margin-top"]').val(configs.margins[0]);
                    popup.find('input[name="raspberry-margin-right"]').val(configs.margins[1]);
                    popup.find('input[name="raspberry-margin-bottom"]').val(configs.margins[2]);
                    popup.find('input[name="raspberry-margin-left"]').val(configs.margins[3]);
                    popup.find('form').on('submit', function (e) {
                        e.preventDefault();
                        window.localStorage.setItem('Raspberry.ExportSchedule.ImageResolution', popup.find('input[name="raspberry-resolution"]:checked').val());
                        window.localStorage.setItem('Raspberry.ExportSchedule.ImageMargins',
                            JSON.stringify([
                                Number(popup.find('input[name="raspberry-margin-top"]').val()),
                                Number(popup.find('input[name="raspberry-margin-right"]').val()),
                                Number(popup.find('input[name="raspberry-margin-bottom"]').val()),
                                Number(popup.find('input[name="raspberry-margin-left"]').val())
                            ])
                        );
                        popupUtil('hide', popupID);
                    });
                    popupUtil('show', popupID);
                });
        }
    }

    browser.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.action === 'executeScriptResponse') {
                if (request.data.hasOwnProperty('file')) {
                    if (request.data['file'] === baseURL + 'js/library/html2canvas.min.js') {

                    }
                } else if (request.data.hasOwnProperty('code')) {

                }
            }
        }
    );

    browser.runtime.sendMessage({
        action: 'executeScript',
        data: {
            file: 'js/library/html2canvas.min.js',
            allFrames: true
        }
    });

    optimizeSchedule();
    exportImage();
    $('#win0divPSPAGECONTAINER').on('DOMSubtreeModified', function () {
        optimizeSchedule();
        exportImage();
    });

}

initSsrSsWeek();
