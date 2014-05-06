#include "Types.h"
#include "Motors.c"

byte leds[NUMLEDS];
byte middleSensor[NUMMIDS];
byte frontSensor[NUMFRONTS];

bool middleSensorValue [NUMMIDS];

unsigned int frontSensorValue [NUMFRONTS];

bool frontSensorBool [NUMFRONTS];
bool sensorLeido [NUMFRONTS];

void setup()
{
	//Disables interrupts for the initialization
	noInterrupts();

	//Enables USB port for communication with Raspberry
	Serial.begin(9600);

	//Resolution of analogical port: 10 = 1024 (can be configured up to 12 = 4095)
	analogWriteResolution(10);

	//Constants
	leds= { O_LED4, O_LED5,O_LED6,O_LED7,O_LED9,O_LED10,O_LED11,O_LED12,O_LED14,O_LED15,O_LED16,O_LED17 ,O_LED8, O_LED13   };
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
	
	//Activates interrupts again
	interrupts();
}

void loop()
{
	getAndRunCommandFromUSB();
}


void getAndRunCommandFromUSB()
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
			sendSensorValues();
			break;
			
			//Send front sensor values
			case 14:
			sendFront();
			break;
			
			//Send middle sensor values
			case 15:
			sendMiddle();
			break;
			
			case 16:
			sendAnalogFront();
		}
	}
}



void led(byte num,bool state)
{
	if		(num < 0)			num = 0;
	else if (num >= NUMLEDS)	num = NUMLEDS-1;
	
	digitalWrite(leds[num],state);
}


void beep(bool status)
{
	digitalWrite(O_BUZZER,status);
}





/********************** CNY70***********************/
void sendSensorValues()
{
	read_front();
	read_middle();

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
	read_middle();
	
	for (int i = 0; i< 9; i++)
	{
		Serial.print(middleSensorValue[i]);
	}
	Serial.println();
	
}

void read_middle()
{
	digitalWrite(O_IRON_DG,HIGH);
	delay(10);	
	for ( int i = 0 ;  i < 9; i++)
	{
		middleSensorValue[i] = !digitalRead(middleSensor[i]);
	}
	digitalWrite(O_IRON_DG,LOW);
}


void read_front()
{
	//Unload capacitors
	for (int i = 0; i < 12; i++)
	{
		pinMode(frontSensor[i], OUTPUT);
		digitalWrite(frontSensor[i],HIGH);
	}
	delayMicroseconds(15);
	
	//Load capacitors
	for (int i = 0; i < 12; i++)
	{
		pinMode(frontSensor[i], INPUT);
		digitalWrite(frontSensor[i],LOW);
	}
	
	//Switch on IR matrix
	digitalWrite(O_IRON_AN,HIGH);
	delayMicroseconds(5);
	
	//Read
	unsigned int cTiempo = 0;
	unsigned int cSensores = 0;
	while (cTiempo < FRONTAL_TIMEOUT && cSensores < 12)
	{
		for (int i = 0; i < 12; i++)
		{
			if (digitalRead(frontSensor[i]) == LOW && !sensorLeido[i])
			{
				frontSensorValue[i] = cTiempo;
				frontSensorBool[i] = cTiempo >= CNY70DIVIDER;
				
				sensorLeido[i] = true;
				cSensores++;
			}
		}
		cTiempo++;
		delayMicroseconds(1);
	}
	
	//Reset and set timeout values
	for (int i = 0; i < 12; i++)
	{
		if (sensorLeido[i])
		{
			sensorLeido[i] = false;
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