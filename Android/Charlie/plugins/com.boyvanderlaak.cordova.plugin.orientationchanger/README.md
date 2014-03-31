## Android Orientation Changer

Android devices have a lot of different resolutions. Your responsive design might not work for multiple orientations on each of those devices. With this plugin you can lock the orientation on runtime after you get the device dimensions. 

## Installation

Through the [Command-line Interface](http://cordova.apache.org/docs/en/3.0.0/guide_cli_index.md.html#The%20Command-line%20Interface):
```
cordova plugin add https://github.com/Hless/cordova-plugin-orientationchanger.git
```

To remove:
```
cordova plugin rm com.boyvanderlaak.cordova.plugin.orientationchanger
```

## Usage

After cordova and its plugins are loaded you can execute the following line of code to lock the orientation:
```javascript
window.plugins.orientationchanger.lockOrientation('landscape');
```
You can choose between `'portrait'`, `'landscape'`, `'sensor'` and `'default'`. `'default'` being the orientation as configured in your config.xml. The `'sensor'` setting forces the orientation to be whatever orientation the device is in, regardless of your setting in config.xml. Note that some devices do not support all four orientations in sensor mode (for example some devices won't normally use 180 degree rotation). 

If you want to revert back to default behaviour you can use:
```javascript
window.plugins.orientationchanger.resetOrientation(); // Note that is the same as doing .lockOrientation('default')
```

To get the currently enforced orientation:
```javascript
var currentOrientation = window.plugins.orientationchanger.getOrientation();
if(currentOrientation == 'landscape') {
  // Do something that only happens in landscape
  // Note that .getOrientation() just returns 'default' and not the displayed orientation 
  // if you haven't locked any orientation
}
```