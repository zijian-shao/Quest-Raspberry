function initSsFaAwdAySel() {

    function optimizePage() {

        var flag = $('#win0divPSPAGECONTAINER');
        if (flag.attr('data-optimized') == '1') return;
        flag.attr('data-optimized', '1');

        $('td').removeAttr('rowspan').removeAttr('colspan').attr('align', 'left');
        // console.log('executed');
    }

    optimizePage();
    $('#win0divPAGECONTAINER').on('DOMSubtreeModified', function () {
        optimizePage();
    });

}
initSsFaAwdAySel();