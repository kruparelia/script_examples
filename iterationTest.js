var iterations = 1;
console.time('Function #1');
for (var i = 0; i < iterations; i++) {
    functionOne();
};
console.timeEnd('Function #1')

console.time('Function #2');
for (var i = 0; i < iterations; i++) {
    functionTwo();
};
console.timeEnd('Function #2')

var x = [1, 4, 7, 3, 8, 9];

function functionOne() {
    var recOrigSG = record.load({
        type: 'customrecord_p_cr',
        id: 2632
    });

    //Obtain the contracting party and copy it over to the daisy chain
    var stOrigSGContractParty = recOrigSG.getValue({
        fieldId: 'custrecord_p_sg_contractingparty'
    });

    var stOrigSGMoveType = recOrigSG.getValue({
        fieldId: 'custrecord_p_cr_order_type'
    });

    recOrigSG.setValue({
        fieldId: 'custrecord_p_cr_order_type',
        value: stOrigSGMoveType,
        ignoreFieldChange: true,
        fireSlavingSync: false
    });

    var stOrigId = recOrigSG.save({
        enableSourcing: false,
        ignoreMandatoryFields: true
    });
}

function functionTwo() {
    var searchResults = search.lookupFields({
        type: 'customrecord_p_cr',
        id: stOriginalServiceGroupID,
        columns: ['custrecord_p_sg_contractingparty','custrecord_p_cr_order_type']
    })

    record.submitFields({
        type: 'customrecord_p_cr',
        id: stOriginalServiceGroupID,
        values: {
            custrecord_p_cr_order_type: searchResults.custrecord_p_cr_order_type[0].value
        }
    })

}

function isEmpty(stValue) {
    if ((stValue == '') || (stValue == null) || (stValue == undefined)) {
        return true;
    }

    return false;
}

function inArray(val, arr) {
    var bIsValueFound = false;

    for (var i = 0; i < arr.length; i++) {
        if (val == arr[i]) {
            bIsValueFound = true;
            break;
        }
    }
    return bIsValueFound;
}

var iterations = 1;
console.time('Function #1');
for (var i = 0; i < iterations; i++) {
    functionOne();
};
console.timeEnd('Function #1')

console.time('Function #2');
for (var i = 0; i < iterations; i++) {
    functionTwo();
};
console.timeEnd('Function #2')

function functionOne() {
    for (var i = 1; i <= 5; i++) {

        var cur = nlapiLoadRecord('currency', i);
        cur.getFieldValue('currencyprecision');
    }
}

function functionTwo() {
    for (var i = 1; i <= 5; i++) {

        nlapiLookupField('currency', i, 'currencyprecision')
    }
}