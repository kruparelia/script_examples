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
            var recPresentationPageId = scriptObj.getParameter('custscript_presentation_page_meter');
            log.debug('custom rec id', recPresentationPageId);

            var cssStyles = search.lookupFields({
                type: 'customrecord_ns_present_pg_meter',
                id: recPresentationPageId,
                columns: ['custrecord_txt_font_style_meter', 'custrecord_bg_color_hex_meter', 'custrecord_ss_meter', 'custrecord_meter_font_color', 'custrecord_meter_title', 'custrecord_img_meter_logo', 'custrecord_img_meter_icon', 'custrecord_int_title_font_size_meter', 'custrecord_int_meter_font_size', 'custrecord_meter_goal', 'custrecord_meter_bg_color', 'custrecord_meter_fill_color']
            })
            var ssId = cssStyles.custrecord_ss_meter[0].value;
            var result = getData(ssId);
            //get css styles from custom record

            var bgColor = cssStyles.custrecord_bg_color_hex_meter;
            var font = cssStyles.custrecord_txt_font_style_meter;
            var counterFontColor = cssStyles.custrecord_meter_font_color;
            var title = cssStyles.custrecord_meter_title;
            var logo = cssStyles.custrecord_img_meter_logo;
            var icon = cssStyles.custrecord_img_meter_icon;
            var titleFontSize = cssStyles.custrecord_int_title_font_size_meter;
            var countFontSize = cssStyles.custrecord_int_meter_font_size;
            var meterGoal = cssStyles.custrecord_meter_goal;
            var meterBgColor = cssStyles.custrecord_meter_bg_color;
            var meterFillColor = cssStyles.custrecord_meter_fill_color

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
                //'#asdf{color: ' + counterFontColor + '; font-size: ' + countFontSize + 'px; text-align: center;}' +
                '.fundometer-container { width: 100%; display: none;}' +
                '.fundometer-bg { height:30px; border:1px solid #949393; background-color:' + meterBgColor + '; }' +
                '.fundometer-fill { width:0; height:28px; background-color:' + meterFillColor + '; }' +
                '.fundometer-text { font-size: 14px; color: ' + counterFontColor + '; }' +
                ' .fundometer-text .fundometer-raised-container { position: relative; top: -25px; color: white; padding-left: 27em;; font-weight: bolder; left: 0; right: 0; margin: auto; text-align: center; font-size:16px;}' +
                '</style>' +
                //'   <title>Show customer list</title>' +
                // '<link rel="stylesheet" type="text/css" href="https://system.netsuite.com/core/media/media.nl?id=324496&c=364464_SB1&h=1ad2247af6dc3893cc55&_xt=.css">' +
                // '<link rel="stylesheet" type="text/css" href="https://system.netsuite.com/core/media/media.nl?id=324495&c=364464_SB1&h=3f38a249f9ce8779c0f5&_xt=.css">' +
                '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>' +
                ' </head>' +
                ' <body>' +
                '<div class="center2">' +
                '   <h1> <img src="' + strIcon + '" width="50" height="50"> ' + title + ' </h1>' +
                '<div class="fundometer-container">' +
                '<div class="fundometer-bg"><div class="fundometer-fill"></div></div>' +
                '<div class = "fundometer-text" >' +
                '<span style = "float:right"> Goal: $ <span class = "fundometer-goal">' + meterGoal + '</span></span>$<span class = "raised-number" >0</span>' +
                ' <span class="fundometer-raised-container">$ <span class="fundometer-raised">' + result + ' </span></span></div></div>' +
                '<img src="' + strLogo + '" width="150" height="50" style="float:right">' +
                '</div>' +
                '<script>' +
                //'<script src = "https://system.netsuite.com/core/media/media.nl?id=324500&c=364464_SB1&h=37cdb5b0e1687f732ff8&_xt=.js"> ' +
                'function addCommas(e){x=(e+="").split("."),x1=x[0],x2=x.length>1?"."+x[1]:"";for(var t=/(\d+)(\d{3})/;t.test(x1);)x1=x1.replace(t,"$1,$2");return x1+x2}function drawMeter(){jQuery(".fundometer-goal").each(function(e){var t=jQuery(this).text();if(null!=t&&""!=jQuery.trim(t)&&!isNaN(t)){var r=jQuery(this).parent().parent().parent(),a=r.find(".fundometer-exceed").text(),d=r.find(".fundometer-raised"),n=d.text();"Yes"!=a&&(n=Math.min(n,t)),d.text(addCommas(n)),jQuery(this).text(addCommas(t));var i=n/t*100;i=Math.min(i,100),r.find(".fundometer-fill").css("width",i+"%"),r.css("display","block")}})}jQuery(document).ready(drawMeter);' +
                //'setTimeout(function(){ console.log("refreshing");location = ""},5000)' +
                '</script>' +
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

            totalDonor = parseInt(totalDonor)

            //totalDonor = numberWithCommas(totalDonor)

            return totalDonor

        }

        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        return {
            onRequest: onRequest
        };

    });