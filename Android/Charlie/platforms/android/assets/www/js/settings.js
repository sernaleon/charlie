document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {


    alert("hola")

    document.getElementById('ip').value = SERVER_IP;
    document.getElementById('cam').value = SERVER_CAM_PORT;
    document.getElementById('cmd').value = WEBSERVER_PORT;



    window.plugins.orientationchanger.lockOrientation('default');
    window.plugins.insomnia.keepAwake();

    document.addEventListener("backbutton", onBackKeyDown, false);
}

function onBackKeyDown() {
    window.location.href = "index.html";
}