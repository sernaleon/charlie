
var activeOrientation = 'default';

var OrientationChanger = function(){

};

OrientationChanger.prototype = {
  /**
   * Lock the device into the requested orientation
   * 
   * @param {String} orientation - Orientation to lock the device into, 
   *   choose from: default, landscape, portrait (where default is the orientation as set in the config.xml)
   */
  lockOrientation: function(orientation) {

    // Check for valid orientations
    if(orientation !== 'default' && orientation !== 'landscape' && orientation !== 'portrait' && orientation !== 'sensor')
      return;

    activeOrientation = orientation.toLowerCase();

    cordova.exec(null, null, 'OrientationChanger', 'lockOrientation', [activeOrientation]);
  },
  /** 
   * Reset to default behaviour
   */
  resetOrientation: function(){
    this.lockOrientation('default');
  },
  /**
   * Returns the current orientation lock
   */
  getOrientation: function(){
    return activeOrientation;
  }
};

var plugin = new OrientationChanger();

module.exports = plugin;