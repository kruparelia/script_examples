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
 *     Identify the risks of implementing only client-side validations and
 *     strategies to address them.
 * 
 * Risks with client-side validation:
 *     1 - There is a general risk of script behaving incorrectly in the browser. You can get around
 *         this by repeating validation at Before Submit in User Event script.
 *     2 - There is a risk of the algorithm used in the validation being exposed to the end user. 
 *         The algorithm can be easily seen by inspecting the html page source of the web page.
 *         See saveRecord_option2 that keeps validation on the client in support of a 
 *         better user experience, but uses a Suitelet to contain the validation algorithm.
 * 
 * @NApiVersion 2.0
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/https', 'N/url'],

function(https, url) {
    /**
     * In this option, the entire validation is on the client.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord_option1(scriptContext) {
       var opportunity = scriptContext.currentRecord;
       var projectedTotal = opportunity.getValue({fieldId : 'projectedtotal'}); 
       
       if (projectedTotal > 1000){
          alert('Total is greater than the allowable limit');
          return false;
       }
       
        return true;
    }
    
    /**
     * In this option, the validation is executed from the client, but the validation algorithm is
     * hidden in a Suitelet on the server.
     * 
     * @param {Object} scriptContext
     * @param {Record} scriptContext.currentRecord - Current form record
     * @returns {boolean} Return true if record is valid
     *
     * @since 2015.2
     */
    function saveRecord_option2(scriptContext) {
       var opportunity = scriptContext.currentRecord;
       var projectedTotal = opportunity.getValue({fieldId : 'projectedtotal'});

       var suiteletUrl = url.resolveScript({
          scriptId     : 'customscript_sdr_sl_client_validations',
          deploymentId : 'customdeploy_sdr_sl_client_validations'
       });
       
       // Call Suitelet and pass Projected Total value using a POST request (AJAX)
       var response = https.post({ url: suiteletUrl, body: projectedTotal });
       
       if (response.body == 'F'){
          alert('Total is greater than the allowable limit');
          return false;
       }
       
        return true;
    }

    return {
        saveRecord: saveRecord_option1
    };
});
