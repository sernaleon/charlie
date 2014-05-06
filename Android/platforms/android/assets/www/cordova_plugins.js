cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.device-motion/www/Acceleration.js",
        "id": "org.apache.cordova.device-motion.Acceleration",
        "clobbers": [
            "Acceleration"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device-motion/www/accelerometer.js",
        "id": "org.apache.cordova.device-motion.accelerometer",
        "clobbers": [
            "navigator.accelerometer"
        ]
    },
    {
        "file": "plugins/nl.x-services.plugins.toast/www/Toast.js",
        "id": "nl.x-services.plugins.toast.Toast",
        "clobbers": [
            "window.plugins.toast"
        ]
    },
    {
        "file": "plugins/com.boyvanderlaak.cordova.plugin.orientationchanger/www/orientationchanger.js",
        "id": "com.boyvanderlaak.cordova.plugin.orientationchanger.OrientationChanger",
        "clobbers": [
            "window.plugins.orientationchanger"
        ]
    },
    {
        "file": "plugins/nl.x-services.plugins.insomnia/www/Insomnia.js",
        "id": "nl.x-services.plugins.insomnia.WebViewColor",
        "clobbers": [
            "window.plugins.insomnia"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "org.apache.cordova.device-motion": "0.2.6",
    "nl.x-services.plugins.toast": "1.0",
    "com.boyvanderlaak.cordova.plugin.orientationchanger": "0.1.1",
    "nl.x-services.plugins.insomnia": "3.0"
}
// BOTTOM OF METADATA
});