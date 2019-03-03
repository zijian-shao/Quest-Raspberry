function initSsCcVisaDoc() {
    var pleaseRead = $('.PAPAGEINSTRUCTIONS:contains(Please read)');
    $('<span>&nbsp;</span>').appendTo(pleaseRead);
    $('#UW_DERIVED_DOCS_').appendTo(pleaseRead);
}

initSsCcVisaDoc();