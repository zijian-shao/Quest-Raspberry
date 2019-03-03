function initUwSsTermDetail() {
    $('.PALEVEL0PRIMARY, .PSTEXT').closest('tr').find('td:empty').css('display', 'table-cell');
    $('.PSTEXT').closest('td').attr('align', 'right');
}

initUwSsTermDetail();