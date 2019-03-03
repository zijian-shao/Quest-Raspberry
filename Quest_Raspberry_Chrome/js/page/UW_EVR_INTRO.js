function initUwEvrIntro() {
    function optimizePage() {

        var flag = $('#win0divPSPAGECONTAINER');
        if (flag.attr('data-optimized') == '1') return;
        flag.attr('data-optimized', '1');

        var wrapperTitle = $('.PSLEVEL1SCROLLAREAHEADER');
        if (wrapperTitle.length && wrapperTitle.text().match(/Select Processing Options/i)) {
            $('table[id^="ENRL_VER_RQ_DET$scrolli"] td:empty').css('display', 'table-cell');
        }

        // console.log('executed');
    }

    optimizePage();
    $('#win0divPAGECONTAINER').on('DOMSubtreeModified', function () {
        optimizePage();
    });
}

initUwEvrIntro();