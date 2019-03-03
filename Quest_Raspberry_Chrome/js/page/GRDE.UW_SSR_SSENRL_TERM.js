function initGrdeUwSsrSsenrlTerm() {

    function optimizePage() {

        var flag = $('#win0divPSPAGECONTAINER');
        if (flag.attr('data-optimized') == '1' && optimizeLocked) return;
        flag.attr('data-optimized', '1');
        optimizeLocked = true;
        setTimeout(function () {
            optimizeLocked = false;
        }, 1000);

        $('tr[id^="trSSR_DUMMY_RECV1$0_row"]').on('click', function () {
            $(this).find('input[id^="SSR_DUMMY_RECV1$sels$"][class="PSRADIOBUTTON"]').prop('checked', true);
        });
    }

    var optimizeLocked = false;
    optimizePage();

    $('#win0divPAGECONTAINER').on('DOMSubtreeModified', function () {
        setTimeout(function () {
            optimizePage();
        }, 5);
    });
}

initGrdeUwSsrSsenrlTerm();