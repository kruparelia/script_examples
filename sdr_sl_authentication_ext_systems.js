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
 *     Identify strategies for and implications of role management and authentication when integrating with external systems
 * 
 * This Suitelet script focuses on a method of outbound integration. When SuiteSignOn cannot be used, you can securely
 * send credentials out of NetSuite. Requirements:
 * - add credential fields to your form using form.addCredentialField()
 * - pass the credentials in an https request using the https module
 *  
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/https', 'N/runtime', 'N/ui/serverWidget'],

function(https, runtime, serverWidget) {
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
       
       
       if (request.method == 'GET'){
          var form = serverWidget.createForm({ title: 'Work with Credential Fields'});
          
          var script = runtime.getCurrentScript();
          form.addCredentialField({
             id                  : 'custpage_sdr_user_id',
             label               : 'External System User Id',
             restrictToDomains   : 'www.somesite.com',
             restrictToScriptIds : script.id
          });
          form.addCredentialField({
             id                  : 'custpage_sdr_password',
             label               : 'External System Password',
             restrictToDomains   : 'www.somesite.com',
             restrictToScriptIds : script.id
          });
             
          form.addSubmitButton({ label: 'Call External System'});
          
          response.writePage({ pageObject: form});
          
       } else { // POST processing
          var userIdHandle   = request.parameters.custpage_sdr_user_id;
          var passwordHandle = request.parameters.custpage_sdr_password;

          // Check the log and you'll see how the values have been automatically converted into GUIDs (globally unique identifiers),
          // which are used as handles to the actual credential values that were entered on the form.
          log.debug({ title: 'Handle for User Id' , details: userIdHandle});
          log.debug({ title: 'Handle for Password', details: passwordHandle});
          
          // Check Help Center on how to fully use the https module.
          // The credentials can be listed as an array construct in the
          // first parameter. An exception is returned if you try to use an http url.
          // When you make an https call, the system gets the credential values using the GUID based handles,
          // then encrypts with ssl encryption.
          
          // redirect to self
          var script = runtime.getCurrentScript();
          response.sendRedirect({
             type       : https.RedirectType.SUITELET,
             identifier : script.id,
             id         : script.deploymentId
          });          
       }
    }

    return {
        onRequest: onRequest
    };
    
});
