function GetSearchResult() {
    //array container for search results

    var filters = [];
    var columns = [];

    filters[0] = new nlobjSearchFilter('stage', null, 'is', 'CUSTOMER');
    columns[0] = new nlobjSearchColumn('internalid', null, 'COUNT');

    var data = nlapiSearchRecord('customer', null, filters, columns)
    var result = data[0].getValue(columns[0]);

    return result;
}