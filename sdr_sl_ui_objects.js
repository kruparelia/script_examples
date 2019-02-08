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
 *     Identify the capabilities of UI objects
 * 
 * UI objects are very powerful. This shows how you can create custom
 * Form based user interfaces with fields, field groups, subtabs,
 * and sublists.
 * 
 * There is much more. You can create List and Assistant interfaces too.
 * Portions of portlet objects have similarities. Before Load user event
 * scripts accept a serverWidget.Form parameter, so there is some ability
 * to add to and manipulate forms in UE scripts.
 * See Help Center for details.
 *  
 * @NApiVersion 2.0
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/http', 'N/runtime', 'N/ui/serverWidget'],

function(http, runtime, serverWidget) {
   
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
       
       // GET request to generate UI
       if (request.method == http.Method.GET){
          var form = serverWidget.createForm({ title: 'serverWidget.Form With Standard Content'});
             
          // add field group
          form.addFieldGroup({ id: 'fieldgroup1', label: 'Field Group 1'});
          
          // add fields, associating with field group
          form.addField({
             id        : 'field1',
             type      : serverWidget.FieldType.TEXT,
             label     : 'Field 1',
             container : 'fieldgroup1'
          });
          var field2 = form.addField({
             id        : 'field2',
             type      : serverWidget.FieldType.CURRENCY,
             label     : 'Field 2',
             container : 'fieldgroup1'
          });
          var field3 = form.addField({
             id        : 'field3',
             type      : serverWidget.FieldType.RICHTEXT,
             label     : 'Field 3',
             container : 'fieldgroup1'
          });
          var field4 = form.addField({
             id        : 'field4',
             type      : serverWidget.FieldType.TEXT,
             label     : 'Field 4',
             container : 'fieldgroup1'
          });
          var field5 = form.addField({
             id        : 'field5',
             type      : serverWidget.FieldType.TEXT,
             label     : 'Field 5',
             container : 'fieldgroup1'
          });
          
          field2.defaultValue = 777444.88;
          field3.isMandatory  = true;
          field3.updateDisplaySize({ height: 20, width: 4});
          field4.updateDisplayType({ displayType: serverWidget.FieldDisplayType.DISABLED });
          field5.setHelpText({ help: 'This is field5. Enter something nice.' });

          
          // add a subtab
          form.addSubtab({ id: 'subtab1', label: 'Subtab 1' });

          // add fields to subtab
          form.addField({
             id        : 'subtabfld1',
             type      : serverWidget.FieldType.TEXT,
             label     : 'Subtab Field 1',
             container : 'subtab1'
          });
          form.addField({
             id        : 'subtabfld2',
             type      : serverWidget.FieldType.TEXT,
             label     : 'Subtab Field 2',
             container : 'subtab1'
          });
             
          
          // add another subtab
          form.addSubtab({ id: 'subtab2', label: 'Subtab 2' });
          
          // add field to the other subtab
          form.addField({
             id        : 'subtabfld3',
             type      : serverWidget.FieldType.TEXT,
             label     : 'Subtab Field 3',
             container : 'subtab2'
          });
                                         

          // add sublist to 2nd subtab
          var sublist1 = form.addSublist({
             id    : 'sublist1',
             label : 'Sublist 1',
             tab   : 'subtab2',
             type  : serverWidget.SublistType.INLINEEDITOR
          });
          sublist1.addField({
             id     : 'sublistfld1',
             type   : serverWidget.FieldType.SELECT,
             label  : 'Sublist Field 1',
             source : 'item'
          });
          sublist1.addField({
             id     : 'sublistfld2',
             type   : serverWidget.FieldType.TEXT,
             label  : 'Sublist Field 2'
          });
          sublist1.addField({
             id     : 'sublistfld3',
             type   : serverWidget.FieldType.INTEGER,
             label  : 'Sublist Field 3',
          });
                            
                            
          var message = form.addField({
             id     : 'message',
             type   : serverWidget.FieldType.HELP,
             label  : 'Suitelet submitted!!!',
          });

          if (request.parameters.postComplete == 'T') {
             message.updateDisplayType({ displayType: serverWidget.FieldDisplayType.INLINE });
          } else {
             message.updateDisplayType({ displayType: serverWidget.FieldDisplayType.HIDDEN });
          }
          message.updateLayoutType({ layoutType: 'outsideabove' });
          
          // add a submit button
          form.addSubmitButton({ label: 'Some Button' });
          
          // write the response
          response.writePage({ pageObject: form });     
          
       } else {
          // POST - button clicked
          
          // get request params and log, but could also access NetSuite DB
          var field2Value = request.parameters.field2;
          log.debug({title: 'Field 2 value: ', details: field2Value});

          var field3Value = request.parameters.field3;
          log.debug({title: 'Field 3 value: ', details: field3Value});
          
          // redirecting back to self
          var scriptRef = runtime.getCurrentScript();
          response.sendRedirect({
             type       : http.RedirectType.SUITELET,
             identifier : scriptRef.id,
             id         : scriptRef.deploymentId,
             parameters : { postComplete: 'T' }
          });
       }
    }

    return {
        onRequest: onRequest
    };
    
});
