"use strict";

window.DXWorkout = window.DXWorkout || {};

!function () {
    var wo = window.DXWorkout,
        app,
        currentBackAction,
        device = DevExpress.devices.current(),
        realDevice = DevExpress.devices.real,
        APP_SETTINGS = {
            namespace: wo,
            navigationType: wo.config.navigationType,
            navigation: wo.config.navigation
        };

    $.extend(wo, {
        defaultSettings: {
            goal: ["Cardiovascular", "Flexibility", "Losing Fat", "Muscular Strength"],
            exercise: ["Back extension", "Bench press", "Bent-over row", "Biceps curl", "Calf raise", "Chest fly", "Chin-up", "Close-grip bench press", "Crunch",
                "Deadlift", "Dip", "Front raise", "Good-morning", "Handstand push-up", "Hyperextension", "Lateral raise", "Leg curl", "Leg extension", "Leg press",
                "Leg raise", "Lunge", "Machine fly", "Military press", "Pulldown", "Pullup", "Push-up", "Pushdown", "Rear delt raise", "Rowing at cable machine",
                "Seated row", "Shoulder press", "Shoulder shrug", "Sit-up", "Squat", "Supine row", "Triceps extension", "Upright row"],
            lengthUnit: "miles",
            weightUnit: "lbs"
        },

        hardwareBackButton: (device.phone && device.platform === "win8") || device.platform === "android" || device.platform === "tizen",
        currentWorkout: null,

        formatTime: function(totalMinutes) {
            totalMinutes = Math.ceil(totalMinutes);

            var hours = Math.floor(totalMinutes / 60),
                mins = totalMinutes % 60;

            var bag = [];
            if(hours)
                bag.push(hours, "h");

            if(mins) {
                if(bag.length)
                    bag.push(" ");
                bag.push(mins, "m");
            }

            if(!bag.length)
                bag.push(0);

            return bag.join("");
        }
    });

    var subviewMap = {
        "Home": ["Exercise/*", "List/select/*", "Results"],
        "Settings": ["List/edit/*"],
        "GoalGraphs": ["WeightGraphs"]
    };

    function testUri(patterns, uri) {
        var pattern = [],
            regexp;

        $.each(patterns, function() {
            pattern.push(this.replace("/", "\\/").replace("*", ".+"));
        });

        regexp = new RegExp("^(" + pattern.join("|") + ")$");
        return regexp.test(uri);
    }

    function isWorkoutMaster(uri) {
        return testUri(subviewMap["Home"], uri);
    }

    function startApp() {
        var current = wo.getCurrentFromStorage();

        if(current && confirm("Do you want to continue workout in progress?")) {
            var workout = wo.createWorkoutViewModel();
            workout.fromJS(current);
            wo.currentWorkout = workout;
            wo.app.navigate("Results");
            return;
        }

        wo.removeCurrentWorkout();
        wo.app.navigate();
    }

    function onNavigate(args) {
        if(!args.currentUri)
            return;

        if(subviewMap[args.uri] && testUri(subviewMap[args.uri], args.currentUri) && args.options.location === "navigation") {
            args.cancel = true;
            return;
        }

        if (args.options.location === "navigation" && args.options.target !== "back" && isWorkoutMaster(args.currentUri) && !isWorkoutMaster(args.uri)) {
            if(!confirm("Cancel workout in progress?")) {
                args.cancel = true;
            } else {
                wo.removeCurrentWorkout();
            }
        }
    }

    function onViewShown(args) {
        var viewInfo = args.viewInfo;
        if (viewInfo.model.hideNavigationButton)
            viewInfo.renderResult.$markup.find(".nav-button-item").remove();

        currentBackAction = viewInfo.model.backButtonDown;
    }

    function onBackButton() {
        if(currentBackAction) {
            currentBackAction();
        } else {
            DevExpress.hardwareBackButton.fire();
        }
    }

    function exitApp() {
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

    function onDeviceReady() {
        document.addEventListener("backbutton", onBackButton, false);
        document.addEventListener("pause", wo.saveCurrentWorkout, false);
        navigator.splashscreen.hide();
        wo.app.navigatingBack.add(function() {
            if(!wo.app.canBack()) {
                exitApp();
            }
        });
    }

    $(function() {
        // Uncomment the line below to disable platform-specific look and feel and to use the Generic theme for all devices
        // DevExpress.devices.current({ platform: "generic" });

        app = wo.app = new DevExpress.framework.html.HtmlApplication(APP_SETTINGS);
        app.router.register(":view/:action/:item", { view: "Home", action: undefined, item: undefined });
        wo.app.viewShown.add(onViewShown);
        wo.app.navigating.add(onNavigate);

        wo.initUserData();
        startApp();

        setTimeout(function() {
            document.addEventListener("deviceready", onDeviceReady, false);
            window.onunload = wo.saveCurrentWorkout;

            if(device.platform == "tizen") {
                document.addEventListener("tizenhwkey", function(e) {
                    if(e.keyName === "back")
                        onBackButton();
                });
            }
        }, 1000);
        DevExpress.viz.core.currentTheme(DevExpress.devices.current().platform, undefined, device.version[0]);
    });
}();