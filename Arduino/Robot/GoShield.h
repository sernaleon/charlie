#ifndef GOSHIELD_H
#define GOSHIELD_H

#include "Arduino.h"
#include "Types.h"

class GoShield
{
    private:
        byte leds[NUMLEDS];
        byte blueLeds[NUMBLUELEDS];
        byte middleSensor[NUMMIDS];
        byte frontSensor[NUMFRONTS];

        void getAndRunCommandFromUSB();
        void moveForward(byte speed, byte balance);
        void stop();
        void beep(byte status);
        void setMotors(int left, int right);
        void setForwardSpeedRight(int speed);
        void setForwardSpeedLeft(int speed);
    public:
        GoShield();
        void loop();
};

#endif // GOSHIELD_H
