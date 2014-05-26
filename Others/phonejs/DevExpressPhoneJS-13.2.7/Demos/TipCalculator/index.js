"use strict";

window.TipCalculator = window.TipCalculator || {};

$(function() {
    // Uncomment the line below to disable platform-specific look and feel and to use the Generic theme for all devices
    // DevExpress.devices.current({ platform: "generic" });

    document.addEventListener("deviceready", function() { navigator.splashscreen.hide(); });

    TipCalculator.app = new DevExpress.framework.html.HtmlApplication({
        namespace: TipCalculator,
        navigationType: TipCalculator.config.navigationType
    });

    TipCalculator.app.router.register(":view", { view: "home" });
    TipCalculator.app.navigate();   
});

Globalize.culture(navigator.language || navigator.browserLanguage);
//Globalize.culture("fr");