
function onLoad(){

    document.addEventListener("deviceready", onDeviceReady, false);

    document.getElementById("ip").value = SERVER_IP;
    document.getElementById("cam").value = SERVER_CAM_PORT;
    document.getElementById("cmd").value = WEBSERVER_PORT;

}

function onDeviceReady() {

    window.plugins.orientationchanger.lockOrientation('default');
    window.plugins.insomnia.keepAwake();

    document.addEventListener("backbutton", onBackKeyDown, false);
}

// Handle the back button
//
function onBackKeyDown() {
    window.location.href = "index.html";
}

function changeIP(){
    setCookie("IP",document.getElementById("ip").value);
}

function changeCam(){

    setCookie("CAM",document.getElementById("cam").value);
}

function changeCmd(){
    setCookie("CMD",document.getElementById("cmd").value);
}
