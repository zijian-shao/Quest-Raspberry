function initSsCcEmrgCntctL() {
    function optimizePage() {

        var flag = $('#win0divPSPAGECONTAINER');
        if (flag.attr('data-optimized') == '1') return;
        flag.attr('data-optimized', '1');
        //
        // if ($('.PAPAGETITLE').text().match(/Emergency Contact Detail/i)) {
        //     $('.ps_pagecontainer').css('width', '740px');
        //     $('td:empty').css('display', 'table-cell');
        //     $('td').attr('valign', 'top');
        //     $('#win0divDERIVED_SSTSNAV_PERSON_NAME').closest('tr').remove();
        // } else {
        //     $('.ps_pagecontainer').css('width', '100%');
        //     $('td:empty').css('display', 'none');
        //     $('td').attr('valign', 'middle');
        // }
        if ($('.PAPAGETITLE').text().match(/Emergency Contact Detail/i)
            || $('.PSSRCHTITLE #app_label').text().match(/Edit Address/i)) {

            $('#raspberry-css-placeholder').remove();
            var targetStyles = $('link[id^="raspberry-css-"]');
            $('<div/>', {
                id: 'raspberry-css-placeholder'
            }).insertBefore(targetStyles.first());
            targetStyles.remove();

        } else {

            var placeholder = $('#raspberry-css-placeholder');
            styleBackup.insertAfter(placeholder);
            placeholder.remove();

            $('.ps_pagecontainer').css('width', '100%');
            $('td:empty').css('display', 'none');
            $('td').attr('valign', 'middle');
        }
        // console.log('executed');
    }

    var styleBackup = $('link[id^="raspberry-css-"]').clone();

    optimizePage();
    $('#win0divPAGECONTAINER').on('DOMSubtreeModified', function () {
        optimizePage();
    });

}

initSsCcEmrgCntctL();