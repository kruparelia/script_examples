function main() {
    copyRecord(recordType, internalid, copyid, copyIdName);
}

function copyRecord(recordType, internalid, copyid, copyIdName) {
    for (var i = 1; i < 100; i++) {
        var recCopy = nlapiCopyRecord(recordType, internalid);
        recCopy.setFieldValue(copyid, copyIdName + i);
        nlapiSubmitRecord(recCopy);
    }
}