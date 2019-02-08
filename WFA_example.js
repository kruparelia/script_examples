/**
 * @NApiVersion 2.x
 * @NScriptType WorkflowActionScript
 */
define([],
    function() {
        function onAction(scriptContext) {
            log.debug({
                title: 'Start Script'
            });
            var newRecord = scriptContext.newRecord;
            var itemCount = newRecord.getLineCount({
                                sublistId: 'item'
                                });
            log.debug({
                title: 'Item Count', 
                details: itemCount
            });
            for(var i = 0; i < itemCount; i++)
            {
                var quantity = newRecord.getSublistValue({
                                   sublistId: 'item', 
                                   fieldId: 'quantity', 
                                   line: i
                               });
                log.debug({
                    title: 'Quantity of Item ' + i, 
                    details: quantity
                });
                if(quantity === 0)
                {
                    return 0;
                }
            }
            log.debug({
                title: 'End Script'
            });
            return 1;
        }
        return {
            onAction: onAction
        }
    });