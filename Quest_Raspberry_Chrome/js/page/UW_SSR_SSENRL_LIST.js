function initUwSsrSsenrlList() {
    var tables = $('table.PSLEVEL3GRIDNBO');
    tables.find('tbody tr[id^="trCLASS_MTG_VW"]').each(function (i, e) {
        if ($(e).text().trim() == '') {
            $(e).hide();
        }
    });
}

initUwSsrSsenrlList();