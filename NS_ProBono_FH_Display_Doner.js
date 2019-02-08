/**
 * @NApiVersion 2.x
 * @NScriptType Suitelet
 * @NModuleScope SameAccount
 */
define(['N/search', 'N/log', 'N/runtime'],

    function(search, log, runtime) {

        /**
         * Definition of the Suitelet script trigger point.
         *
         * @param {Object} context
         * @param {ServerRequest} context.request - Encapsulation of the incoming request
         * @param {ServerResponse} context.response - Encapsulation of the Suitelet response
         * @Since 2015.2
         */
        function onRequest(context) {
            if (context.request.method === 'GET') {
                var stHtml = "";
                stHtml += "";
                stHtml += generateForm();
                stHtml += "";
                context.response.write(stHtml);
            }
        }

        function generateForm() {
            var scriptObj = runtime.getCurrentScript();
            var recPresentationPageId = scriptObj.getParameter('custscript_presentation_page');
            log.debug('custom rec id', recPresentationPageId);

            var cssStyles = search.lookupFields({
                type: 'customrecord_ns_present_pg_counter',
                id: recPresentationPageId,
                columns: ['custrecord_txt_font_style', 'custrecord_bg_color_hex', 'custrecord_ss_counter', 'custrecord_counter_font_color', 'custrecord_title', 'custrecord_img_logo', 'custrecord_img_icon', 'custrecord_int_title_font_size', 'custrecord_int_count_font_size']
            })
            var ssId = cssStyles.custrecord_ss_counter[0].value;
            var result = getData(ssId);
            //get css styles from custom record

            var bgColor = cssStyles.custrecord_bg_color_hex;
            var font = cssStyles.custrecord_txt_font_style;
            var counterFontColor = cssStyles.custrecord_counter_font_color;
            var title = cssStyles.custrecord_title;
            var logo = cssStyles.custrecord_img_logo;
            var icon = cssStyles.custrecord_img_icon;
            var titleFontSize = cssStyles.custrecord_int_title_font_size;
            var countFontSize = cssStyles.custrecord_int_count_font_size;

            var strLogo = 'https://system.netsuite.com' + logo[0].text;
            var strIcon = 'https://system.netsuite.com' + icon[0].text;

            return '<!DOCTYPE html>' +
                '<html>' +
                ' <head>' +
                '   <meta charset="UTF-8">' +
                '<link href="https://fonts.googleapis.com/css?family=' + font + '" rel="stylesheet">' +
                '<style>' +
                '.center {position: absolute;top: 50%;left: 0;right: 0;margin: auto;-webkit-transform: translateY(-50%);-ms-transform: translateY(-50%);transform: translateY(-50%);}' +
                '.center2 {margin: auto; width: 50%; font-size: 20px}' +
                '.center2 p {position: absolute; right: 0; bottom: 0;}' +
                'body {background-color: ' + bgColor + '; font-family: ' + font + ';}' +
                'h1{font-size: ' + titleFontSize + 'px; color: white; text-align: center;}' +
                '#asdf{color: ' + counterFontColor + '; font-size: ' + countFontSize + 'px; text-align: center;}' +
                '</style>' +
                //'   <title>Show customer list</title>' +
                // '<link rel="stylesheet" type="text/css" href="https://system.netsuite.com/core/media/media.nl?id=324496&c=364464_SB1&h=1ad2247af6dc3893cc55&_xt=.css">' +
                // '<link rel="stylesheet" type="text/css" href="https://system.netsuite.com/core/media/media.nl?id=324495&c=364464_SB1&h=3f38a249f9ce8779c0f5&_xt=.css">' +
                ' </head>' +
                ' <body>' +
                '<div class="center2">' +
                '   <h1> <img src="' + strIcon + '" width="50" height="50"> ' + title + ' </h1>' +
                '<h1 id="asdf"> ' + result + '</h2>' +
                '<img src="' + strLogo + '" width="150" height="50" style="float:right">' +
                '</div>' +
                '<script> setTimeout(function(){ console.log("refreshing");location = ""},5000) </script>' +
                ' </body>' +
                ' </html>'
        }

        function getData(savedSearch) {
            var donorSearch = search.load(savedSearch);
            var searchResult = donorSearch.run().getRange({
                start: 0,
                end: 1
            })[0];
            var columnName = donorSearch.columns[0].name;
            var summaryName = donorSearch.columns[0].summary
            var totalDonor = searchResult.getValue({
                name: columnName,
                summary: summaryName
            })

            return totalDonor

        }

        return {
            onRequest: onRequest
        };

    });