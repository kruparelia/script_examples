/*
 * Version          Author       Date          Comments
 * 1.0              Keith Bao    6/5/2017      Create New File
 * 1.1              Daniel Cai   6/5/2017      Add isEmpty,stringToDate,convertEmpty
 * 1.2              Keith Bao    6/7/2017      Add isNotEmpty,isNullArray,getEarliestYear,getLatestDate
 * 1.3              Keith Bao    6/7/2017      Add getFirstDayInCurrent,getLastDayInCurrent
 *
 * File Purpose
 * Provider common function for String and Date
 * @memberof module:Util/commonUtil
 */
/** @module Util/commonUtil */
define(["N/format"], function (format) {
    /**
     * Function definition: To tell a string is empty or not
     *
     * @param {string} str
     *        str - any string
     * @return {boolean} - empty for true, not empty false
     * @exception N/A
     * @example input 123, return false. input null, return true.
     * @Since 2015.2
     * @memberof module:Util/commonUtil
     */
    function isEmpty(str) {
        return (str === null || str === "");
    }

    /**
     * Function definition: To tell a string is NOT empty or not
     *
     * @param {object} str
     *        str - any string
     * @return {boolean} - empty for true, not empty false
     * @exception N/A
     * @example input 123, return false. input null, return true.
     * @Since 2015.2
     * @memberof module:Util/commonUtil
     */
    function isNotEmpty(str) {
        return (str != null && str != "");
    }

    /**
     * Function definition: To tell a param is undefined
     *
     * @param {object} str
     *        str - any object
     * @return {boolean} - undefined for true, pre-defined param false
     * @exception N/A
     * @example input 123, return true. input undefined param, return true.
     * @Since 2015.2
     * @memberof module:Util/commonUtil
     */
    function isUndefined(str) {
        return typeof(str) === "undefined";
    }

    /**
     * Function definition: To tell an array is empty
     *
     * @param {object} object
     *        object - an array object
     * @return {boolean} - empty array for true. valid array for false
     * @exception N/A
     * @example empty array for true. valid array for false
     * @Since 2015.2
     * @memberof module:Util/commonUtil
     */
    function isNullArray(object) {
        return (typeof object === "object" && object.length <= 0);
    }

    /**
     * Function definition: Convert an empty string
     *
     * @param {string} str
     *        str - any string or object
     * @return {string} - If a string is null, return ""
     * @exception N/A
     * @example input null, return "". input - new Date(), return current date.
     * @Since 2015.2
     * @memberof module:Util/commonUtil
     */
    function convertEmpty(str) {
        return isEmpty(str) ? "" : str;
    }

    /**
     * Function definition: Parse a string to a date object
     *
     * @param {string} str
     *        str - any string
     * @return {string} - Standard NetSuite date object
     * @exception return
     *            original string with invalid format
     * @example input 5/23/2017, return a date object. Input aBcD, return aBcD.
     * @Since 2015.2
     * @memberof module:Util/commonUtil
     */
    function stringToDate(str) {
        return isEmpty(str) ? "" : format.parse({
            value: str,
            type: "date"
        });
    }

    /**
     * Function definition: Pare a date object to a string that fits system"s
     * setting
     *
     * @param {string|Date} dateObj
     *        dateObj - any date object
     * @return {string} a date string that fits system"s setting
     * @exception -
     *            original for invalid date object
     * @example input : new Date(), return current system date.
     * @Since 2015.2
     * @memberof module:Util/commonUtil
     */
    function dateToString(dateObj) {
        return isEmpty(dateObj) ? "" : format.format({
            value: dateObj,
            type: "date"
        });
    }

    /**
     * Function definition: Get fixed date for 1/1/1900
     *
     * @returns {date} 1/1/1900
     *
     * @exception N/A
     * @memberof module:Util/commonUtil
     */
    function getEarliestYear() {
        var d = new Date();
        d.setFullYear(1900);
        d.setMonth(0);
        d.setDate(1);
        return d;
    }

    /**
     * Function definition: return Today is weekend or not
     *
     * @returns {boolean}
     *
     * @exception N/A
     * @memberof module:Util/commonUtil
     */
    function isWeekend(currentDate) {
        return currentDate.getDay() === 0 || currentDate.getDay() === 6;
    }

    /**
     * Function definition: Get the last date in a date list
     *
     * @param {Array} dateList
     *        dateList - a list containing dates
     * @return {date} latest date in the list
     * @exception N/A
     * @example input : [6/14/2017,6/15/2017], return 6/15/2017.
     * @Since 2015.2
     * @memberof module:Util/commonUtil
     */
    function getLatestDate(dateList) {
        var lastDate = dateList[0];
        for (var i = 1; i < dateList.length; i++) {
            var gap = dateList[i] - lastDate;
            lastDate = gap > 0 ? dateList[i] : lastDate;
        }
        return lastDate;
    }

    /**
     * CAFE-1091
     * Function definition: Get the eailiest date in a date list
     * if date is null, then means 12/31/2999
     *
     * @param {Array} dateList
     *        dateList - a list containing dates
     * @return {date} latest date in the list
     * @exception N/A
     * @example input : [6/14/2017,6/15/2017], return 6/15/2017.
     * @Since 2015.2
     * @memberof module:Util/commonUtil
     */
    function getEarliestDate(dateList) {
        var ealierDate = new Date();
        ealierDate.setFullYear(2999);
        ealierDate.setMonth(12);
        ealierDate.setDate(31);
        if(!isEmpty(dateList[0])){
            ealierDate = dateList[0];
        }
        for (var i = 1; i < dateList.length; i++) {
            var tempDate = new Date();
            tempDate.setFullYear(2999);
            tempDate.setMonth(12);
            tempDate.setDate(31);
            if(!isEmpty(dateList[i])){
                tempDate = dateList[i];
            }
            var gap = tempDate - ealierDate;
            ealierDate = gap < 0 ? dateList[i] : ealierDate;
        }
        return ealierDate;
    }


    /**
     * Function definition: get first day in current month
     *
     * @return {Date} first day of current month
     * @exception N/A
     * @example if this month is January, return 1/1/year.
     * @Since 2015.2
     * @memberof module:Util/commonUtil
     */
    function getFirstDayInCurrent() {
        var firstDate = new Date();
        firstDate.setDate(1); //first Day
        return firstDate;
    }

    /**
     * Function definition: get last day in current month
     *
     * @return {Date} last day of current month
     * @exception N/A
     * @example if this month is January, return 1/31/year.
     * @Since 2015.2
     * @memberof module:Util/commonUtil
     */
    function getLastDayInCurrent() {
        var firstDate = new Date();
        firstDate.setDate(1); //first Day
        var endDate = new Date(firstDate);
        endDate.setMonth(firstDate.getMonth() + 1);
        endDate.setDate(0);
        return endDate;
    }

    /**
     * Function definition: get Days between 2 dates besides weekend
     *
     * @param {Date} startDate
     * @param {Date} endDate
     *      startDate, endDate
     * @return {int}
     *      days between 2 dates
     * @exception N/A
     * @Since 2015.2
     * @memberof module:Util/commonUtil
     */

    function getDaysBetweenTwoDates(startDate, endDate) {

        var startDateTime = startDate.getTime();
        var endDateTime = endDate.getTime();
        var daysDiff = Math.round(Math.abs(startDateTime - endDateTime) / (1000 * 60 * 60 * 24));
        var days = 0;

        for (var day = 1; day <= daysDiff; day++) {
            var nextDate = new Date(startDate.getTime());
            nextDate.setDate(startDate.getDate() + day);
            if (!isWeekend(nextDate)) {
                days = days + 1;
            }
        }
        return days;
    }




    /**
     * Rounds the passed in number (float) to N decimal places, returns float.
     * @param  {float} number        Number to round
     * @param  {float} decimalPlaces Decimal places to round to
     * @return {float}               Rounded number
     * @memberof module:Util/commonUtil
     */
    function round(number, decimalPlaces) {
        if(number == 0){
            return 0;
        }else {
            return number/Math.abs(number) *
                Math.round(Math.pow(10,decimalPlaces)*Math.abs(number))/Math.pow(10,decimalPlaces);
        }
    }

    /**
     * Rounds a number, returns a string
     * @param  {Float} number         Number to round
     * @param  {Float} decimalPlaces  Number of decimals required
     * @return {String}               Rounded float
     * @memberof module:Util/commonUtil
     */
    function roundToString(number, decimalPlaces) {
        return parseFloat(number).toFixed(decimalPlaces);
    }

    function isEmptyObject(obj) {
        for (var key in obj){
            return false;
        }
        return true;
    }

    /**
     * get month first day
     * @param {date} date
     * @return {date} month first day
     * @memberof module:Util/commonUtil
     */
    function getMonthFirstDay(date) {
        var newDate = new Date(date.getFullYear(), date.getMonth(),date.getDate());
        newDate.setDate(1);
        return newDate;
    }

    /**
     * get month last day
     * @param {date} date
     * @return {date} month last day
     * @memberof module:Util/commonUtil
     */
    function getMonthLastDay(date) {
        var currentMonth=date.getMonth();
        var nextMonth=++currentMonth;
        var monthLastDay=new Date(date.getFullYear(),nextMonth,0);
        return monthLastDay;
    }

    /**
     * calculate months between two dates
     * @param {date} startDate
     * @param {date} endDate
     * @return {int} months
     * @memberof module:Util/commonUtil
     */
    function getMonthsBetweenTwoDays(startDate, endDate) {
        return (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth()) + 1;
    }

    /**
     * CAFE - 2021
     * @param {currecord} record
     * @param {stringData} manual type
     * @return {boolean} true/false
     * @memberof module:Util/commonUtil
     */
    function checkIsManualFlag(currecord, stringData){
        var createdfrom = currecord.getValue({
            fieldId : "createdfrom"
        });
        if(stringData == "manualInvAndCrmCasale"){
            if(((currecord.type == "invoice" || currecord.type == "creditmemo" ) && (createdfrom == ""||createdfrom == null)) || currecord.type == "cashsale"){
                return true;
            }
        }
        if(stringData == "manualInvAndCrm"){
            if((currecord.type == "invoice" || currecord.type == "creditmemo" )&& (createdfrom == ""||createdfrom == null)){
                return true;
            }
        }
        if(stringData == "manualInvoiceAndCreditmemo"){
            if((currecord.type == "invoice" || currecord.type == "creditmemo" )&& !createdfrom){
                return true;
            }
        }
        if(stringData == "manualInvoiceAndCreditmemoFromInvoice"){
            if(currecord.type == "creditmemo" && createdfrom){
                return true;
            }
        }
        if(stringData == "manualInvoice"){
            if(currecord.type == "invoice" && !createdfrom){
                return true;
            }
        }
        return false;
    }


    return {
        isEmpty: isEmpty,
        isUndefined: isUndefined,
        getEarliestYear: getEarliestYear,
        convertEmpty: convertEmpty,
        stringToDate: stringToDate,
        dateToString: dateToString,
        isNotEmpty: isNotEmpty,
        getLatestDate: getLatestDate,
        isNullArray: isNullArray,
        getLastDayInCurrent: getLastDayInCurrent,
        isWeekend: isWeekend,
        getDaysBetweenTwoDates: getDaysBetweenTwoDates,
        getFirstDayInCurrent: getFirstDayInCurrent,
        round: round,
        roundToFloat: round,
        roundToString: roundToString,
        getEarliestDate : getEarliestDate,
        getMonthFirstDay : getMonthFirstDay,
        getMonthLastDay : getMonthLastDay,
        getMonthsBetweenTwoDays : getMonthsBetweenTwoDays,
        isEmptyObject : isEmptyObject,
        checkIsManualFlag: checkIsManualFlag

    };
});