var watchID = null;
var websocket = null;
var isSending = false;

document.addEventListener("deviceready", onDeviceReady, false);


function onDeviceReady() {
    window.plugins.orientationchanger.lockOrientation('landscape');
    window.plugins.insomnia.keepAwake();

    document.getElementById("overlay").onclick = onTap;
    document.getElementById("camFrame").src = "http://" + SERVER_IP + ":" + SERVER_CAM_PORT;
    document.addEventListener("backbutton", onBackKeyDown, false);

    websocket = new WebSocket(WEBHOST);

    websocket.onopen = function (evt) {
        toast("Connected. Tap to start")
    };

    websocket.onmessage = function (msg) {
        console.log(msg)
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
    var msg = new Uint8Array(3);
    msg[0] = CMD_MOVE_FORWARD;
    msg[1] = map(acceleration.x * 100, 0, 1000, 255, 0,true);
    msg[2] = map(acceleration.y * 100, -1000, 1000, 0, 255,true);

    websocket.send(msg)
}

function onAccelerometerError(a) {
    console.log('onAccelerometerError!' + a);
}

function moveServo(){
    var msg = new Uint8Array(2)
    msg[0] = CMD_SERVO;
    msg[1] = document.getElementById("slider").value;
    websocket.send(msg)
}