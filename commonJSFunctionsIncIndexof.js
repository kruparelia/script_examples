function CommonFunctions() { // start of CommonFunctions constructor
    var that = this;
    this.isEmpty = function isEmpty(stValue) {

        if (that.isNullOrUndefined(stValue) === true) {
            return true;
        }
        if (stValue.length == 0) {
            return true;
        }
        return false;
    };
    this.isNullOrUndefined = function isNullOrUndefined(value) {
        if (value === null) {
            return true;
        }
        if (value === undefined) {
            return true;
        }
        return false;
    };
    this.parametersEmpty = function parametersEmpty(parameters) {
        var empty = false;
        // check if parameters is empty
        if (that.isEmpty(parameters) === true) {
            empty = true;
        } else if (parameters.length == 0) {
            empty = true;
        } else {
            for (var x = 0; x < parameters.length; x++) {
                var value = parameters[x];

                if (that.isEmpty(value) === true) {
                    empty = true;
                    break;
                }
            }
        }
        return empty;
    };
}

function createArrayIndexOf() {
    Array.prototype.indexOf = function(searchElement, fromIndex) {
        var k;
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if (len === 0) {
            return -1;
        }
        var n = +fromIndex || 0;
        if (Math.abs(n) === Infinity) {
            n = 0;
        }
        if (n >= len) {
            return -1;
        }
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
        while (k < len) {
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}