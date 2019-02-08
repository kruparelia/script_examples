/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/error', 'N/record', 'N/search', 'N/runtime', 'N/log'],
    function(error, record, search, runtime, log) {

        /**
         * Function definition to be triggered before record is loaded.
         *
         * @param {Object} context
         * @param {Record} context.newRecord - New record
         * @param {string} context.type - Trigger type
         * @param {Form} context.form - Current form
         * @Since 2015.2
         */
        function beforeLoad(context) {
            if (context.type !== context.UserEventType.CREATE) {
                var customerRecord = context.newRecord;
                var entityId = customerRecord.id;

                var cashsaleSearchObj = search.create({
                    type: "cashsale",
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

                log.debug({
                    title: 'totalamount',
                    details: typeof totalAmount
                });


                var y = customerRecord.setValue({
                    fieldId: 'custentity_ns_total_giving',
                    value: 'test'
                });

                var y = customerRecord.setValue({
                    fieldId: 'partner',
                    value: '201'
                });

                var x = customerRecord.getValue('customform');




                log.debug({
                    title: 'comments',
                    details: y
                });


            }


        }

        /**
         * Function definition to be triggered before record is loaded.
         *
         * @param {Object} context
         * @param {Record} context.newRecord - New record
         * @param {Record} context.oldRecord - Old record
         * @param {string} context.type - Trigger type
         * @Since 2015.2
         */
        function beforeSubmit(context) {

        }

        /**
         * Function definition to be triggered before record is loaded.
         *
         * @param {Object} context
         * @param {Record} context.newRecord - New record
         * @param {Record} context.oldRecord - Old record
         * @param {string} context.type - Trigger type
         * @Since 2015.2
         */
        function afterSubmit(context) {

        }

        return {
            beforeLoad: beforeLoad
                //beforeSubmit: beforeSubmit,
                //afterSubmit: afterSubmit
        };

    });