// create search; alternatively nlapiLoadSearch() can be used to load a saved search
var search = nlapiCreateSearch('salesorder', ['mainline', 'is', 'T']);
var searchResults = search.runSearch();

// resultIndex points to record starting current resultSet in the entire results array 
var resultIndex = 0;
var resultStep = 1000; // Number of records returned in one step (maximum is 1000)
var resultSet; // temporary variable used to store the result set
do {
    // fetch one result set
    resultSet = searchResults.getResults(resultIndex, resultIndex + resultStep);

    // increase pointer
    resultIndex = resultIndex + resultStep;

    // process or log the results
    nlapiLogExecution('DEBUG', 'resultSet returned', resultSet.length +
        ' records returned');
    // once no records are returned we already got all of them
} while (resultSet.length > 0)


var search = nlapiLoadSearch('transaction', '1067449');
var searchResults = search.runSearch();

var resultIndex = 0;
var resultStep = 1000;
var resultSet = [];

for (var i = resultIndex; i < 5; i++) {
    resultSet[i] = searchResults.getResults(resultIndex, resultStep)
    resultIndex = resultStep + 1;
    resultStep += 1001;
}