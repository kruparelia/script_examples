/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/log'],
    function(search, log) {

        /**
         * Function to be executed after page is initialized.
         *
         * @param {Object} context
         * @param {Record} context.currentRecord - Current form record
         * @param {string} context.mode - The mode in which the record is being accessed (create, copy, or edit)
         *
         * @since 2015.2
         */
        function pageInit(context) {
            debugger;
            if (context.mode !== 'create') {
                var customerRecord = context.currentRecord;
                var entityId = customerRecord.id;

                var cashsaleSearchObj = search.create({
                    type: "transaction",
                    filters: [
                        ["type", "anyof", "CashSale"],
                        "AND", ["item", "anyof", "430"],
                        "AND", ["name", "anyof", entityId]
                    ],
                    columns: [
                        search.createColumn({
                            name: "amount",
                            summary: "SUM"
                        })
                    ]
                });

                var results = cashsaleSearchObj.run();

                var resultSet = results.getRange({
                    start: 0,
                    end: 1
                })[0];

                var totalAmount = resultSet.getValue({
                    name: 'amount',
                    summary: 'SUM'
                });
                log.debug({
                    title: 'totalamount',
                    details: totalAmount
                });

                console.log(totalAmount);

                customerRecord.setValue({
                    fieldId: 'custentity_ns_total_giving',
                    value: totalAmount
                });

            }
        }

        /**
         * Function to be executed when field is changed.
         *
         * @param {Object} context
         * @param {Record} context.currentRecord - Current form record
         * @param {string} context.sublistId - Sublist name
         * @param {string} context.fieldId - Field name
         * @param {number} context.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} context.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @since 2015.2
         */
        function fieldChanged(context) {

        }

        /**
         * Function to be executed when field is slaved.
         *
         * @param {Object} context
         * @param {Record} context.currentRecord - Current form record
         * @param {string} context.sublistId - Sublist name
         * @param {string} context.fieldId - Field name
         *
         * @since 2015.2
         */
        function postSourcing(context) {

        }

        /**
         * Function to be executed after sublist is inserted, removed, or edited.
         *
         * @param {Object} context
         * @param {Record} context.currentRecord - Current form record
         * @param {string} context.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function sublistChanged(context) {

        }

        /**
         * Function to be executed after line is selected.
         *
         * @param {Object} context
         * @param {Record} context.currentRecord - Current form record
         * @param {string} context.sublistId - Sublist name
         *
         * @since 2015.2
         */
        function lineInit(context) {

        }

        /**
         * Validation function to be executed when field is changed.
         *
         * @param {Object} context
         * @param {Record} context.currentRecord - Current form record
         * @param {string} context.sublistId - Sublist name
         * @param {string} context.fieldId - Field name
         * @param {number} context.lineNum - Line number. Will be undefined if not a sublist or matrix field
         * @param {number} context.columnNum - Line number. Will be undefined if not a matrix field
         *
         * @returns {boolean} Return true if field is valid
         *
         * @since 2015.2
         */
        function validateField(context) {

        }

        /**
         * Validation function to be executed when sublist line is committed.
         *
         * @param {Object} context
         * @param {Record} context.currentRecord - Current form record
         * @param {string} context.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateLine(context) {

        }

        /**
         * Validation function to be executed when sublist line is inserted.
         *
         * @param {Object} context
         * @param {Record} context.currentRecord - Current form record
         * @param {string} context.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateInsert(context) {

        }

        /**
         * Validation function to be executed when record is deleted.
         *
         * @param {Object} context
         * @param {Record} context.currentRecord - Current form record
         * @param {string} context.sublistId - Sublist name
         *
         * @returns {boolean} Return true if sublist line is valid
         *
         * @since 2015.2
         */
        function validateDelete(context) {

        }

        /**
         * Validation function to be executed when record is saved.
         *
         * @param {Object} context
         * @param {Record} context.currentRecord - Current form record
         * @returns {boolean} Return true if record is valid
         *
         * @since 2015.2
         */
        function saveRecord(context) {

        }

        return {
            pageInit: pageInit
                /* fieldChanged: fieldChanged,
                 postSourcing: postSourcing,
                 sublistChanged: sublistChanged,
                 lineInit: lineInit,
                 validateField: validateField,
                 validateLine: validateLine,
                 validateInsert: validateInsert,
                 validateDelete: validateDelete,
                 saveRecord: saveRecord*/
        };

    });