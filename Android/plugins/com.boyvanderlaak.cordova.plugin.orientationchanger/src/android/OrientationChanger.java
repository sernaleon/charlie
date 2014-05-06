package com.boyvanderlaak.cordova.plugin.orientationchanger;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONException;

import android.content.pm.ActivityInfo;

public class OrientationChanger extends CordovaPlugin {

  private static final String actionLockOrientation = "lockOrientation";

  @Override
  public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

    if (action.equalsIgnoreCase(actionLockOrientation)) {
      
      String orientation = args.getString(0);

      try {
        
        // Unspecified means that the activity will be listening to application settings or user preferred orientation.
        int requestOrientation = ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED;
        
        if(orientation.equalsIgnoreCase("portrait")) {
          requestOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT;
        }
        
        if(orientation.equalsIgnoreCase("landscape")) {
          requestOrientation = ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE;
        }

        if(orientation.equalsIgnoreCase("sensor")) {
          requestOrientation = ActivityInfo.SCREEN_ORIENTATION_SENSOR;
        }
        
        cordova.getActivity().setRequestedOrientation(requestOrientation);
        
        return true;

      } catch (Exception e) {

        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.ERROR));

      }

    }

    // Returning false results in a "MethodNotFound" error.
    return false;

  }

}