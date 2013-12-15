#include "Types.h"

byte leds[NUMLEDS];
byte blueLeds[NUMBLUELEDS];
byte middleSensor[NUMMIDS];
byte frontSensor[NUMFRONTS];
bool emergencyStop;

int currentLeftSpeed;
int currentRightSpeed;

void setup()
{
  //Disables interrups for the initialization
  noInterrupts();

  emergencyStop = false;
  currentLeftSpeed =0;
  currentRightSpeed = 0;

  //Enables USB port for communication with Raspberry
  Serial.begin(9600);

  //Resolution of analogic port: 10 = 1024 (can be configured up to 12 = 4095)
  analogWriteResolution(10);

  //Constants
  blueLeds = { O_LED8, O_LED13 };
  leds= { O_LED4, O_LED5,O_LED6,O_LED7,O_LED9,O_LED10,O_LED11,O_LED12,O_LED14,O_LED15,O_LED16,O_LED17   };
  middleSensor= {  I_IR1, I_IR2, I_IR3, I_IR4, I_IR5, I_IR6, I_IR7, I_IR8, I_IR9   };
  frontSensor = { I_IR10, I_IR11, I_IR12, I_IR13, I_IR14, I_IR15, I_IR16, I_IR17, I_IR18, I_IR19, I_IR20, I_IR21    };

  //Configuration of input pins
  byte listIN []= { SONARPIN, I_BUTTON, I_IR1, I_IR2, I_IR3, I_IR4, I_IR5, I_IR6, I_IR7, I_IR8, I_IR9, I_IR10, I_IR11, I_IR12, I_IR13, I_IR14, I_IR15, I_IR16, I_IR17, I_IR18, I_IR19, I_IR20, I_IR21  };
  for (int i=0;i< 23  ;i++)
  {
    pinMode(listIN[i],INPUT);
    digitalWrite(listIN[i], LOW);
  }

  //Configuration of output pins
  byte listOUT [] = { O_IRON_AN, O_IRON_DG , O_BUZZER,  O_LED4, O_LED5,O_LED6,O_LED7,O_LED8,O_LED9,O_LED10,O_LED11,O_LED12,O_LED13,O_LED14,O_LED15,O_LED16,O_LED17,O_Ain1,O_Ain2,O_Bin1,O_Bin2  };
  for (int i=0;i< 21 ;i++)
  {
    pinMode(listOUT[i],OUTPUT);
    digitalWrite(listOUT[i], LOW);
  }

  //Activates interrups again
  interrupts();
}

void loop()
{
  getAndRunCommandFromUSB();

  checkSonar();
}


void getAndRunCommandFromUSB()
{
  //Receive a message (3 bytes)
  if (Serial.available() >= 3)
  {
    byte cmd = Serial.read();  //Command
    byte p1  = Serial.read();  //First parameter
    byte p2  = Serial.read();  //Second parameter
    
    if (emergencyStop)
    {  
        //Command 50 -> Restore from emergency stop
        if (cmd == 50) restoreFromEmergencyStop();
    }
    else
    {
      switch (cmd)
      {
        //Command 0 -> Stop
        case 0:
          stopMotors();
          break;
    
        //Command 1 -> Move forwards
        case 1:
          moveForward(p1,p2);
          break;
    
        //Command 2 -> Move backwards
        case 2:
          //TODO
          break;
    
        //Command 4 -> Beep
        case 3:
          beep(p1);
          break;
      }
    }
  }
}

void moveForward(byte speed, byte balance)
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

void stopMotors()
{
  setMotors(0,0);
}

void beep(byte status)
{
  if  (status == 1)   digitalWrite(O_BUZZER,HIGH);
  else                digitalWrite(O_BUZZER,LOW);
}

void setMotors(int left, int right)
{
  setForwardSpeedRight(left);
  setForwardSpeedLeft(right);
}

void setForwardSpeedRight(int speed)
{
  //Check if numbers are out of range
  if      (speed < 0)         speed = 0;
  else if (speed > KMAXSPEED) speed = KMAXSPEED;

  currentRightSpeed = speed;

  //Set motor speed
  analogWrite(O_Ain1,speed);
  digitalWrite(O_Ain2,LOW);
}

void setForwardSpeedLeft(int speed)
{
  //Check if numbers are out of range
  if      (speed < 0)         speed = 0;
  else if (speed > KMAXSPEED) speed = KMAXSPEED;
  
  currentLeftSpeed = speed;

  //Set motor speed
  analogWrite(O_Bin1,speed);
  digitalWrite(O_Bin2,LOW);
}

void checkSonar()
{
  //if (!emergencyStop && digitalRead(SONARPIN) == HIGH)
  
  if (digitalRead(SONARPIN) == HIGH)
  {
    stopMotors();
  //  emergencyStop = true;
    digitalWrite(leds[0],HIGH);
    digitalWrite(leds[1],HIGH);
    digitalWrite(leds[2],HIGH);
    
    //Send to Raspberry signal 51 -> Emergency Stop Activated
    Serial.print(5);
  }
}

void restoreFromEmergencyStop()
{
    digitalWrite(leds[0],LOW);
    digitalWrite(leds[1],LOW);
    digitalWrite(leds[2],LOW);       
    emergencyStop = false;
}




