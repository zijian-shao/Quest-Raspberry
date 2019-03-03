$.fn.loader = function () {
    this.addClass('raspberry-processing');
    this.append('<div class="raspberry-loader"></div>');
};

function homepageFunc() {
    $('body').addClass('raspberry-home');
    // switcher
    var switcher = $('#PT_HEADER .ps_pagetitle_cont .ps_custom_cont .ps_box-group.nuihdr_hpbtn .ps-button .ps-text');
    switcher.text(switcher.text().replace(' Homepage', ''));

    // loader
    $('.psc_processing').loader();

    // tile
    $('#PT_MAIN .ps_grid-body .nuitile').each(function (i, e) {
        var self = $(e),
            label = self.find('.ps-label'),
            titleBox = self.find('.ps_groupleth'),
            iconBox = self.find('.ps_box-grouplet'),
            title = self.find('.ps_groupleth .ps-label').text().trim(),
            extraText = '';

        titleBox.insertAfter(iconBox);

        if (title.match(/Grades/i)) {
            extraText = 'Course Grades in Each Term';
        } else if (title.match(/Class Schedule/i)) {
            extraText = 'Current Schedule, Important Dates';
        } else if (title.match(/Enroll/i)) {
            extraText = 'Add, Drop, Swap, Edit Classes';
        } else if (title.match(/Academics/i)) {
            extraText = 'Enrolment Letter, Transcript, Program\n';
        } else if (title.match(/Course Selection/i)) {
            extraText = 'Selection, Results, Offerings\n';
        } else if (title.match(/Financial Aid/i)) {
            extraText = 'Awards, Financial Aid, Funding';
        } else if (title.match(/Personal Information/i)) {
            extraText = 'View, Add, Modify, Delete My Info';
        } else if (title.match(/Finances/i)) {
            extraText = 'Account, Promissory Note, Tax Receipts';
        } else if (title.match(/Holds/i)) {
            extraText = 'Fees Owing, Academic Offence';
        } else {
            extraText = 'University of Waterloo';
        }
        $('<small>' + extraText + '</small>').insertAfter(label);
    });
}

function contentPageFunc() {
    $('body').addClass('raspberry-content');
}

if (currURL.match(/PT_LANDINGPAGE/)) {
    homepageFunc();
} else {
    contentPageFunc();
}
