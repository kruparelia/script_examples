/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       20 Dec 2016     kruparelia
 *
 */

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
var ACCOUNT_ID = nlapiGetContext().getSetting('SCRIPT', 'custscript_ns_param_sc_account')

function clientPageInit(type) {
    if (type == 'create') {
        var origTranText = nlapiGetFieldText('custbody_ccc_trnx_link')
        if (origTranText.substring(0, 4).toLowerCase() == 'cash') {
            setSoftCreditFields('cashsale')
        } else {
            setSoftCreditFields('invoice')
        }
    }
}
disableAccount();


/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function clientSaveRecord() {

    return true;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Boolean} True to continue changing field value, false to abort value change
 */
function clientValidateField(type, name, linenum) {

    return true;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
function clientFieldChanged(type, name, linenum) {
    if (name == 'custbody_ccc_trnx_link') {
        var origTranText = nlapiGetFieldText('custbody_ccc_trnx_link')
        if (origTranText.substring(0, 4).toLowerCase() == 'cash') {
            setSoftCreditFields('cashsale')
        } else {
            setSoftCreditFields('invoice')
        }
    }

    if (name == 'amount' && linenum == 1) {
        nlapiSetCurrentLineItemValue('line', 'account', ACCOUNT_ID, true, true);
    }

}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @returns {Void}
 */
function clientPostSourcing(type, name) {
    if (name == 'custbody_ccc_trnx_link') {
        var origTranText = nlapiGetFieldText('custbody_ccc_trnx_link')
        if (origTranText.substring(0, 4).toLowerCase() == 'cash') {
            setSoftCreditFields('cashsale')
        } else {
            setSoftCreditFields('invoice')
        }
    }
    disableAccount();
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Void}
 */
function clientLineInit(type) {
    disableAccount();
    nlapiSetCurrentLineItemValue('line', 'account', ACCOUNT_ID, true, true);
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to save line item, false to abort save
 */
function clientValidateLine(type) {

    return true;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Void}
 */
function clientRecalc(type) {

}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to continue line item insert, false to abort insert
 */
function clientValidateInsert(type) {

    return true;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to continue line item delete, false to abort delete
 */
function clientValidateDelete(type) {

    return true;
}

function disableAccount() {

    nlapiDisableLineItemField('line', 'account', true);
}

function setSoftCreditFields(recordtype) {
    var origTranId = nlapiGetFieldValue('custbody_ns_ori_trnx_link');
    if (origTranId) {
        var arrFieldLookup = nlapiLookupField(recordtype, origTranId, ['entity', 'trandate', 'postingperiod', 'total', 'currency', 'exchangerate', 'subsidiary'])
        if (arrFieldLookup.entity) {
            nlapiSetFieldValue('custbody_ns_donor_orig_trnx', arrFieldLookup.entity)
        }
        if (arrFieldLookup.trandate) {
            nlapiSetFieldValue('trandate', arrFieldLookup.trandate)
        }
        if (arrFieldLookup.postingperio) {
            nlapiSetFieldValue('postingperiod', arrFieldLookup.postingperiod)
        }
        if (arrFieldLookup.total) {
            nlapiSetFieldValue('custbody_ns_amt_ori_trnx', arrFieldLookup.total)
        }
        if (arrFieldLookup.currency) {
            nlapiSetFieldValue('currency', arrFieldLookup.currency)
        }
        if (arrFieldLookup.exchangerate) {
            nlapiSetFieldValue('exchangerate', arrFieldLookup.exchangerate)
        }
        if (arrFieldLookup.subsidiary) {
            nlapiSetFieldValue('subsidiary', arrFieldLookup.subsidiary)
        }
    }


}