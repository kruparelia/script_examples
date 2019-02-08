function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function drawMeter() {

    jQuery('.fundometer-goal').each(function(index) {
        var goal = jQuery(this).text();

        // determine that the goal amount exist.
        if (goal != null && jQuery.trim(goal) != '' && !isNaN(goal)) {

            // Getting my containers.
            var container = jQuery(this).parent().parent().parent();
            var exceedgoal = container.find('.fundometer-exceed').text();

            // Get amount raised.
            var raisedSpan = container.find('.fundometer-raised');
            var raised = raisedSpan.text();

            // Check to see if my raised amount can exceed goal.		
            if (exceedgoal != 'Yes') {
                raised = Math.min(raised, goal);
            }

            // format 
            raisedSpan.text(addCommas(raised));
            jQuery(this).text(addCommas(goal));

            // make sure that the width never exceed 100%
            var width = raised / goal * 100;
            width = Math.min(width, 100);
            container.find('.fundometer-fill').css('width', width + '%');

            // Show the bar 
            container.css('display', 'block');
        }
    });
}

jQuery(document).ready(drawMeter);
/*setTimeout(function() {
    console.log("refreshing");
    location = ""
}, 5000)*/