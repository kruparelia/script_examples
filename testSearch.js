/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 * @NModuleScope public
 */
define(['N/search', 'N/task', 'N/runtime', 'N/record', './searchOver1000.js'],
    function(search, task, runtime, record, search1000) {
        function execute(context) {
            var searchResults = search1000.getAllResults({
                id: 'customsearch163'
            });
        };
        return {
            execute: execute
        };
    });