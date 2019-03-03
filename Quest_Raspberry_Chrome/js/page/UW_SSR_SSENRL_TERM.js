function initUwSsrSsenrlTerm() {
    $('tr[id^="trSSR_DUMMY_RECV1"]').on('click', function () {
        $(this).find('.PSRADIOBUTTON').first().prop('checked', true);
    })
}

initUwSsrSsenrlTerm();