function pageCommon() {
    // top right corner loader
    $('#WAIT_win0').addClass('raspberry-loader');

    // static img
    function replaceImgIcon() {

        if (!options.GLB_HighResImage) return;

        if ($('#win0divPSPAGECONTAINER').attr('data-page-optimized') == '1' && optimizeLocked) return;

        $('img').each(function (i, e) {
            var self = $(e), src = self.attr('src'), fileName, fileExt;
            fileName = src.split('/');
            fileName = fileName[fileName.length - 1];
            fileName = fileName.split('.');
            fileExt = fileName[1];
            fileName = fileName[0];
            if (arr16x16.includes(fileName)) {
                self.addClass('raspberry-img-icon-replace ' +
                    'raspberry-img-icon-replace-16x16 ' +
                    'raspberry-img-icon-replace-' + fileName);
            }
            if (arr31x18.includes(fileName)) {
                self.addClass('raspberry-img-icon-replace ' +
                    'raspberry-img-icon-replace-31x18 ' +
                    'raspberry-img-icon-replace-' + fileName);
            }
            if (arr25x25.includes(fileName)) {
                self.addClass('raspberry-img-icon-replace ' +
                    'raspberry-img-icon-replace-25x25 ' +
                    'raspberry-img-icon-replace-' + fileName);
            }
            //PTPORTAL_POPBOX_LEFT_1, PTPORTAL_POPBOX_CENTER_1, PTPORTAL_POPBOX_RIGHT_1
        });

        // console.log('exed');
    }

    function optimizeControl() {
        $('#win0divPSPAGECONTAINER').attr('data-page-optimized', '1');
        optimizeLocked = true;
        setTimeout(function () {
            optimizeLocked = false;
        }, 1000);
    }

    var arr16x16 = [
        'PS_ACADEMIC_DEADLINES_ICN_1',
        'PS_COLLAPSE_ICN_1',
        'PS_CS_STATUS_ERROR_ICN_1',
        'PS_CS_STATUS_CLOSED_ICN_1',
        'PS_CS_STATUS_DROPPED_ICN_1',
        'PS_CS_STATUS_OPEN_ICN_1',
        'PS_CS_STATUS_SUCCESS_ICN_1',
        'PS_DELETE_ICN_1',
        'PS_EDIT_ICN_1',
        'PS_EXPAND_ICN_1',
        'PS_SCROLL_TOP_VER_ICN_1',
        'PT_CALENDAR_1',
        'PT_HELP_SWAN_1',
        'PT_PROMPT_LOOKUP_1'
    ];
    var arr25x25 = [
        'PS_CONFIRM_CHECKMARK_IMG_1',
        'PS_CS_MESSAGE_CONFIRM_ICN_1',
        'PS_CS_MESSAGE_WARNING_ICN_1',
        'PS_DELETE_QUESTION_IMG_1'
    ];
    var arr31x18 = [
        'PS_CS_STEP01_ENA_ICN_1',
        'PS_CS_STEP02_ENA_ICN_1',
        'PS_CS_STEP03_ENA_ICN_1',
        'PS_CS_STEP04_ENA_ICN_1',
        'PS_CS_STEP05_ENA_ICN_1',
        'PS_CS_STEP06_ENA_ICN_1',
        'PS_CS_STEP01_INP_ICN_1',
        'PS_CS_STEP02_INP_ICN_1',
        'PS_CS_STEP03_INP_ICN_1',
        'PS_CS_STEP04_INP_ICN_1',
        'PS_CS_STEP05_INP_ICN_1',
        'PS_CS_STEP06_INP_ICN_1',
        'PS_CS_STEP01_DIS_ICN_1',
        'PS_CS_STEP02_DIS_ICN_1',
        'PS_CS_STEP03_DIS_ICN_1',
        'PS_CS_STEP04_DIS_ICN_1',
        'PS_CS_STEP05_DIS_ICN_1',
        'PS_CS_STEP06_DIS_ICN_1'
    ];

    var optimizeLocked = false;

    replaceImgIcon();
    optimizeControl();

    $('#win0divPAGECONTAINER').on('DOMSubtreeModified', function () {
        setTimeout(function () {
            replaceImgIcon();
            optimizeControl();
        }, 5);

    });
}


pageCommon();