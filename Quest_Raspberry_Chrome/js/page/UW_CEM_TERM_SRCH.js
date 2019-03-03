function initUwTermSrch() {
    $('tr[id^="trUW_CEM_TR_SRCH$0_row"]').on('click', function () {
        $(this).find('a[id^="GRID_SELECT$"][class="PSHYPERLINK"]')[0].click();
    });
}

initUwTermSrch();
