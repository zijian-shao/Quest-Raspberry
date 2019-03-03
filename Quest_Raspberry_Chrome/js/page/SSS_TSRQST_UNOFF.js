function initSssTsrqstUnoff() {
    // unofficial transcript
    var label1 = $('#win0divSA_REQUEST_HDR_INSTITUTIONlbl').clone();
    var label2 = $('#win0divDERIVED_SSTSRPT_TSCRPT_TYPE3lbl').clone();
    var box1 = $('#win0divSA_REQUEST_HDR_INSTITUTION').clone();
    var box2 = $('#win0divDERIVED_SSTSRPT_TSCRPT_TYPE3').clone();
    var btn = $('#win0divGO1').clone();

    $('#win0divSA_REQUEST_HDR_INSTITUTIONlbl').closest('tr').remove();
    $('#win0divDERIVED_SSTSRPT_TSCRPT_TYPE3lbl').closest('tr').remove();
    $('#win0divSA_REQUEST_HDR_INSTITUTION').closest('tr').remove();
    $('#win0divDERIVED_SSTSRPT_TSCRPT_TYPE3').closest('tr').remove();
    $('#win0divGO1').closest('tr').remove();

    var table = $('#ACE_TRANSCRIPT_TYPE_');
    table.css('width', '100%');
    var tableBody = table.children('tbody');

    var row;
    tableBody.prepend($('<tr><td colspan="10"><hr></td></tr>'));

    row = $('<tr/>');
    row.append($('<td/>', {'style': 'width:250px'}).append($('<span>&nbsp;</span>')));
    row.append($('<td/>').append(btn));
    tableBody.prepend(row);

    row = $('<tr/>');
    row.append($('<td/>', {'style': 'width:250px'}).append(label2));
    row.append($('<td/>').append(box2));
    tableBody.prepend(row);

    row = $('<tr/>');
    row.append($('<td/>', {'style': 'width:250px'}).append(label1));
    row.append($('<td/>').append(box1));
    tableBody.prepend(row);

    tableBody.prepend($('<tr><td colspan="10"><hr></td></tr>'));

    $('td').removeAttr('rowspan').attr('align', 'left');

    $('.PSLEVEL1GRIDLABEL').addClass('PSLEVEL1GRIDLABEL-GREY');

    var title = $('.PATRANSACTIONTITLE');
    if (!title.length || !title.text().match(/VIEW UNOFFICIAL TRANSCRIPT/i)) {
        $('body').addClass('raspberry-modal-content');
    }
    // console.log('executed - ' + currURL);
}

initSssTsrqstUnoff();
