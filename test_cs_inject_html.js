//function pageInit() {
alert('hello');
//var context = nlapiGetContext();
//var result = getData();
var html = '';
var url = 'https://rest.netsuite.com/app/site/hosting/restlet.nl?script=144&deploy=1';
var headers = new Array();
headers['Content-type'] = 'application/json';
headers['Authorization'] = 'NLAuth nlauth_email=kruparelia@netsuite.com, nlauth_signature=Uncleisbest123!, nlauth_account=TSTDRV1568114, nlauth_role=3';
console.log('asdf');
var result = nlapiRequestURL(url, null, headers);
console.log(result);
/*html += '<body>'
html += '<h1> New Customers </h1>'
html += '<h2>' + result + '</h2>'
html += '</body>'*/
//html = '<div>' + result + '</div>';
//nlapiSetFieldValue('custpage_html_cust', '<h1 id="asdf" style="font-size: 36px;">' + result + '</h1>');
var i = 0;
nlapiSetFieldValue('custpage_html_show', result);

/*(function loop() {
    var result2 = getData();
    var usageRemaining = context.getRemainingUsage();
    console.log('usage: ' + usageRemaining);
    if (usageRemaining < 30) {
        console.log('reloading page');
        location.reload();
    }
    if (result != result2) {
        console.log('change');
        result = result2
        nlapiSetFieldValue('custpage_html_cust', result);

    } else {
        console.log('no change');
    }
    if (i < 20) {
        setTimeout(loop, 3000)
    }

})();*/

//}

function getData() {
    /* function modifyFilters(assocArray) {
         var result = [];
         for (var key in assocArray) {
             result.push(assocArray[key]);
         }
         return result;
     }*/


    /*    columns["internalid"] = new nlobjSearchColumn('internalid');
        columns["companyname"] = new nlobjSearchColumn('companyname');
        filters.push(new nlobjSearchFilter('stage', null, 'is', 'CUSTOMER'));*/

    /*    var data = (nlapiSearchRecord("customer", null, filters, modifyFilters(columns)) || []).map(function(rec) {
            var internalId = rec.getValue(columns["internalid"]);
            var companyname = rec.getValue(columns["companyname"]);
            return {
                internalId: internalId,
                companyname: companyname
            }
        });*/

    var filters = [];
    var columns = [];

    filters[0] = new nlobjSearchFilter('stage', null, 'is', 'CUSTOMER');
    columns[0] = new nlobjSearchColumn('internalid', null, 'COUNT');

    var data = nlapiSearchRecord('customer', null, filters, columns)
    var result = data[0].getValue(columns[0]);
    //console.log(result);
    return result;
}