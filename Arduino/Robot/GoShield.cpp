#include "GoShield.h"

GoShield::GoShield()
{
    //Disables interrups for the initialization
    noInterrupts();

    //Enables USB port for communication with Raspberry
    Serial.begin(9600);

    //Resolution of analogic port: 10 = 1024 (can be configured up to 12 = 4095)
    analogWriteResolution(10);

    //Constants
    blueLeds = { O_LED8, O_LED13 };
    leds= { O_LED4, O_LED5,O_LED6,O_LED7,O_LED9,O_LED10,O_LED11,O_LED12,O_LED14,O_LED15,O_LED16,O_LED17 };
    middleSensor= { I_IR1, I_IR2, I_IR3, I_IR4, I_IR5, I_IR6, I_IR7, I_IR8, I_IR9 };
    frontSensor = { I_IR10, I_IR11, I_IR12, I_IR13, I_IR14, I_IR15, I_IR16, I_IR17, I_IR18, I_IR19, I_IR20, I_IR21  };

    //Configuration of input pins
    byte listIN []= { I_IR10, I_IR11, I_IR12, I_IR13, I_IR14, I_IR15, I_IR16, I_IR17, I_IR18, I_IR19, I_IR20, I_IR21, I_IR1, I_IR2, I_IR3, I_IR4, I_IR5, I_IR6, I_IR7, I_IR8, I_IR9, O_LED4, O_LED5,O_LED6,O_LED7,O_LED8,O_LED9,O_LED10,O_LED11,O_LED12,O_LED13,O_LED14,O_LED15,O_LED16,I_BUTTON };
    for (int i=0;i< KINPUTS  ;i++)
    {
      pinMode(listIN[i],INPUT);
      digitalWrite(listIN[i], LOW);
    }
    
    //Configuration of output pins
    byte listOUT [] = {O_IRON_AN, O_IRON_DG , O_BUZZER,  O_LED4, O_LED5,O_LED6,O_LED7,O_LED8,O_LED9,O_LED10,O_LED11,O_LED12,O_LED13,O_LED14,O_LED15,O_LED16,O_LED17,O_Ain1,O_Ain2,O_Bin1,O_Bin2};
    for (int i=0;i< KOUTPUTS ;i++)
    {
      pinMode(listOUT[i],OUTPUT);
      digitalWrite(listOUT[i], LOW);
    }

    //Activates interrups again
    interrupts();
}

void GoShield::loop()
{
    //Receive a message (3 bytes)
    if (Serial.available() >= 3)
    {
        byte cmd = Serial.read();  //Command
        byte p1  = Serial.read();  //First parameter
        byte p2  = Serial.read();  //Second parameter

        switch (cmd)
        {
            //Command 0 -> Stop
            case 0:
                Stop();
                break;

            //Command 1 -> Move
            case 1:
                Move(p1,p2);
                break;
       }
    }
}

void GoShield::Move(byte speed, byte balance)
{
    //Sets speed between 0 and KMAXSPEED
    int speedMapped = map(speed,0,255,0,KSPEED);
    
    //Sets balance between -KTURNSPEED and KTURNSPEED
    int balanceMapped = map(balance,0,255,-KTURNSPEED,KTURNSPEED);

    //Sets speed of left and right motors
    int left = speedMapped - balanceMapped;
    int right = speedMapped + balanceMapped;

    setMotors(left,right);
}

void GoShield::Stop()
{
    setMotors(0,0);
}

void GoShield::setMotors(int left, int right)
{
    setForwardSpeedRight(left);
    setForwardSpeedLeft(right);
}

void GoShield::setForwardSpeedRight(int speed)
{
        //Check if numbers are out of range
	if      (speed < 0)         speed = 0;
	else if (speed > KMAXSPEED) speed = KMAXSPEED;

        //Set motor speed
	analogWrite(O_Ain1,speed);
	digitalWrite(O_Ain2,LOW);
}

void GoShield::setForwardSpeedLeft(int speed)
{
        //Check if numbers are out of range
	if      (speed < 0)         speed = 0;
	else if (speed > KMAXSPEED) speed = KMAXSPEED;

        //Set motor speed
	analogWrite(O_Bin1,speed);
	digitalWrite(O_Bin2,LOW);
}