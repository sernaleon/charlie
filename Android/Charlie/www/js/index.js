document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    window.plugins.orientationchanger.lockOrientation('landscape');
    window.plugins.insomnia.keepAwake();

    document.getElementById('btDrive').addEventListener('click', function () {
        location.href = "drive.html"
    });
    document.getElementById('btCode').addEventListener('click', function () {
        location.href = "code.html"
    });
}