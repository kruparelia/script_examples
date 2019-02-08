function csvImportSched() {
    var SAVED_CSV_IMPORT = 150;
    // Creating the search 
    var search = nlapiSearchRecord('transaction', 'customsearch1067449');

    // Creating some array's that will be populated from the saved search results 
    // Creating some array's that will be populated from the saved search results
    var content = new Array();
    var cells = new Array();
    var temp = new Array();
    var x = 0;

    // Looping through the search Results
    var searchLen = search.length;
    for (var i = 0; i < searchLen; i++) {
        var resultSet = search[i];
        // Returns an array of column internal Ids
        var columns = resultSet.getAllColumns();

        // Looping through each column and assign it to the temp array
        for (var y = 0; y < columns.length; y++) {
            temp[y] = resultSet.getText(columns[y]);
        }
        // Taking the content of the temp array and assigning it to the Content Array.
        content.push(temp.toString());
        // Incrementing the index of the content array
        x++;
    }
    // Creating a string variable that will be used as the CSV Content 
    var contents = 'Internal ID,Item ID,Line ID \n';

    // Looping through the content array and assigning it to the contents string variable. 
    for (var z = 0; z < content.length; z++) {
        contents += content[z].toString() + '\n';
    }

    // Creating a csv file and passing the contents string variable. 
    var file = nlapiCreateFile('test_sales_order_sched.csv', 'CSV', contents);

    //set folder
    file.setFolder(-15);
    nlapiLogExecution('DEBUG', 'log 1', 'line 41');

    //submit the file to file cabinet
    var csvFileId = nlapiSubmitFile(file);


    /*    var mappingFileId = SAVED_CSV_IMPORT; //using internal id of Saved CSV Import
        var primaryFile = nlapiLoadFile(csvFileId); //using the internal id of the file stored in the File Cabinet

        var job = nlapiCreateCSVImport();
        job.setMapping(mappingFileId);
        job.setPrimaryFile(primaryFile);
        job.setOption("testClosedSalesOrdersASTest", "job2Import");

        //returns the internal id of the new job created in workqueue
        var jobId = nlapiSubmitCSVImport(job);*/
}