
//Map function
// Receives an x in a range [inMin,inMax], and escalates this value to [outMin,outMax]
// if the option checkRanges is set to true and the x value is out of range, sets its value to the outMin or outMax, depending of the value.
// Example:
// map(13,2,4,5,6)      -> 10.5
// map(13,2,4,5,6,true) -> 6
function map(x, in_min, in_max, out_min, out_max,checkRanges) {
    if ((typeof checkRanges != 'undefined') && checkRanges) {
        if (x < in_min) x = in_min;
        else if (x > in_max) x = in_max;
    }
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}


// If PhoneGap Toast Plugin is enabled, shows a short toast with message "msg"
function toast(msg) {
    if (typeof window.plugins.toast != 'undefined')
    {
        window.plugins.toast.showShortBottom(msg,
            function (a) {
                console.log('toast success: ' + a)
            },
            function (b) {
                console.log('toast error: ' + b)
            })
    }
}