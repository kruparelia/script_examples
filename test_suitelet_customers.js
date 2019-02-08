/*function suitelet_showAllCustomers(request, response) {
    var context = nlapiGetContext();
    var exContext = context.getExecutionContext();
    nlapiLogExecution('debug', 'ex context', exContext);
    var method = request.getMethod().toUpperCase();
    if (method == 'GET') {
                var stHtml = '<!DOCTYPE html>';
                stHtml += '<html>';
                stHtml += ' <head>';
                stHtml += '</head>';
                stHtml += '<body>';
                stHtml += '<h1> New Customers </h1>';
                stHtml += '<h2 id="result"></h2>'
                stHtml += 'function getData() { var filters = []; var columns = []; filters[0] = new nlobjSearchFilter("stage", null, "is", "CUSTOMER"); columns[0] = new nlobjSearchColumn("internalid", null, "COUNT");';
                stHtml += '</head>';
                stHtml += '</head>';
                stHtml += '</head>';
                stHtml += '</head>';
                stHtml += '</head>';
                stHtml += '</head>';
                response.write(stHtml);
        var results = getData();
        var form = nlapiCreateForm('Show Customers', true);
        //var css = form.addField('custpage_css', 'inlinehtml', "", null);
        //css.setDefaultValue('<head> <link rel="stylesheet" type="text/css" href="https://system.netsuite.com/core/media/media.nl?id=3745&c=TSTDRV1568114&h=ef7dc5386d04b428e4b4&_xt=.css"> </head>')
        var html = form.addField('custpage_html_cust', 'inlinehtml', "", null);

        //load client script
        var file = nlapiLoadFile(3741);
        var fileContents64 = file.getValue();
        //var fileContents = atob(fileContents64);
        html.setDefaultValue('<script>' + fileContents64 + '</script> ');
        //form.setScript('customscript_inject_html_customer');
        var showResults = form.addField('custpage_html_show', 'inlinehtml', "", null);
        showResults.setDefaultValue('');
        response.writePage(form);
    }
}*/

function suitelet_showAllCustomers(request, response) {
    var context = nlapiGetContext();
    var method = request.getMethod().toUpperCase();
    if (method == 'GET') {
        var stHtml = "";
        stHtml += "";
        stHtml += generateForm();
        stHtml += "";
        response.write(stHtml);
    }
}

function generateForm(exContext) {

    var result = getData();
    return '<!DOCTYPE html>' +
        '<html>' +
        ' <head>' +
        '   <meta charset="UTF-8">' +
        '   <title>Show customer list</title>' +
        '<link rel="stylesheet" type="text/css" href="https://system.netsuite.com/core/media/media.nl?id=3745&c=TSTDRV1568114&h=ef7dc5386d04b428e4b4&_xt=.css">' +
        ' </head>' +
        ' <body>' +
        '   <h1> New Customers </h1>' +
        '<h2 id="asdf"> ' + result + '</h2>' +
        '<script> setTimeout(function(){ console.log("refreshing");location = ""},5000) </script>' +
        ' </body>' +
        ' </html>'

}

function getData() {
    /* function modifyFilters(assocArray) {
         var result = [];
         for (var key in assocArray) {
             result.push(assocArray[key]);
         }
         return result;
     }*/

    var filters = [];
    var columns = [];
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

    filters[0] = new nlobjSearchFilter('stage', null, 'is', 'CUSTOMER');
    columns[0] = new nlobjSearchColumn('internalid', null, 'COUNT');

    var data = nlapiSearchRecord('customer', null, filters, columns)
    var result = data[0].getValue(columns[0]);
    nlapiLogExecution('debug', 'result', result);
    return result;
}