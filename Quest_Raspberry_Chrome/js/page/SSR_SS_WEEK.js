function initSsrSsWeek() {
    function optimizeSchedule() {

        var schedHtml = $('#WEEKLY_SCHED_HTMLAREA');
        if (typeof schedHtml.attr('data-optimized') !== typeof undefined) return;
        schedHtml.attr('data-optimized', '1');

        schedHtml.find('td').each(function (i, e) {
            if ($(e).has('span').length && $(e).attr('scope') != 'row') {
                $(e).addClass('raspberry-schedule-td');
            }
        });

        // var prevWeek = $('#win0divDERIVED_CLASS_S_SSR_PREV_WEEK').css('margin-top', '4px');
        // var nextWeek = $('#win0divDERIVED_CLASS_S_SSR_NEXT_WEEK').css('margin-top', '4px');

        // var prevWeek = $('#win0divDERIVED_CLASS_S_SSR_PREV_WEEK').clone();
        // var nextWeek = $('#win0divDERIVED_CLASS_S_SSR_NEXT_WEEK').clone();
        // var weekInfo = $('div[id^="win0divDERIVED_CLASS_S_DESCR"]').clone();
        // var weekContainer = $('#win0divDERIVED_CLASS_S_GROUPBOX1');
        // weekContainer.html('');

        // var newRow = $('<tr/>');
        // newRow.append($('<td/>').append(prevWeek));
        // newRow.append($('<td/>').append(weekInfo));
        // newRow.append($('<td/>').append(nextWeek));
        // var newTable = $('<table/>');
        // newTable.append(newRow);
        // weekContainer.append(newTable);

        // var viewTR = $('#ACE_DERIVED_REGFRM1_SSR_SCHED_FORMAT label').first().closest('tr');
        // viewTR.children('td').first().remove();
        // viewTR.children('td').removeAttr('rowspan');
        //
        // $('#ACE_DERIVED_REGFRM1_SSR_SCHED_FORMAT label:contains(List View)').addClass('fl-right');
        // $('#ACE_DERIVED_REGFRM1_SSR_SCHED_FORMAT label:contains(Weekly Calendar View)').addClass('fl-left');

        // console.log('executed');
    }

    optimizeSchedule();
    $('#win0divPSPAGECONTAINER').on('DOMSubtreeModified', function () {
        optimizeSchedule();
    });
}

initSsrSsWeek();
