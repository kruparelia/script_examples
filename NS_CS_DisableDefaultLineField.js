/**
 * Copyright (c) 1998-2015 NetSuite, Inc.
 * 2955 Campus Drive, Suite 100, San Mateo, CA, USA 94403-2511
 * All Rights Reserved.
 * 
 * This software is the confidential and proprietary information of NetSuite, Inc. ("Confidential Information").
 * You shall not disclose such Confidential Information and shall use it only in accordance with the terms of the license agreement
 * you entered into with NetSuite.
 */
/**
 * Module Description
 * 
 * Version    Date              Author              Remarks
 * 1.0        Jan 24, 2018      kruparelia          Script to disbale line level field and default to value found from script parameter
/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/log', 'N/search', 'N/record', 'N/currentRecord'],

    function(log, search, record, currentRecord) {
        /*  function getFields(context) {
                          var objRec = context.currentRecord;
                          var origTranId = objRec.getValue({
                              fieldId: 'custbody_ccc_trnx_link'
                          });
                          var arrFieldLookup = search.lookupFields({
                              type: search.TYPE.CASH_SALE,
                              id: origTranId,
                              columns['entity', ]

                          })
          }*/

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(scriptContext) {
            console.log('hello');
            console.log('page init');
            var objRec = scriptContext.currentRecord;
            //var sublistName = scriptContext.sublistId;
            /*            if (sublistName != 'line') {
                            return;
                        }*/
            /*            objRec.setCurrentSublistValue({
                            sublistId: sublistName,
                            fieldId: 'account',
                            value: 2
                        });*/

            /*objRec.selectNewLine({
                sublistId: 'line'
            })
            objRec.setCurrentSublistValue({
                sublistId: 'line',
                fieldId: 'amount',
                value: 100
            });

            objRec.setCurrentSublistValue({
                sublistId: 'line',
                fieldId: 'account',
                value: 2
            });

            objRec.commitLine({
                sublistId: 'line'
            });



            var intLine = objRec.getCurrentSublistIndex({
                sublistId: 'line'
            });
            console.log(intLine);
            var objLineField = objRec.getSublistField({
                sublistId: 'line',
                fieldId: 'account',
                line: 0
            });
            objLineField.isDisabled = true;*/
        }

        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(scriptContext) {
            var objRec = scriptContext.currentRecord;
            if (scriptContext.fieldId == 'custbody_ccc_trnx_link') {
                var origTranId = objRec.getValue({
                    fieldId: 'custbody_ccc_trnx_link'
                });

                console.log(origTranId);

                var arrFieldLookup = search.lookupFields({
                    type: search.Type.CASH_SALE,
                    id: origTranId,
                    columns: ['entity', 'trandate', 'postingperiod', 'total', 'currency', 'exchangerate', 'subsidiary']
                });
                console.log(arrFieldLookup);

                var d = new Date(arrFieldLookup.trandate)
                if (arrFieldLookup.entity[0].value) {

                    objRec.setValue({
                        fieldId: 'custbody_ccc_don_trnx',
                        value: arrFieldLookup.entity[0].value
                    });
                }
                if (d) {

                    objRec.setValue({
                        fieldId: 'trandate',
                        value: d
                    });
                }
                if (arrFieldLookup.postingperiod[0].value) {

                    objRec.setValue({
                        fieldId: 'postingperiod',
                        value: arrFieldLookup.postingperiod[0].value
                    });
                }
                if (arrFieldLookup.total) {

                    objRec.setValue({
                        fieldId: 'custbody_ccc_amt_ori_trnx',
                        value: arrFieldLookup.total
                    });
                }
                if (arrFieldLookup.currency[0].value) {

                    objRec.setValue({
                        fieldId: 'currency',
                        value: arrFieldLookup.currency[0].value
                    });
                }
                if (arrFieldLookup.exchangerate) {

                    objRec.setValue({
                        fieldId: 'exchangerate',
                        value: arrFieldLookup.exchangerate
                    });
                }
                if (arrFieldLookup.subsidiary[0].value) {

                    objRec.setValue({
                        fieldId: 'subsidiary',
                        value: arrFieldLookup.subsidiary[0].value
                    });
                }

                var memo = objRec.getField({
                    fieldId: 'memo'
                })

                memo.isDisabled = true;
                /*
                                var intLine = objRec.getCurrentSublistIndex({
                                      sublistId: 'line'
                                  });*/
                var objLineField = objRec.getSublistField({
                    sublistId: 'line',
                    fieldId: 'account',
                    line: 0
                });
                objLineField.isDisabled = true;

                /*objRec.selectNewLine({
                    sublistId: 'line'
                })
                objRec.setCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'amount',
                    value: 100
                });

                objRec.setCurrentSublistValue({
                    sublistId: 'line',
                    fieldId: 'account',
                    value: 2
                });

                objRec.commitLine({
                    sublistId: 'line'
                });*/
            }

            /*  if (scriptContext.fieldId == 'amount') {
                  var intLine = objRec.getCurrentSublistIndex({
                      sublistId: 'line'
                  });
                  var objLineField = objRec.getSublistField({
                      sublistId: 'line',
                      fieldId: 'account',
                      line: 1
                  });
                  objLineField.isDisabled = true;
              }*/
        }

        /**
         * Function to be executed when field is slaved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         *
         * @since 2015.2
         */
        function postSourcing(scriptContext) {

        }

        /**
         * Function to be executed after sublist is inserted, removed, or edited.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function sublistChanged(scriptContext) {
            console.log('sublist changed');
            var objRec = scriptContext.currentRecord;
            var sublistName = scriptContext.sublistId;
            if (sublistName != 'line') {
                return;
            }
            objRec.setCurrentSublistValue({
                sublistId: sublistName,
                fieldId: 'account',
                value: 2
            });
            var objLineField = objRec.getSublistField({
                sublistId: 'line',
                fieldId: 'account',
                line: 0
            });
            objLineField.isDisabled = true;
        }

        /**
         * Function to be executed after line is selected.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function lineInit(scriptContext) {
            console.log('line init');
            var objRec = currentRecord.get();
            var sublistName = scriptContext.sublistId;
            if (sublistName != 'line') {
                return;
            }
            /*            objRec.setCurrentSublistValue({
                            sublistId: sublistName,
                            fieldId: 'account',
                            value: 2
                        });*/
            var intLine = objRec.getCurrentSublistIndex({
                sublistId: 'line'
            });
            console.log(intLine);
            var objLineField = objRec.getSublistField({
                sublistId: 'line',
                fieldId: 'account',
                line: intLine
            });
            objLineField.isDisabled = true;
        }

        /**
         * Validation function to be executed when field is changed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         * @param {string} scriptContext.fieldId - Field name
         * @param {number} scriptContext.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} scriptContext.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @returns {boolean} Return true if field is valid
         *
         * @since 2015.2
         */
        function validateField(scriptContext) {

        }

        /**
         * Validation function to be executed when sublist line is committed.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateLine(scriptContext) {

        }

        /**
         * Validation function to be executed when sublist line is inserted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateInsert(scriptContext) {
            /* console.log('line init');
             var objRec = scriptContext.currentRecord;
             var sublistName = scriptContext.sublistId;
             if (sublistName === 'item')
                 objRec.setCurrentSublistValue({
                     sublistId: sublistName,
                     fieldId: 'description',
                     value: 'asdf'
                 });
             return true;*/
        }

        /**
         * Validation function to be executed when record is deleted.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @param {string} scriptContext.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateDelete(scriptContext) {

        }

        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} scriptContext
         * @param {Record} scriptContext.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        function saveRecord(scriptContext) {

        }

        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            // postSourcing: postSourcing,
            //sublistChanged: sublistChanged
            lineInit: lineInit
                // validateField: validateField,
                // validateLine: validateLine,
                //validateInsert: validateInsert
                // validateDelete: validateDelete,
                // saveRecord: saveRecord
        };

    });