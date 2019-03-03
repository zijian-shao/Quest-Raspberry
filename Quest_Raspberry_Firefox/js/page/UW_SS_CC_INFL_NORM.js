function initSsCcInflNorm() {
    var pleaseRead = $('.PAPAGEINSTRUCTIONS:contains(Please see)');
    pleaseRead.closest('td').css('width', '100%');
    $('<span>&nbsp;</span>').appendTo(pleaseRead);
    $('#DERIVED_AA2_').appendTo(pleaseRead);
}

initSsCcInflNorm();