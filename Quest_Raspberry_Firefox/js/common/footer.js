function footerCommon() {
    var footer = $('div[id^="win0divDERIVED_SSTSNAV_GROUP_BOX"]');
    if (footer.length > 1) {
        footer.last().addClass('raspberry-footer-full-width');
    }
}

footerCommon();