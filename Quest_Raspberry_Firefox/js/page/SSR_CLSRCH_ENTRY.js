function initSsrClsrchEntry() {

    function optimizePage() {

        var flag = $('#win0divPSPAGECONTAINER');
        if (flag.attr('data-optimized') == '1' && optimizeLocked) return;
        flag.attr('data-optimized', '1');
        optimizeLocked = true;
        setTimeout(function () {
            optimizeLocked = false;
        }, 1000);

        $('#win0divDERIVED_REGFRM1_GROUP_BOX').closest('tr').find('td').first().removeAttr('height');
        $('#win0divDERIVED_CLSRCH_GROUPBOX1').closest('tr').find('td').first().removeAttr('height');

        // console.log('executed');
    }

    var optimizeLocked = false;
    optimizePage();

    $('#win0divPAGECONTAINER').on('DOMSubtreeModified', function () {
        setTimeout(function () {
            optimizePage();
        }, 5);
    });

}

initSsrClsrchEntry();