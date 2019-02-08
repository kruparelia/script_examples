/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function updateSuitelet_AfterSubmit(type) {
    if (type == 'create') {
        var x = nlapiResolveURL('SUITELET', 'customscript_probono_test_show_cust', 'customdeploy_probono_test_show_cust')

        nlapiLogExecution('debug', 'suitelet url', x);
        nlapiRequestURL('https://system.netsuite.com' + x);
    }
}