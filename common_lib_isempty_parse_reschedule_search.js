//########################################## - COMMON LIBRARY - ##########################################//

/*
 **
 * Common functions used for MDC script development Contributors: maduldulao,
 * memeremilla, mjpascual, rretiro, asinsin
 */

/***
 * @memberOf Eval
 * 
 */
var Eval = {
    /**
     * Evaluate if the given string is empty string, null or undefined.
     * 
     * @param {String}
     *            stValue - Any string value
     * @returns {Boolean}
     * @memberOf Eval
     * @author memeremilla
     */
    isEmpty: function(stValue) {
        if ((stValue == '') || (stValue == null) || (stValue == undefined)) {
            return true;
        } else {
            if (stValue instanceof String) {
                if (stValue == '') {
                    return true;
                }
            } else if (stValue instanceof Array) {
                if (stValue.length == 0) {
                    return true;
                }
            }

            return false;
        }
    },

    /**
     * Evaluate if the given string is an element of the array
     * 
     * @param {String}
     *            stValue - String to find in the array.
     * @param {Array}
     *            arr - Array to be check for components.
     * @returns {Boolean}
     * @memberOf Eval
     * @author memeremilla
     */
    inArray: function(stValue, arr) {
        var bIsValueFound = false;

        for (var i = 0; i < arr.length; i++) {
            if (stValue == arr[i]) {
                bIsValueFound = true;
                break;
            }
        }

        return bIsValueFound;
    },
};

/***
 * @memberOf Parse
 */
var Parse = {
    /**
     * Converts String to Float
     * 
     * @author asinsin
     */
    forceFloat: function(stValue) {
        var flValue = parseFloat(stValue);

        if (isNaN(flValue)) {
            return 0.00;
        }

        return flValue;
    },

    /**
     * Converts String to Integer
     * 
     * @author asinsin
     */
    forceInt: function(stValue) {
        var intValue = parseInt(stValue);

        if (isNaN(intValue)) {
            return 0;
        }

        return intValue;
    },
};

/***
 * @memberOf SuiteUtil
 * 
 */
var SuiteUtil = {
    /**
     * Get all of the results from the search even if the results are more than
     * 1000.
     * 
     * @param {String}
     *            strSearchId - the search id of the saved search that will be
     *            used.
     * @param {String}
     *            strRecordType - the record type where the search will be
     *            executed.
     * @param {Array}
     *            arrSearchFilter - array of nlobjSearchFilter objects. The
     *            search filters to be used or will be added to the saved search
     *            if search id was passed.
     * @param {Array}
     *            arrSearchColumn - array of nlobjSearchColumn objects. The
     *            columns to be returned or will be added to the saved search if
     *            search id was passed.
     * @returns {Array} - an array of nlobjSearchResult objects
     * @memberOf SuiteUtil
     * @author memeremilla
     */
    search: function(stSearchId, stRecordType, arrSearchFilter, arrSearchColumn) {
        var arrReturnSearchResults = new Array();
        var nlobjSavedSearch;

        if (stSearchId != null) {
            nlobjSavedSearch = nlapiLoadSearch(stRecordType ? stRecordType : null, stSearchId);

            // add search filter if one is passed
            if (arrSearchFilter != null) {
                nlobjSavedSearch.addFilters(arrSearchFilter);
            }

            // add search column if one is passed
            if (arrSearchColumn != null) {
                nlobjSavedSearch.addColumns(arrSearchColumn);
            }
        } else {
            nlobjSavedSearch = nlapiCreateSearch(stRecordType ? stRecordType : null, arrSearchFilter, arrSearchColumn);
        }

        var nlobjResultset = nlobjSavedSearch.runSearch();
        var intSearchIndex = 0;
        var nlobjResultSlice = null;
        do {
            if (nlapiGetContext().getExecutionContext() === 'scheduled') {
                try {
                    this.rescheduleScript(1000);
                } catch (ignored) {}
            }

            nlobjResultSlice = nlobjResultset.getResults(intSearchIndex, intSearchIndex + 1000);
            if (!nlobjResultSlice) {
                break;
            }

            for (var intRs in nlobjResultSlice) {
                arrReturnSearchResults.push(nlobjResultSlice[intRs]);
                intSearchIndex++;
            }
        }

        while (nlobjResultSlice.length >= 1000);

        return arrReturnSearchResults;
    },
    /**
     * Pauses the scheduled script either if the remaining usage is less than
     * the specified governance threshold usage amount or the allowed time is
     * exceeded. Then it will reschedule it.
     * 
     * @param {Number}
     *            intGovernanceThreshold - The value of the governance threshold
     *            usage units before the script will be rescheduled.
     * @param {Number}
     *            intStartTime - The time when the scheduled script started
     * @param {Number}
     *            flPercentOfAllowedTime - the percent of allowed time based
     *            from the maximum running time. The maximum running time is
     *            3600000 ms.
     * @returns void
     * @memberOf SuiteUtil
     * @author memeremilla
     */
    rescheduleScript: function(intGovernanceThreshold, intStartTime, intMaxTime, flPercentOfAllowedTime) {
        var stLoggerTitle = 'SuiteUtil.rescheduleScript';
        nlapiLogExecution('DEBUG', stLoggerTitle, 'Script State : ' + JSON.stringify({
            'Remaining usage': nlapiGetContext().getRemainingUsage()
        }));

        if (intMaxTime == null) {
            intMaxTime = 3600000;
        }

        var intRemainingUsage = nlapiGetContext().getRemainingUsage();
        var intRequiredTime = 900000; // 25% of max time
        if (flPercentOfAllowedTime) {
            var flPercentRequiredTime = 100 - flPercentOfAllowedTime;
            intRequiredTime = intMaxTime * flPercentRequiredTime / 100;
        }

        // check if there is still enough usage units
        if (intGovernanceThreshold) {
            nlapiLogExecution('DEBUG', stLoggerTitle, 'Script State : ' + 'Checking if there is still enough usage units.');

            if (intRemainingUsage < parseInt(intGovernanceThreshold, 10) + parseInt(20, 10)) {
                nlapiLogExecution('DEBUG', stLoggerTitle, 'Script State : ' + JSON.stringify({
                    'Remaining usage': nlapiGetContext().getRemainingUsage()
                }));
                nlapiLogExecution('DEBUG', stLoggerTitle, 'Script State : ' + 'Rescheduling script.');

                var objYield = nlapiYieldScript();
                if (objYield.status == 'FAILURE') {
                    nlapiLogExecution('DEBUG', stLoggerTitle, 'Script State : ' + 'Unable to Yield.');
                    nlapiLogExecution('DEBUG', stLoggerTitle, 'Script State : ' + JSON.stringify({
                        'Status': objYield.status,
                        'Information': objYield.information,
                        'Reason': objYield.reason
                    }));
                } else {
                    nlapiLogExecution('DEBUG', stLoggerTitle, 'Script State : ' + 'Successfully reschedule the script.');
                    nlapiLogExecution('DEBUG', stLoggerTitle, 'Script State : ' + JSON.stringify({
                        'After resume with': intRemainingUsage,
                        'Remaining vs governance threshold': intGovernanceThreshold
                    }));
                }
            }
        }

        if (intStartTime) {
            // get current time
            var intCurrentTime = new Date().getTime();

            // check if elapsed time is near the arbitrary value
            nlapiLogExecution('DEBUG', stLoggerTitle, 'Script State : ' + 'Check if elapsed time is near the arbitrary value.');

            var intElapsedTime = intMaxTime - (intCurrentTime - intStartTime);
            nlapiLogExecution('DEBUG', stLoggerTitle, 'Script State : ' + 'Remaining time is ' + intElapsedTime + ' ms.');

            if (intElapsedTime < intRequiredTime) {
                nlapiLogExecution('AUDIT', stLoggerTitle, 'Script State : ' + 'Rescheduling script.');

                // check if we are not reaching the max processing time which is 3600000 seconds
                var objYield = nlapiYieldScript();
                if (objYield.status == 'FAILURE') {
                    nlapiLogExecution('DEBUG', stLoggerTitle, 'Script State : ' + 'Unable to Yield.');
                    nlapiLogExecution('DEBUG', stLoggerTitle, 'Script State : ' + JSON.stringify({
                        'Status': objYield.status,
                        'Information': objYield.information,
                        'Reason': objYield.reason
                    }));
                } else {
                    nlapiLogExecution('DEBUG', stLoggerTitle, 'Script State : ' + 'Successfully reschedule the script.');
                    nlapiLogExecution('DEBUG', stLoggerTitle, 'Script State : ' + JSON.stringify({
                        'After resume with': intRemainingUsage,
                        'Remaining vs governance threshold': intGovernanceThreshold
                    }));

                    // return new start time        
                    intStartTime = new Date().getTime();
                }
            }
        }

        return intStartTime;
    },
    /**
     * A call to this API places a scheduled script into the NetSuite scheduling queue.
     * 
     * @param {String}
     *            stScheduledScriptId - String or number. The script internalId or custom scriptId{String}.
     * @param {String}
     *            stDeployId [optional] - String or number. The deployment internal ID or script ID. If empty, the first "free" deployment will be used. 
     *            Free means that the script's deployment status appears as Not Scheduled or Completed. 
     *            If there are multiple "free" scripts, the NetSuite scheduler will take the first free script that appears in the scheduling queue.
     * @param {Object}
     *            objParams [optional] - Object of name/values used in this schedule script instance - used to override the script parameters values for this execution.
     * @returns String
     * @memberOf SuiteUtil
     * @author memeremilla
     */
    scheduleScript: function(stScheduledScriptId, stDeployId, objParams) {

        var stLoggerTitle = 'SuiteUtil.scheduleScript';

        // Deployment name character limit 
        var intCharLimit = 28;

        // Invoke script 
        var stStatus = nlapiScheduleScript(stScheduledScriptId, stDeployId, objParams);
        nlapiLogExecution('DEBUG', stLoggerTitle, 'Scheduled Script Status : ' + stStatus);

        var stDeployInternalId = null;
        var stBaseName = null;
        if (stStatus != 'QUEUED') {
            var arrFilter = new Array();
            arrFilter =
                [
                    [
                        'script.scriptid', 'is', stScheduledScriptId
                    ], 'OR', [
                        [
                            'formulatext:{script.id}', 'is', stScheduledScriptId
                        ]
                    ]
                ];

            var arrColumn = new Array();
            arrColumn.push(new nlobjSearchColumn('internalid', 'script'));
            arrColumn.push(new nlobjSearchColumn('scriptid', 'script'));
            arrColumn.push(new nlobjSearchColumn('script'));
            arrColumn.push(new nlobjSearchColumn('scriptid'));
            arrColumn.push(new nlobjSearchColumn('internalid').setSort(false));

            var arrResults = nlapiSearchRecord('scriptdeployment', null, arrFilter, arrColumn);

            if ((arrResults != null) && (arrResults.length > 0)) {
                stDeployInternalId = arrResults[0].getId();
                stBaseName = arrResults[0].getValue('scriptid', 'script');
            }
        }

        if ((stDeployInternalId == null) || (stDeployInternalId == '')) {
            return stStatus;
        }

        stBaseName = stBaseName.toUpperCase().split('CUSTOMSCRIPT')[1];

        // If not queued, create deployment
        while (stStatus != 'QUEUED') {
            // Copy deployment
            var recDeployment = nlapiCopyRecord('scriptdeployment', stDeployInternalId);

            var stOrder = recDeployment.getFieldValue('title').split(' ').pop();
            var stNewDeploymentId = stBaseName + stOrder;
            var intExcess = stNewDeploymentId.length - intCharLimit;

            stNewDeploymentId = (intExcess > 0) ? (stBaseName.substring(0, (intCharLimit - intExcess)) + stOrder) : stNewDeploymentId;

            recDeployment.setFieldValue('isdeployed', 'T');
            recDeployment.setFieldValue('status', 'NOTSCHEDULED');
            recDeployment.setFieldValue('scriptid', stNewDeploymentId);

            var intCountQueue = nlapiGetContext().getQueueCount();
            if (intCountQueue > 1) {
                var stQueue = Math.floor(Math.random() * intCountQueue).toString();
                stQueue = (stQueue == '0') ? '1' : stQueue;

                recDeployment.setFieldValue('queueid', stQueue);
            }

            // Save deployment
            var stRecordId = nlapiSubmitRecord(recDeployment);
            nlapiLogExecution('AUDIT', stLoggerTitle, 'Script Deployment Record has been created.' + ' | ' + 'ID: ' + stRecordId + ' | ' + 'Record Type: ' + recDeployment.getRecordType());

            // Invoke deployment
            stStatus = nlapiScheduleScript(stScheduledScriptId, null, objParams);
            nlapiLogExecution('DEBUG', stLoggerTitle, 'Scheduled Script Status : ' + stStatus);
        }

        return stStatus;
    }
};