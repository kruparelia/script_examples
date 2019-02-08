/** 
 * Version Type         Date            Author           Remarks
 * 1.00    Create       06 May 2018     Mauricio Pastorino    Initial Version

 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope Public
 * @date : 06/05/2018
 * @author : mpastorino (mpastorino@netsuite.com)
 */
define([], function(){
	return {
		beforeLoad : function(context){
			var form = context.form;
			form.addButton({
				id : "custpage_moodbutton",
				label : "Declare Mood",
				functionName : "declareMood"
			});
			//var clientScriptId = 'customscript_cs_button_test';
			form.clientScriptModulePath = "./currentRecordButtonTestCS.js";
		}
	}
})