/* 
	Editor: http://www.visualmicro.com
	        visual micro and the arduino ide ignore this code during compilation. this code is automatically maintained by visualmicro, manual changes to this file will be overwritten
	        the contents of the Visual Micro sketch sub folder can be deleted prior to publishing a project
	        all non-arduino files created by visual micro and all visual studio project or solution files can be freely deleted and are not required to compile a sketch (do not delete your own code!).
	        note: debugger breakpoints are stored in '.sln' or '.asln' files, knowledge of last uploaded breakpoints is stored in the upload.vmps.xml file. Both files are required to continue a previous debug session without needing to compile and upload again
	
	Hardware: Arduino Due (Programming Port), Platform=sam, Package=arduino
*/

#define __SAM3X8E__
#define USB_VID 0x2341
#define USB_PID 0x003e
#define USBCON
#define USB_MANUFACTURER "\"Unknown\""
#define USB_PRODUCT "\"Arduino Due\""
#define ARDUINO 101
#define ARDUINO_MAIN
#define F_CPU 84000000L
#define printf iprintf
#define __SAM__
#define __cplusplus
extern "C" void __cxa_pure_virtual() {;}

//
//
void led(byte num,bool status);
void beep(bool status);
void sendFrontAndMiddle();
void sendFront();
void sendMiddle();
void sendAnalogFront();
void readMiddle();
void readFront();
void stopMotors();
void setForwardSpeedRight(int speed);
void setForwardSpeedLeft(int speed);
void setMotors(int left, int right);
void turnLeft(byte speed);
void turnRight(byte speed);
void setLeftSpeed(byte speed);
void setRightSpeed(byte speed);
void moveBalanced(byte speed, byte balance);
void moveForwards(byte speed);
void setBackSpeedLeft(int speed);
void setBackSpeedRight(int speed);
void moveBackBalanced(byte speed, byte balance);
void moveBackBoth(byte speed);
void moveBackLeft(byte speed);
void moveBackRight(byte speed);

#include "C:\Users\monkey\Documents\Archivos\Programas\arduino-1.5.6\hardware\arduino\sam\variants\arduino_due_x\pins_arduino.h" 
#include "C:\Users\monkey\Documents\Archivos\Programas\arduino-1.5.6\hardware\arduino\sam\variants\arduino_due_x\variant.h" 
#include "C:\Users\monkey\Documents\Archivos\Programas\arduino-1.5.6\hardware\arduino\sam\cores\arduino\arduino.h"
#include "C:\Users\monkey\Dropbox\Asignaturas\0. SI\Arduino\Arduino.ino"
#include "C:\Users\monkey\Dropbox\Asignaturas\0. SI\Arduino\Types.h"
