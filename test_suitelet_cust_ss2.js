/*
 *   Suitelet hack to load a custom html page within a Netsuite Form. Created by Adolfo Garza (borncorp)
 */
var ENCODEMODULE, RUNTIMEMODULE, UIMODULE, URLMODULE, DEPLOYMENT_URL, SEARCH; //I like loading my modules as globals so I can access them whenever I want

/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 *@NModuleScope Public
 */
define(["N/encode", "N/runtime", 'N/ui/serverWidget', 'N/url', 'N/search'], runSuitelet);

//********************** MAIN FUNCTION **********************
function runSuitelet(encode, runtime, ui, url, search) {
    ENCODEMODULE = encode;
    RUNTIMEMODULE = runtime;
    UIMODULE = ui;
    URLMODULE = url;
    SEARCH = search;

    var returnObj = {};
    returnObj.onRequest = execute;
    return returnObj;
}

function execute(context) {
    DEPLOYMENT_URL = getDeploymentURL();

    try {
        if (context.request.method == 'GET') {
            var form = getInjectableForm();
            context.response.writePage(form);
            return;
        }

        return;
    } catch (e) {
        log.error("ERROR", e.toString());
        context.response.write(e.toString());
    }

    return;
}



function getInjectableForm() {
    //*********** Create Form ***********
    var form = UIMODULE.createForm({
        title: ' ',
        hideNavBar: true
    });
    var bodyAreaField = form.addField({
        id: 'custpage_bodyareafield',
        type: UIMODULE.FieldType.INLINEHTML,
        label: 'Body Area Field'
    });

    var button = form.addButton({
        id: 'btnRefresh',
        label: 'refresh',
        functionName: 'refresh()'
    })

    //kruparelia - add client script
    //form.clientScriptFileId = 3743;



    //*********** Prepare HTML and scripts to Inject ***********

    var body = getBody();
    //clientCode = clientCode.replace('$PAGEBODY$', body).replace('$DEPLOYMENT_URL$', DEPLOYMENT_URL);
    clientCode = clientCode.replace('$PAGEBODY$', body).replace('$DEPLOYMENT_URL$', DEPLOYMENT_URL);
    var base64ClientCode = toBase64(clientCode);
    var scriptToInject = 'console.log(\'Added bottom script element\');';
    scriptToInject += "eval(atob(\'" + base64ClientCode + "\'));";

    //*********** Injecting HTML and scripts into an the Body Area Field ***********
    bodyAreaField.defaultValue = '<script>var script = document.createElement(\'script\');script.setAttribute(\'type\', \'text/javascript\');script.appendChild(document.createTextNode(\"' + scriptToInject + '\" ));document.body.appendChild(script);</script>';
    return form;
}

/**
 * Gets HTML that will be injected into the Suitelet. Use an HTML minifier tool to achieve this one string output.
 * @returns {string} HTML String
 */

//kruparelia
/*function getHeaderTitle() {
    return " <div style='width:100%' class='container-fluid'> <h1> Total Customers </h1> </div>"
}*/

function getBody() {
    var count = getCustomerCount();
    return "<div style='width:100%' class='container-fluid'>" +
        /*        "<script> require(['N/search']); var search = require('N/search');" +
                "var custSearch = search.load({id:'customsearch_get_customer_count'}); " +
                "var searchResult = custSearch.run().getRange({start: 0,end: 1 })[0];" +
                "var count = searchResult.getValue(name: 'internalid',summary: 'COUNT'});" +
                "console.log('count: '+ count)" +
                "</script>" +*/
        //Replace with your HTML
        "<h1>Total Customers</h1>" +
        "<h2 id='asdf'>" + count + " </h2>" +
        "<input id='clickMe' type='button' value='click me' onclick='refresh()'/>" +
        "</div>";
}

var clientCode = 'run() ' + function run() {


    console.log('Running client code');

    //*********** GLOBAL VARIABLES ***********
    $ = jQuery;
    DEPLOYMENT_URL = '$DEPLOYMENT_URL$';
    THISURL = $(location).attr('href');

    //*********** After DOM loads run this: ***********
    $(function() {
        injectHeaderScripts(); //Loads Libraries that will be placed on header (Optional)
        //injectHeaderTitle();
        injectScript();
        $(window).bind('load', injectHTML); //Replaces Suitelet's body with custom HTML once the window has fully loaded(Required)
        //jQuery(function() {
        //      injectHTML();
        //})
        //$(window).bind('load', injectHTML); //Replaces Suitelet's body with custom HTML once the window has fully loaded(Required)
        waitForLibraries(['swal'], runCustomFunctions); //Runs additional logic after required libraries have loaded (Optional)

    });

    return;
    //*********** HELPER FUNCTIONS ***********


    /**
     * Loads Libraries that will be placed on header (Optional) 
     */
    function injectHeaderScripts() {
        console.log('loadHeaderLibraries START');
        loadjscssfile("https://code.jquery.com/jquery-1.11.3.min.js");
        loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.0/sweetalert.min.js");
        loadjscssfile("https://cdnjs.cloudflare.com/ajax/libs/sweetalert/1.1.0/sweetalert.min.css");
        loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css");
        loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap-theme.min.css");
        loadjscssfile("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js");
        console.log('loadHeaderLibraries END');

        //*********** HELPER FUNCTION ***********
        function loadjscssfile(filename) {
            var filetype = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
            if (filetype == "js") { //if filename is a external JavaScript file
                var fileref = document.createElement('script')
                fileref.setAttribute("type", "text/javascript")
                fileref.setAttribute("src", filename)
            } else if (filetype == "css") { //if filename is an external CSS file
                var fileref = document.createElement("link")
                fileref.setAttribute("rel", "stylesheet")
                fileref.setAttribute("type", "text/css")
                fileref.setAttribute("href", filename)
            }
            if (typeof fileref != "undefined") {
                document.getElementsByTagName("head")[0].appendChild(fileref)
            }
            console.log(filename + ' plugin loaded');
        }
    }

    //create header element to inject - kruparelia
    function injectHeaderTitle() {
        var headerRef = document.createElement('div');
        headerRef.setAttribute("style", "width: 100%");
        headerRef.setAttribute("class", "container-fluid");
        headerRef.innerHTML = '<h1>New Customers</h2>';
        document.body.appendChild(headerRef);
    }

    function refresh() {
        document.getElementById('clickme').onclick = function() {

            location.reload();
        }
    }

    function injectScript() {
        var scriptRef = document.createElement('script');
        scriptRef.innerHTML = 'function refresh(){ require(["N/search"]); var search = require("N/search"); var custSearch = search.load({id:"customsearch_get_customer_count"}); var searchResult = custSearch.getRange({start:0,end:1})[0]; var count = searchResult.getValue({name: "internalid", summary: "COUNT"}); console.log(count); }'
        document.body.appendChild(scriptRef);
    }

    function runCustomFunctions() {
        console.log('clientFunctions START');
        var DEPLOYMENT_URL = '$DEPLOYMENT_URL$';
        //swal('Good job ' + nlapiGetContext().name.split(' ').shift(), 'This code is loaded in the footer. Thanks for trying my script!', "success");
        /*        require(["N/search"]);
                var search = require("N/search");
                replaceCount(search);*/
        //refresh();
    }

    function waitForLibraries(libraries, functionToRun) {
        var loadedLibraries = 0;
        for (var i in libraries) {
            var library = libraries[i];
            if (eval('typeof ' + library) != 'undefined') {
                loadedLibraries++;
            }
        }

        window.setTimeout(function() {
            if (loadedLibraries != libraries.length) {
                waitForLibraries(libraries, functionToRun);
            } else {
                console.log(library + ' loaded');
                functionToRun();
            }
        }, 500);
    }

    function injectHTML() {
        var html = ' $PAGEBODY$ '; //This string will be replaced by the Suitelet
        jQuery("#main_form")[0].outerHTML = html;
    }

    function replaceCount(search) {
        var count = getCustomerCount(search);
        var x = document.getElementById("asdf");
        var i = 0;
        var b = false;
        var date = new Date();
        (function loop() {
            var newCount = getCustomerCount(search);
            console.log(newCount);
            if (count != newCount) {
                count = newCount
                x.innerHTML = count;

            }
            if (!b) {
                setTimeout(loop, 3000)
            }

        })();
    }

    function getCustomerCount(search) {
        var custSearch = search.load({
            id: 'customsearch_get_customer_count'
        });

        var searchResult = custSearch.run().getRange({
            start: 0,
            end: 1
        })[0];

        var count = searchResult.getValue({
            name: 'internalid',
            summary: 'COUNT'
        });

        return count;
    }



}

/**
 * Gets deployment URL. Useful for sending POST requests to this same suitelet.
 * @returns {string} Deployment URL
 */
function getDeploymentURL() {
    return URLMODULE.resolveScript({
        scriptId: RUNTIMEMODULE.getCurrentScript().id,
        deploymentId: RUNTIMEMODULE.getCurrentScript().deploymentId,
        returnExternalUrl: false,
    });
}

function toBase64(stringInput) {
    return ENCODEMODULE.convert({
        string: stringInput,
        inputEncoding: ENCODEMODULE.Encoding.UTF_8,
        outputEncoding: ENCODEMODULE.Encoding.BASE_64
    });
}

function getCustomerCount() {
    var custSearch = SEARCH.load({
        id: 'customsearch_get_customer_count'
    });

    var searchResult = custSearch.run().getRange({
        start: 0,
        end: 1
    })[0];

    var count = searchResult.getValue({
        name: 'internalid',
        summary: 'COUNT'
    });

    return count;
}