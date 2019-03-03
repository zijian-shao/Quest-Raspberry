function headingCommon() {
    var heading = $('div[id^="win0divDERIVED_SSTSNAV_GROUP_BOX"]');
    // if (heading.length > 1) {
    //     heading.first().addClass('raspberry-heading-full-width');
    // }
    if (heading.first().find('#ACE_DERIVED_SSTSNAV_GROUP_BOX').length) {
        heading.first().addClass('raspberry-heading-full-width');
    }
}

headingCommon();