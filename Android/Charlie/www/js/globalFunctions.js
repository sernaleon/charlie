/**
 * Created by monkey on 31/03/14.
 */



function map(x, in_min, in_max, out_min, out_max) {
    if (x < in_min) x = in_min;
    else if (x > in_max) x = in_max;
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function formatCMD(CMD, PARAM1, PARAM2) {
    var res = new Uint8Array(3);
    res[0] = CMD;
    res[1] = PARAM1;
    res[2] = PARAM2;
    return res;
}

//!!! LOAD ONLY AFTER PHONEGAP IS READY!!!
function toast(msg) {
    window.plugins.toast.showShortBottom(msg,
        function (a) {
            console.log('toast success: ' + a)
        },
        function (b) {
            console.log('toast error: ' + b)
        })
}