/*
 * Copyright (c) 1998-2018 NetSuite, Inc. 2955 Campus Drive, Suite 100, San
 * Mateo, CA, USA 94403-2511 All Rights Reserved. This software is the
 * confidential and proprietary information of NetSuite, Inc. ("Confidential
 * Information"). You shall not disclose such Confidential Information and shall
 * use it only in accordance with the terms of the license agreement you entered
 * into with NetSuite.
 */

/**
 * Developer Certification
 * 
 * Objective:
 *     Identify the functionality and best practices when using the Map/Reduce script type
 *     
 * The script searches for all payments in the system then groups it by customer
 * before adding each payment per customer.
 * 
 * 
 * @NApiVersion 2.0
 * @NScriptType MapReduceScript
 * @NModuleScope SameAccount
 */
define(['N/search'],
/**
 * @param {search} search
 */
function(search) {
   /**
    * Marks the beginning of the Map/Reduce process and generates input data.
    * At this stage, a search for all customer payments is created and returned
    * back to the system.
    *
    * @typedef {Object} ObjectRef
    * @property {number} id - Internal ID of the record instance
    * @property {string} type - Record type id
    *
    * @return {Array|Object|Search|RecordRef} inputSummary
    * @since 2015.1
    */
    function getInputData() {
       var paymentSearch = search.create({
          type: 'transaction',
          filters : [
             ['mainline', search.Operator.IS, true], 'and',
             ['type', search.Operator.ANYOF, 'CustPymt']
          ],
          columns : ['entity', 'total']
       });
       
       // Notice here that the search is returned immediately without the need to process it.
       return paymentSearch; 
    }

    
    /**
     * Executes when the map entry point is triggered and applies to each key/value pair.
     * The system automatically processes the search results and passes one element from the
     * result for processing.
     *
     * @param {MapSummary} context - Data collection containing the key/value pairs to process through the map stage
     * @since 2015.1
     */
    function map(context) {
       // Convert the JSON value returned by the system into a JS object
       var searchResult = JSON.parse(context.value);
       
       // Result is logged to see what the raw value looks like
       log.debug('RAW Map Data', context.value);
       
       var customerName = searchResult.values.entity.text;
       var paymentTotal  = searchResult.values.total;
       
       // Send the processed value back to the system as a key/value pair
       // These values are then grouped together for further processing
       // on the next stage of execution
       context.write({
          key   : customerName,
          value : paymentTotal
       });
    }

    
    /**
     * Executes when the reduce entry point is triggered and applies to each group.
     * The value passed to the method is a collection of key/value pairs that was
     * passed in the previous stage of the process.
     *
     * @param {ReduceSummary} context - Data collection containing the groups to process through the reduce stage
     * @since 2015.1
     */
    function reduce(context) {
       var total = 0;
       
       // At this point, the payments are already grouped by customer so all that's
       // left to be done is to total the values
       for (var i in context.values) {
          total += parseFloat(context.values[i]);
       }
       
       // Display the payment totals for the customer
       log.debug('Totals', 'Customer: ' + context.key + '\n' +
                           'Payment Total: ' + total);
    }

    /**
     * Executes when the summarize entry point is triggered and applies to the result set.
     * This shows how summary reporting and error handling is done in map/reduce scripts.
     *
     * @param {Summary} summary - Holds statistics regarding the execution of a map/reduce script
     * @since 2015.1
     */
    function summarize(summary) {
       // Number of processors alloted from this script
       log.audit('Number of Processors', summary.concurrency);
       // Number of yields performed during the lifetime of the execution
       log.audit('Number of Yields', summary.yields);
       
       // Display errors in the getInputData stage
       if (summary.inputSummary.error) {
          log.error('Input error', summary.inputSummary.error);
       }

       // Display errors in the map stage
       if (summary.mapSummary.errors.iterators) {
          summary.mapSummary.errors.iterators().each(function (code, message) {
             log.error('Map Error: ' + code, message);
             return true;
          });
       }

       // Display errors in the reduce stage
       if (summary.reduceSummary.errors.iterators) {
          summary.reduceSummary.errors.iterators().each(function (code, message) {
             log.error('Reduce Error: ' + code, message);
             return true;
          });
       }
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    };
    
});
