function initUwCemCrseList() {
    $('#win0divUW_DERIVED_CEM_GROUP_BOX_2').closest('tr').find('td').attr('colspan', 100);
    $('#win0divDERIVED_CLSRCH_GROUPBOX1').closest('td').removeAttr('rowspan');
}

initUwCemCrseList();
