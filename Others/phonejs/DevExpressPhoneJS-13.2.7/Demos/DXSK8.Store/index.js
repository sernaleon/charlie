window.DXSK8 = window.DXSK8 || {};
window.DXSK8.Store = window.DXSK8.Store || {};

$(function() {
    var DX = DevExpress,
        currentDevice = DX.devices.current(),
        realDevice = DX.devices.real;
    currentDevice.platform = "generic";

    function setScreenSize() {
        var el = $("<div>").addClass("screen-size").appendTo(".dx-viewport");
        var size = getComputedStyle(el[0], ":after").content.replace(/"/g, "");
        el.remove();
        currentDevice.screenSize = size;
    }

    function onDeviceReady() {
        document.addEventListener("backbutton", onBackButton, false);
    }

    function onBackButton() {
        if(DXSK8.app.canBack()) {
            DXSK8.app.back();
        } else {
            if(confirm("Are you sure you want to exit?")) {
                switch(realDevice.platform) {
                    case "tizen":
                        tizen.application.getCurrentApplication().exit();
                        break;
                    case "android":
                        navigator.app.exitApp();
                        break;
                    case "win8":
                        window.external.Notify("DevExpress.ExitApp");
                        break;
                }
            }
        }
    }

    DXSK8.app = new DevExpress.framework.html.HtmlApplication({
        namespace: DXSK8.Store,
        navigationType: DXSK8.config.navigationType,
        navigation: DXSK8.config.navigation,
        navigateToRootViewMode: "keepHistory"
    });
    DXSK8.app.router.register(":view/:type/:id", { view: "Home", type: undefined, id: undefined });

    setScreenSize();
    $(window).bind("load resize", setScreenSize);

    DXSK8.app.navigate();

    document.addEventListener("deviceready", onDeviceReady, false);
    if(realDevice.platform == "tizen") {
        document.addEventListener("tizenhwkey", function(e) {
            if(e.keyName === "back")
                onBackButton();
        });
    }
});
