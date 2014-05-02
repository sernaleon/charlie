#include "Arduino.h"
#include "Types.h"


void stopMotors()
{
  //setMotors(0,0);
  analogWrite(O_Bin1,1023); 
  digitalWrite(O_Bin2,HIGH);
  analogWrite(O_Ain1,1023); 
  digitalWrite(O_Ain2,HIGH);
}

void setForwardSpeedRight(int speed)
{
  //Check if numbers are out of range
  if      (speed < 0)         speed = 0;
  else if (speed > KMAXSPEED) speed = KMAXSPEED;

  //Set motor speed
  analogWrite(O_Ain1,speed);
  digitalWrite(O_Ain2,LOW);
}

void setForwardSpeedLeft(int speed)
{
  //Check if numbers are out of range
  if      (speed < 0)         speed = 0;
  else if (speed > KMAXSPEED) speed = KMAXSPEED;

  //Set motor speed
  analogWrite(O_Bin1,speed);
  digitalWrite(O_Bin2,LOW);
}


void setMotors(int left, int right)
{
  setForwardSpeedRight(left);
  setForwardSpeedLeft(right);
}


void turnLeft(byte speed)
{
    int speedMapped = map(speed,0,255,0,KSPEED);
	setForwardSpeedRight(0);
    setForwardSpeedLeft(speedMapped);
}

void turnRight(byte speed)
{
    int speedMapped = map(speed,0,255,0,KSPEED);
    setForwardSpeedRight(speedMapped);
    setForwardSpeedLeft(0);
}

void moveBalanced(byte speed, byte balance)
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


void moveForward(byte speed)
{
  //Sets speed between 0 and KMAXSPEED
  int speedMapped = map(speed,0,255,0,KSPEED);

  setMotors(speedMapped,speedMapped);
}


/************************************** BACKWARD *********************************/



void setBackwardSpeedLeft(int speed)
{
  //Check if numbers are out of range
  if      (speed < 0)         speed = 0;
  else if (speed > KMAXSPEED) speed = KMAXSPEED;

  //Set motor speed
  analogWrite(O_Bin1,RESOLUTION-speed);
  digitalWrite(O_Bin2,HIGH);
}

void setBackwardSpeedRight(int speed)
{
  //Check if numbers are out of range
  if      (speed < 0)         speed = 0;
  else if (speed > KMAXSPEED) speed = KMAXSPEED;

  //Set motor speed
  analogWrite(O_Ain1,RESOLUTION-speed);
  digitalWrite(O_Ain2,HIGH);
}

void moveBackward(byte speed, byte balance)
{
  //Sets speed between 0 and KMAXSPEED
  int speedMapped = map(speed,0,255,0,KSPEED);

  //Sets balance between -KTURNSPEED and KTURNSPEED
  int balanceMapped = map(balance,0,255,-KTURNSPEED,KTURNSPEED);

  //Sets speed of left and right motors
  int left = speedMapped - balanceMapped;
  int right = speedMapped + balanceMapped;

  setBackwardSpeedLeft(left);
  setBackwardSpeedRight(right);
}


