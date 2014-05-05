/**
 * Created by monkey on 10/03/14.
 */


DEFAULT_IP = "192.168.0.123";
DEFAULT_CAM = 8080;
DEFAULT_CMD = 8000;

SERVER_IP= "192.168.0.123" //(getCookie("IP") ? getCookie("IP") : DEFAULT_IP);
SERVER_CAM_PORT = 8080; // (getCookie("CAM") ? parseInt(getCookie("CAM")) : DEFAULT_CAM);
WEBSERVER_PORT  = 8000; // (getCookie("CMD") ? parseInt(getCookie("CMD")) : DEFAULT_CMD);

WEBHOST = "ws://" + SERVER_IP + ":" + WEBSERVER_PORT;

ACCELEROMETER_FREQUENCY = 40;


SLOW_SPEED = 130
MEDIUM_SPEED = 190
FAST_SPEED = 255

//COMMANDS

CMD_ON = 1;
CMD_OFF = 0;
CMD_NOPARAM = 0;

CMD_STOP = 0;
CMD_MOVE_FORWARD = 1;
CMD_SET_LEFT = 2
CMD_SET_RIGHT = 3
CMD_BOTH_MOTORS = 4;
CMD_LEFT_MOTOR = 5;
CMD_RIGHT_MOTOR = 6;
CMD_MOVE_BACKWARD = 7;
CMD_BACK_BOTH= 8;
CMD_BACK_LEFT= 9;
CMD_BACK_RIGHT= 10;
CMD_BEEP = 11;
CMD_LED = 12;
CMD_SENSORS = 13;
CMD_FRONT = 14;
CMD_MIDDLE = 15;
CMD_SERVO = 16;

PYT_SEND = "sendToArduino"
PYT_RECEIVE = "receiveFromArduino"
PYT_CAM= "takePic"
PYT_SONAR = "readSonar"
PYT_SERVO = "moveServo"
PYT_SENDBACK = "sendToAndroid"
PYT_FIRSTBLACKLEFT = "firstBlackLeft"
PYT_MAP = "map"



//function setCookie(cname,cvalue)
//{
//    var d = new Date();
//    d.setTime(d.getTime()+(31536000000));
//    var expires = "expires="+d.toGMTString();
//    document.cookie = cname + "=" + cvalue + "; " + expires;
//}
//
//function getCookie(cname)
//{
//    var name = cname + "=";
//    var ca = document.cookie.split(';');
//    for(var i=0; i<ca.length; i++)
//    {
//        var c = ca[i].trim();
//        if (c.indexOf(name)==0) return c.substring(name.length,c.length);
//    }
//    return null;
//}