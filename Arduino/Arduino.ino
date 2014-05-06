#include "Types.h"

bool middleSensorValue [NUMMIDS];
unsigned int frontSensorValue [NUMFRONTS];
bool frontSensorBool [NUMFRONTS];
bool isSensorRead [NUMFRONTS];

void setup()
{
	//Disables interrupts for the initialization
	noInterrupts();

	//Enables USB port for communication with Raspberry
	Serial.begin(9600);

	//Resolution of analogical port: 10 = 1024 (can be configured up to 12 = 4095)
	analogWriteResolution(10);
	
	//Configuration of input pins
	for (int i=0;i< NUMINPUTS  ;i++) 
	{
		pinMode(INPUTS[i],INPUT);
		digitalWrite(INPUTS[i], LOW);
	}
	
	//Configuration of output pins
	for (int i=0;i< NUMOUTPUTS ;i++)
	{
		pinMode(OUTPUTS[i],OUTPUT);
		digitalWrite(OUTPUTS[i], LOW);
	}
	
	//Activates interrupts again
	interrupts();
}

void loop()
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
			stopMotors();
			break;
			
			//Command 1 -> Move forwards with speed and balance
			case 1:
			moveBalanced(p1,p2);
			break;
			
			//Set left motor to <SPEED>
			case 2:
			setLeftSpeed(p1);
			break;
			
			//Set right motor to <SPEED>
			case 3:
			setRightSpeed(p1);
			break;
			
			//Move forward to <SPEED>
			case 4:
			moveForward(p1);
			break;
			
			//Set left motor to <SPEED> and right motor to 0
			case 5:
			turnLeft(p1);
			break;
			
			//Set right motor to <SPEED> and left motor to 0
			case 6:
			turnRight(p1);
			break;
			
			//Move backwards with speed and balance
			case 7:
			moveBackward(p1,p2);
			break;
			
			//Set both motors to back speed
			case 8:
			moveBackBoth(p1);
			break;
			
			//Set left motor to back speed
			case 9:
			moveBackLeft(p1);
			break;
			
			//Set right motor to back speed
			case 10:
			moveBackRight(p1);
			break;
			
			//Beep
			case 11:
			beep(p1);
			break;
			
			//LED <0..13> <ON|OFF>
			case 12:
			led(p1,p2);
			break;
			
			//Send all CNY70 values. First front and then middle
			case 13:
			sendFrontAndMiddle();
			break;
			
			//Send front sensor values
			case 14:
			sendFront();
			break;
			
			//Send middle sensor values
			case 15:
			sendMiddle();
			break;
			
			//Send analog values of front sensor
			case 16:
			sendAnalogFront();
		}
	}
}

void led(byte num,bool state)
{
	if		(num < 0)			num = 0;
	else if (num >= NUMLEDS)	num = NUMLEDS-1;
	
	digitalWrite(LEDS[num],state);
}


void beep(bool status)
{
	digitalWrite(O_BUZZER,status);
}


/********************** GROUND SENSORS ***********************/

void sendFrontAndMiddle()
{
	read_front();
	readMiddle();

	for(int i = 0; i < 12; i++)
	{
		Serial.print(frontSensorBool[i]);
	}
	
	for (int i = 0; i< 9; i++)
	{
		Serial.print(middleSensorValue[i]);
	}
	Serial.println();
}

void sendFront()
{	
	read_front();

	for(int i = 0; i < 12; i++)
	{
		Serial.print(frontSensorBool[i]);
	}
	Serial.println();
	
}

void sendMiddle()
{
	readMiddle();
	
	for (int i = 0; i< 9; i++)
	{
		Serial.print(middleSensorValue[i]);
	}
	Serial.println();
	
}

void sendAnalogFront()
{
	read_front();
	
	for(int i = 0; i < 11; i++)
	{
		Serial.print(frontSensorValue[i]);
		Serial.print(",");
	}
	Serial.println(frontSensorValue[11]);
}

void readMiddle()
{
	digitalWrite(O_IRON_DG,HIGH);
	delay(10);	
	for ( int i = 0 ;  i < 9; i++)
	{
		middleSensorValue[i] = !digitalRead(MIDDLESENSORS[i]);
	}
	digitalWrite(O_IRON_DG,LOW);
}


void read_front()
{
	//Unload capacitors
	for (int i = 0; i < 12; i++)
	{
		pinMode(FRONTSENSORS[i], OUTPUT);
		digitalWrite(FRONTSENSORS[i],HIGH);
	}
	delayMicroseconds(15);
	
	//Load capacitors
	for (int i = 0; i < 12; i++)
	{
		pinMode(FRONTSENSORS[i], INPUT);
		digitalWrite(FRONTSENSORS[i],LOW);
	}
	
	//Switch on IR matrix
	digitalWrite(O_IRON_AN,HIGH);
	delayMicroseconds(5);
	
	//Read
	int cTiempo = 0;
	int cSensores = 0;
	while (cTiempo < FRONTAL_TIMEOUT && cSensores < 12)
	{
		for (int i = 0; i < 12; i++)
		{
			if (digitalRead(FRONTSENSORS[i]) == LOW && !isSensorRead[i])
			{
				frontSensorValue[i] = cTiempo;
				frontSensorBool[i] = cTiempo >= CNY70DIVIDER;
				
				isSensorRead[i] = true;
				cSensores++;
			}
		}
		cTiempo++;
		delayMicroseconds(1);
	}
	
	//Reset and set timeout values
	for (int i = 0; i < 12; i++)
	{
		if (isSensorRead[i])
		{
			isSensorRead[i] = false;
		}
		else
		{
			frontSensorValue[i] = 0;
			frontSensorBool[i] = 0;
		}
	}
	
	//Switch off IR matrix
	digitalWrite(O_IRON_AN,LOW);
}




/********************** MOTORS ***********************/


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
	int speedMapped = map(speed,0,255,0,KMAXSPEED);
	setForwardSpeedRight(0);
	setForwardSpeedLeft(speedMapped);
}

void turnRight(byte speed)
{
	int speedMapped = map(speed,0,255,0,KMAXSPEED);
	setForwardSpeedRight(speedMapped);
	setForwardSpeedLeft(0);
}

void setLeftSpeed(byte speed)
{
	int speedMapped = map(speed,0,255,0,KMAXSPEED);
	setForwardSpeedLeft(speedMapped);
}

void setRightSpeed(byte speed)
{
	int speedMapped = map(speed,0,255,0,KMAXSPEED);
	setForwardSpeedRight(speedMapped);
}

void moveBalanced(byte speed, byte balance)
{
	//Sets speed between 0 and KMAXSPEED
	int speedMapped = map(speed,0,255,0,KSTRAIGHTSPEED);

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
	int speedMapped = map(speed,0,255,0,KMAXSPEED);

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
	int speedMapped = map(speed,0,255,0,KSTRAIGHTSPEED);

	//Sets balance between -KTURNSPEED and KTURNSPEED
	int balanceMapped = map(balance,0,255,-KTURNSPEED,KTURNSPEED);

	//Sets speed of left and right motors
	int left = speedMapped - balanceMapped;
	int right = speedMapped + balanceMapped;

	setBackwardSpeedLeft(left);
	setBackwardSpeedRight(right);
}

void moveBackBoth(byte speed)
{
	//Sets speed between 0 and KMAXSPEED
	int kspeed = map(speed,0,255,0,KMAXSPEED);
	setBackwardSpeedLeft(kspeed);
	setBackwardSpeedRight(kspeed);
}

void moveBackLeft(byte speed)
{
	//Sets speed between 0 and KMAXSPEED
	setBackwardSpeedLeft(map(speed,0,255,0,KMAXSPEED));
}

void moveBackRight(byte speed)
{
	//Sets speed between 0 and KMAXSPEED
	setBackwardSpeedRight(map(speed,0,255,0,KMAXSPEED));
}