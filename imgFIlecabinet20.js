		In reduce here:

		    Im calling a custom record that houses the credential infromation that I need.I generate authentication key that lets me acces the get request


		var scriptObj = runtime.getCurrentScript();

		var credentialsId = scriptObj.getParameter('custscript_cred_record');

		var credLookup = search.lookupFields({ // grabing the GL account associated with the subsidiary 
		    type: 'customrecord_jsp_rec_credential',
		    id: credentialsId,
		    columns: ['custrecord_jsp_ofint_user_name', 'custrecord_jsp_ofint_password', 'custrecord_jsp_ofint_url']
		});

		var credName = credLookup.custrecord_jsp_ofint_user_name;
		var credPass = credLookup.custrecord_jsp_ofint_password;
		var credURL = credLookup.custrecord_jsp_ofint_url;

		log.debug('credential information', credName + ' | ' + credPass + ' | ' + credURL);

		var url_PB = credURL;
		var username = credName;
		var password = credPass;
		var userpwd = username + ':' + password;


		var auth = encode.convert({
		    string: userpwd,
		    inputEncoding: encode.Encoding.UTF_8,
		    outputEncoding: encode.Encoding.BASE_64
		});


		log.debug('auth  :  ',
		    'auth ' + auth + '\n');
		-- -- -- -- -- -- -- -- -- -

		code here

		grab imageValue = png or jpeg....have a field mapping record that i look up depending on the type of image im grabbing
		arrActivityChanges[0][j] = value from map reduce results
		activity id is the file id from ofsc

		-- -- -- -- -- -- -- -- -- --

		if (imageValue) {

		    var soapHeaders = new Array();

		    soapHeaders['Authorization'] = 'Basic ' + auth;
		    soapHeaders['Content-Type'] = 'application/json';
		    soapHeaders['Accept'] = 'image/' + imageValue;


		    var imageURL = 'https://api.etadirect.com/rest/ofscCore/v1/activities/' + activityId + '/' + arrActivityChanges[0][j] //building the url to grab image 

		    var response = https.request({
		        method: https.Method.GET,
		        url: imageURL,
		        headers: soapHeaders
		    });

		    log.debug('response', response);

		    log.debug('JSON response', JSON.stringify(response));

		    log.debug({
		        title: 'Client Response Body',
		        details: response.body
		    });

		    var respBody = response.body; //test not parsing 

		    log.debug('q', '1q')

		    // var image = new Image();
		    //image.src = 'data:image/png;base64,' + respBody;


		    //response should be image 

		    //save image in file cabinet 

		    log.debug('1', '1')

		    //image.folder = 281; //add file to custom folder

		    if (imageValue == 'png') {

		        var fileObj = file.create({
		            name: activityId + '_' + arrActivityChanges[0][j] + '_WO_Image.' + imageValue,
		            fileType: file.Type.PNGIMAGE, //nfeher need to make this dynamic - switch case
		            contents: respBody,
		            description: 'testingFile',
		            encoding: file.Encoding.UTF8,
		            folder: 281,
		            isOnline: true
		        });
		    } else {

		        var fileObj = file.create({
		            name: activityId + '_' + arrActivityChanges[0][j] + '_WO_Image.' + imageValue,
		            fileType: file.Type.JPGIMAGE, //nfeher need to make this dynamic - switch case
		            contents: respBody,
		            description: 'testingFile',
		            encoding: file.Encoding.UTF8,
		            folder: 281,
		            isOnline: true
		        });

		    }

		    var fileId = fileObj.save();

		    log.debug('fileId', fileId)

		    //image.name = activityId + '_' + arrActivityChanges[0][j] + '_WO_Image.' + imageValue; //rename file with unique name based on estimate record number

		    log.debug('3', '3')

		    //var intFileId = image.save();

		    log.debug('4', '4')

		    //set NS FIELD 

		    woObj.setValue({ //nfeher seems like it doesn't overwrite if file has already been chosen on field 
		        fieldId: nsInternalId,
		        value: fileId
		    });



		}