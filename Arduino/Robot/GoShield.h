#ifndef GOSHIELD_H
#define GOSHIELD_H

#include "Arduino.h"
#include "Types.h"

class GoShield
{
    private:
        byte leds[12];
        byte middleSensor[9];
        byte frontSensor[12];

        void setForwardSpeedRight(int speed);
        void setForwardSpeedLeft(int speed);
        void setMotors(int left, int right);
        void Move(int speed, int balance);
    public:
        GoShield();
        void loop();
};

#endif // GOSHIELD_H
