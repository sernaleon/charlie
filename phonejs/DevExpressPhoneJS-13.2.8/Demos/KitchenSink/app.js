window.KitchenSink = window.KitchenSink || {};
$(function() {
    // Uncomment the line below to disable platform-specific look and feel and to use the Generic theme for all devices
    // DevExpress.devices.current({ platform: "generic" });

    document.addEventListener("deviceready", onDeviceReady, false);
    KitchenSink.app = new DevExpress.framework.html.HtmlApplication({
        namespace: KitchenSink,
        commandMapping: KitchenSink.config.commandMapping,
        navigationType: KitchenSink.config.navigationType,
        navigation: getNavigationItems()
    });

    KitchenSink.app.router.register(":view/:id", { view: "Home", id: undefined });
    
    function showMenu(e) {
        KitchenSink.app.viewShown.remove(showMenu);

        if (e.viewInfo.viewName !== "Home")
            return;

        setTimeout(function() {
            $(".nav-button").trigger("dxclick");
        }, 1000);
    }
    
    function getNavigationItems() {
        if(DevExpress.devices.current().platform === "win8") {
            KitchenSink.config.navigation.push({
                "title": "Panorama",
                "action": "#Panorama",
                "icon": "panorama"
            },
            {
                "title": "Pivot",
                "action": "#Pivot",
                "icon": "pivot"
            });
        }
        return KitchenSink.config.navigation;
    }

    function exitApp() {
        switch(DevExpress.devices.current().platform) {
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

    function onDeviceReady() {
        document.addEventListener("backbutton", onBackButton, false);
        KitchenSink.app.navigatingBack.add(function() {
            if(!KitchenSink.app.canBack()) {
                exitApp();
            }
        });
    }

    function onBackButton() {
        DevExpress.hardwareBackButton.fire();
    }

    KitchenSink.app.viewShown.add(showMenu);
});
