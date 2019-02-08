/**
 * @NApiVersion 2.x
 * @NModuleScope public
 */

define(['N/error', 'N/record', 'N/search', 'N/runtime'],
    function(error, record, search, runtime) {
        return {

            /**
             * This function return more than the max 1000 records for a search
             * @param  {object} options type: type of record to search against
             *                          filters: search filters
             *                          columns: search columns
             *                          id: search id for a pre-existing search
             * @return {Object}         Returns the entire result set of a search
             */
            getAllResults: function(options) {

                var arrResults = [];
                var MAX_SEARCH_SIZE = 1000;

                var searchObj;
                // determine if a search should be loaded or created based on id
                if (options.id) {
                    searchObj = search.load(options);
                    // add additional filters or columns if provided
                    if (options.filters) {
                        searchObj.filters = searchObj.filters.concat(options.filters);
                    }
                    if (options.columns) {
                        searchObj.columns = searchObj.columns.concat(options.columns);
                    }
                } else {
                    searchObj = search.create(options);
                }

                var count = 0;
                var searchResult = searchObj.run();
                // loop through results and concat 1000 results each time
                do {
                    var resultSet = searchResult.getRange({
                        start: count,
                        end: count + MAX_SEARCH_SIZE
                    });
                    arrResults = arrResults.concat(resultSet);
                    count += MAX_SEARCH_SIZE;
                } while (resultSet.length > 0);

                return arrResults;
            },

            runSearch: function() {
                var searchId = "customsearch163";
                var results = getAllResults({
                    id: searchId
                });
                console.log(results);
            }
        };
    });