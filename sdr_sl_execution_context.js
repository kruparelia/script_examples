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
 *     Identify the impact of execution context on user event scripts
 * 
 * This is a simple Suitelet that loads and updates a vendor record.
 * Check what happens with any user event scripts that might be deployed to vendors. 
 * 
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/http', 'N/record','N/runtime', 'N/ui/serverWidget'],

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
       
       var vendorId = '231';  // hardcoding a vendor internal id to use for testing this script
          
       if (request.method == 'GET'){
          var form = serverWidget.createForm({ title: 'Update Records' });          
          var vendorNameFld = form.addField({
             id    : 'custpage_sdr_vendor_name',
             label : 'Vendor Name',
             type  : serverWidget.FieldType.TEXT
          });
          var vendorFaxFld = form.addField({
             id    : 'custpage_sdr_vendor_fax',
             label : 'Vendor Fax',
             type  : serverWidget.FieldType.PHONE
          });
          form.addSubmitButton({ fieldId : 'Update Vendor' });
          
          var vendor = record.load({ type: record.Type.VENDOR, id: vendorId, isDynamic: true });
          var vendorName = vendor.getValue({ fieldId : 'entityid' });
          var vendorFax  = vendor.getValue({ fieldId : 'fax'} );
          
          vendorNameFld.defaultValue = vendorName;
          vendorNameFld.updateDisplayType({ displayType : serverWidget.FieldDisplayType.INLINE });
          vendorFaxFld.defaultValue = vendorFax;
          
          response.writePage({ pageObject : form });
          
       } else {
          // POST processing
          
          // Update vendor record    
          vendorFax = request.parameters.custpage_sdr_vendor_fax;

          vendor = record.load({ type: record.Type.VENDOR, id: vendorId, isDynamic: true });
          vendor.setValue({ fieldId: 'fax', value: vendorFax });
          vendor.save();
       
          // redirect to self
          var script = runtime.getCurrentScript();
          response.sendRedirect({
             type       : http.RedirectType.SUITELET,
             identifier : script.id,
             id         : script.deploymentId
          });
       }
    }

    return {
        onRequest: onRequest
    };
    
});