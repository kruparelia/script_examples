define(["N/currentRecord"], function(currentRecord){
	
	return {
		declareMood : function(){
			var currentRec = currentRecord.get();
			console.log(currentRec.getValue('entity'));
			console.log(currentRec.getValue('memo'));
		}
	}
})