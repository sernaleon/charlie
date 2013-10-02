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

        void setForwardSpeedRight(int speed);
        void setForwardSpeedLeft(int speed);
        void setMotors(int left, int right);
        void Move(byte speed, byte balance);
        void Stop();
    public:
        GoShield();
        void loop();
};

#endif // GOSHIELD_H
