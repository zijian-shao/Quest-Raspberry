function initUwPcsSrch() {

    function optimizePage() {

        var flag = $('#win0divPSPAGECONTAINER');
        if (flag.attr('data-optimized') == '1') return;
        flag.attr('data-optimized', '1');

        if ($('#DERIVED_REGFRM1_TITLE1').text().match(/View Course Offerings Search Results/i)) {
            $('#win0divPAGECONTAINER').find('td:empty').remove();
        } else {
            $('#win0divUW_PCS_SRCH_WRK_CLASS_SEARCH_PB').closest('tr').find('td:empty').remove();
        }

    }

    optimizePage();
    $('#win0divPAGECONTAINER').on('DOMSubtreeModified', function () {
        optimizePage();
    });

    // if ()

}

initUwPcsSrch();

// var targetTBody = $('#win0divUW_PCS_SRCH_WRK_STRM').closest('tbody');
//
// var targetRows = targetTBody.children('tr:gt(2)').clone();
// targetTBody.children('tr:gt(2)').remove();
// targetRows.find('td').css('vertical-align', 'top');
//
// var newRow = $('<tr/>');
// var newTable = $('<table/>', {
//     'style': 'width: 600px'
// });
//
// newTable.append(targetRows);
// newRow.append(newTable);
// targetTBody.append(newRow);

// var row;
// row = $('#win0divUW_PCS_SRCH_WRK_STRMlbl').closest('tr');
// row.prev().before(row);
//
// row = $('#win0divUW_PCS_SRCH_WRK_SUBJECTlbl').closest('tr');
// row.prev().before(row);
//
// $('span.PAADDITIONALINSTRUCTIONS').css({
//     'display': 'inline-block',
//     'margin-bottom': '20px'
// }).closest('tr').before($('<tr><td>&nbsp;</td></tr>'));
// ;
//
// row = $('#win0divUW_PCS_SRCH_WRK_CLASS_SEARCH_PB');
// row.closest('tr').find('td:empty').remove();
// row.closest('tr').next().insertAfter(row.closest('table').closest('tr'));
// $('#win0divDERIVED_CLSRCH_SSR_GROUP_FTR1').closest('tr').find('td:empty').remove();