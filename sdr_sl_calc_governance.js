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
 *     Calculate the governance of a script
 * 
 * This is a Suitelet script which updates a few records. Remaining usage is logged to help identify
 * api usage. In this example of unit consumption, you'll be able to contrast differences between
 * standard transactional records (e.g. opportunity), standard non-transactional records (e.g. vendor)
 * and custom records (e.g. performance review). 
 * 
 * Note that object methods do not consume usage units. Only certain api functions, such as
 * record.load() and Record.save().
 *  
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/runtime', 'N/ui/serverWidget'],
/**
 * @param {record} record
 * @param {runtime} runtime
 * @param {serverWidget} serverWidget
 */
function(record, runtime, serverWidget) {
   
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
       
       var script = runtime.getCurrentScript();
       
       log.debug({ title: 'Remaining Usage - Start of GET', details: script.getRemainingUsage()});
       
       // Get parameters for record IDs that would have been set upon previous POST
       var opportunityId = request.parameters.custparam_opportunityId;
       var vendorId      = request.parameters.custparam_vendorId;
       var perfRevId     = request.parameters.custparam_perfReviewId;
       
       if (request.method == 'GET') {
          var form = serverWidget.createForm({ title: 'Update Records'});
          
          var opportunityFld = form.addField({
             id      : 'custpage_sdr_opportunity',
             label   : 'Opportunity',
             type    : serverWidget.FieldType.SELECT,
             source  : 'opportunity'
          });
          var vendorFld = form.addField({
             id      : 'custpage_sdr_vendor',
             label   : 'Vendor',
             type    : serverWidget.FieldType.SELECT,
             source  : 'vendor'
          });
          var perfReviewFld = form.addField({
             id      : 'custpage_sdr_perf_review',
             label   : 'Performance Review',
             type    : serverWidget.FieldType.SELECT,
             source  : 'customrecord_sdr_perf_review'
          });
          
          if (opportunityId) { opportunityFld.defaultValue = opportunityId; }
          if (vendorId)      { vendorFld.defaultValue      = vendorId; }
          if (perfRevId)     { perfReviewFld.defaultValue  = perfRevId; }
          
          form.addSubmitButton({ label: 'Load and Submit Records'});
          
          response.writePage({ pageObject: form});
          
       } else { // POST processing
          // Load and submit each record, calculating governance along the way
          
          log.debug({ title: 'Remaining Usage - Start of POST', details: script.getRemainingUsage()});
          
          opportunityId = request.parameters.custpage_sdr_opportunity;
          vendorId      = request.parameters.custpage_sdr_vendor;
          perfRevId     = request.parameters.custpage_sdr_perf_review;
       
          var timestamp = new Date();
          
          var opportunity = record.load({ type: record.Type.OPPORTUNITY, id: opportunityId});
          log.debug({ title: 'Remaining Usage - After Load of Opportunity', details: script.getRemainingUsage()});
          opportunity.setValue({ fieldId: 'memo', value: timestamp});
          
          var vendor = record.load({ type: record.Type.VENDOR, id: vendorId});
          log.debug({ title: 'Remaining Usage - After Load of Vendor', details: script.getRemainingUsage()});
          vendor.setValue({ fieldId: 'comments', value: timestamp});
          
          var perfRev = record.load({ type: 'customrecord_sdr_perf_review', id: perfRevId});
          log.debug({ title: 'Remaining Usage - After Load of Performance Review', details: script.getRemainingUsage()});
          vendor.setValue({ fieldId: 'comments', value: timestamp});
          
          opportunity.save();
          log.debug({ title: 'Remaining Usage - After Submit of Opportunity', details: script.getRemainingUsage()});
          
          vendor.save();
          log.debug({ title: 'Remaining Usage - After Submit of Vendor', details: script.getRemainingUsage()});
          
          perfRev.save();
          log.debug({ title: 'Remaining Usage - After Submit of Performance Review', details: script.getRemainingUsage()});
          
          // Redirect to self
          // Dend the selected opportunity, vendor, and performance review record IDs in the
          // request so the dropdowns can be re-populated with their values
          
          response.sendRedirect({
             type       : 'SUITELET',
             identifier : script.id,
             id         : script.deploymentId,
             parameters : { custparam_opportunityId : opportunityId,
                            custparam_vendorId      : vendorId,
                            custparam_perfReviewId  : perfRevId
                          }
          });  
       }
    }

    return {
        onRequest: onRequest
    };
    
});
