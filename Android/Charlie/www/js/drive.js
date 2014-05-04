/**
 * Created by monkey on 31/03/14.
 */
var watchID = null;
var websocket = null;
var isSending = false;

document.addEventListener("deviceready", onDeviceReady, false);
document.getElementById("overlay").onclick = onTap;

function onDeviceReady() {
    window.plugins.orientationchanger.lockOrientation('landscape');
    window.plugins.insomnia.keepAwake();
    websocket = new WebSocket(WEBHOST);


    document.getElementById("camFrame").src = "http://" + SERVER_IP + ":" + SERVER_CAM_PORT;
    document.addEventListener("backbutton", onBackKeyDown, false);

    websocket.onopen = function (evt) {
        toast("Connected. Tap to start")
    };

    websocket.onerror = function (evt) {
        websocket.close();
        onDeviceReady();
    };
}


function onBackKeyDown() {

    websocket.close();
    window.location.href = "index.html";
}

function onTap() {
    if (isSending) {
        stopCharlie();
    }
    else {
        startCharlie();
    }
}

function startCharlie() {
    var options = { frequency: ACCELEROMETER_FREQUENCY };
    watchID = navigator.accelerometer.watchAcceleration(onAccelerometerChanged, onAccelerometerError, options);

    isSending = true;
    document.getElementById("play").style.display = 'block';
    toast("STARTED. Tap to stop.");
}

function stopCharlie() {
    var msg = new Uint8Array(3)
    msg[0] = CMD_STOP;
    msg[1] = CMD_NOPARAM
    msg[2] = CMD_NOPARAM
    websocket.send(msg)

    if (watchID) {
        navigator.accelerometer.clearWatch(watchID);
        watchID = null;
    }

    isSending = false;

    document.getElementById("play").style.display = 'none';
    toast("STOPPED. Tap to start.");
}

function onAccelerometerChanged(acceleration) {
    var msg = formatCMD(
        CMD_MOVE_FORWARD,
        map(acceleration.x * 100, 0, 1000, 255, 0),
        map(acceleration.y * 100, -1000, 1000, 0, 255))
    var element = document.getElementById('accelerometer');
    websocket.send(msg)
}

function onAccelerometerError(a) {
    console.log('onAccelerometerError!' + a);
}


function moveServo(){
    var msg = new Uint8Array(2)
    msg[0] = CMD_SERVO;
    msg[1] = document.getElementById("slider").value;

//    alert(document.getElementById("slider").value +"-"+msg[1])
    websocket.send(msg)
}