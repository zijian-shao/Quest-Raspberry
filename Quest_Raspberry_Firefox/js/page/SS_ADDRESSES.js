function initSsAddresses() {
    function optimizePage() {

        var flag = $('#win0divPSPAGECONTAINER');
        if (flag.attr('data-optimized') == '1') return;
        flag.attr('data-optimized', '1');

        if ($('#app_label').text().match(/Edit Address/i)
            || $('#DERIVED_ETEO_CONFIRM_TITLE').text().match(/Change Address/i)) {
            $('.ps_pagecontainer').css('width', '740px');
            $('td:empty').css('display', 'table-cell');
            $('td').attr('valign', 'top');
        } else {
            $('td').removeAttr('colspan');
            $('td').removeAttr('rowspan');
            $('.ps_pagecontainer').css('width', '100%');
            $('td:empty').css('display', 'none');
            $('td').attr('valign', 'middle');
        }

        // console.log('executed');
    }

    optimizePage();
    $('#win0divPAGECONTAINER').on('DOMSubtreeModified', function () {
        optimizePage();
    });

}

initSsAddresses();