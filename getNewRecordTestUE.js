function afterSubmit_vendBill() {
    var rec = nlapiGetNewRecord();
    rec.setFieldValue('memo', 'see if this works');
    nlapiSubmitRecord(rec);
}