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
 *     Determine how to interact with custom child record sublists in SuiteScript
 * 
 * This script shows how multiple custom records can be generated via a parent-child record
 * relationship. In this scenario there is a parent custom record type used to hold the
 * relationship. The child is a performance review custom record type. The idea is to generate
 * multiple performance reviews quickly by adding them as sublist lines to a parent record.
 * 
 * A chief reason for creating the performance reviews in this way is that governance usage is
 * limited to the governance of one execution of Record.save(). There is no usage adding sublist lines.
 * So this is a perfect type of script to use when mass updating/creating a set of custom records.
 * 
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/http','N/record','N/runtime','N/ui/serverWidget'],

function(http, record, runtime, serverWidget) {
    /**
     * Definition of the Suitelet script trigger point.
     *
     * @param {Object} context
     * @param {ServerRequest} context.request - Encapsulation of the incoming request
     * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
     * @Since 2015.2
     */
    function onRequest(context) {
       var request  = context.request;
       var response = context.response;
       
       if (request.method == http.Method.GET){
          var form = serverWidget.createForm({ title: 'Generate Performance Reviews'});
          
          // Get URL parameter that would have been set upon previous POST
          var processed = request.parameters.custparam_processed;

          if (processed){
             form.addField({
                id   : 'custpage_sdr_message',
                type : serverWidget.FieldType.HELP,
                label: '5 Performance reviews created.'
             });
          } else {
             form.addSubmitButton({ label: 'Create Performance Reviews' });         
          }
          
          response.writePage({ pageObject : form });
                
       } else {
          log.debug({
             title   : 'Starting Unit Usage',
             details : runtime.getCurrentScript().getRemainingUsage()
          });
          
          var parentRecord = record.create({type: 'customrecord_perf_rev_mass_updater', isDynamic: true});
          
          var perfReviewList = 'recmachcustrecord_sdr_perf_review_mass_updater';
          var reviewNumber = 1;
          var salary       = 3000;
          
          for (var i=0; i < 5; i++){
             parentRecord.selectNewLine({ sublistId: perfReviewList });
             parentRecord.setCurrentSublistValue({
                sublistId : perfReviewList,
                fieldId   : 'name',
                value     : 'Review' + reviewNumber
             });
             parentRecord.setCurrentSublistValue({
                sublistId : perfReviewList,
                fieldId   : 'custrecord_sdr_perf_subordinate',
                value     : '640' // 640 = James Rollings
             });
             parentRecord.setCurrentSublistValue({
                sublistId : perfReviewList,
                fieldId   : 'custrecord_sdr_perf_review_date',
                value     : new Date()
             });
             parentRecord.setCurrentSublistValue({
                sublistId : perfReviewList,
                fieldId   : 'custrecord_sdr_perf_review_type',
                value     : 1 // 1 = Salary Change 
             });
             parentRecord.setCurrentSublistValue({
                sublistId : perfReviewList,
                fieldId   : 'custrecord_sdr_perf_rating_code',
                value     : 'A'
             });
             parentRecord.setCurrentSublistValue({
                sublistId : perfReviewList,
                fieldId   : 'custrecord_sdr_perf_sal_incr_amt',
                value     : salary
             });
             parentRecord.commitLine({ sublistId: perfReviewList });
             
             reviewNumber++;
             salary += 100;
          }
          
          parentRecord.save();
          
          log.debug({
             title   : 'Ending Unit Usage',
             details : runtime.getCurrentScript().getRemainingUsage()
          });
          
          // Redirect to self
          // Set a parameter indicating that performance reviews were generated, so message can
          // be set upon re-display of the Suitelet
          var script = runtime.getCurrentScript();
          response.sendRedirect({
             type       : http.RedirectType.SUITELET,
             identifier : script.id,
             id         : script.deploymentId,
             parameters : {custparam_processed: 'T'}
          });          
       }
    }

    return {
        onRequest: onRequest
    };
});
