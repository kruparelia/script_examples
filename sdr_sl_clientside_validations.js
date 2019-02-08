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
 * This is a Suitelet script which performs some data validation.
 * This script is called as an AJAX request from a client-side SuiteScript.
 * The advantage of validating in the Suitelet is the validation algorithm is
 * hidden from the front-end. And because this Suitelet is called as an AJAX
 * request, the user experience is not impacted.
 * 
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define([],

function() {
   
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
       
       if (request.method == 'POST'){
          var projectedTotal = parseFloat(request.body);
          
          log.debug({title: 'projected total', details: projectedTotal});
          
          if (projectedTotal > 1000){
             response.write('F');
          } else {
             response.write('T');
          }
       }
    }

    return {
        onRequest: onRequest
    };
    
});
