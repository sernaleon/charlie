#include <Wire.h>
#include "Types.h"

byte leds[NUMLEDS];
byte blueLeds[NUMBLUELEDS];
byte middleSensor[NUMMIDS];
byte frontSensor[NUMFRONTS];

unsigned int frontSensorValue [12];

unsigned int middleSensorValue;
unsigned int sensorAux [12];

bool middleSensorAux [9];
bool frontSensorBool [12];
bool sensorLeido [12];
unsigned int calibrateMin[12];
unsigned int calibrateMax[12];


int sonarValue;

void setup()
{
  //Disables interrups for the initialization
  noInterrupts();

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
  
  //Sonar init
  sonarValue = 0;
  Wire.begin(ARDUINO_ADDR);
  Wire.onReceive(receiveSonarEvent);

  //Activates interrups again
  interrupts();
}

void loop()
{
  getAndRunCommandFromUSB();

  //Serial.println("hola1");


  //checkSonar();
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
        
      //Command 10 -> Send all CNY70 values
      case 10:
        sendSensorValues();
        break;
    }
  }
}

void sendSensorValues()
{
    read_line();
    read_middle();
    
    for(int i = 0; i < 12; i++)
    {
      Serial.print(sensorAux[i]);
      Serial.print('.');
    }
    Serial.print(middleSensorValue);
    Serial.println();
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

void checkSonar()
{
  //if (!emergencyStop && digitalRead(SONARPIN) == HIGH)
  
  if (digitalRead(SONARPIN) == HIGH)
  {
    stopMotors();
    
    //Send to Raspberry signal 5 -> Emergency Stop Activated
    Serial.print(5);
    
    digitalWrite(leds[0],HIGH);
    digitalWrite(leds[1],HIGH);
    digitalWrite(leds[2],HIGH);
    
    delay(3000);
    
    digitalWrite(leds[0],LOW);
    digitalWrite(leds[1],LOW);
    digitalWrite(leds[2],LOW);
    
    emptySerialBuffer();
    
  }
}

//Empty buffer by reading 3 bytes
void emptySerialBuffer()
{
  while(Serial.available() >= 3)
  {
    Serial.read();
    Serial.read();
    Serial.read();
  }
}

void receiveSonarEvent(int howMany) {
  if (howMany == 2) {
    sonarValue = word(Wire.read(), Wire.read());
  }
}



/********************** LECTURA CNY70***********************/


void read_middle(){
	middleSensorValue = 0;
	
	//TurnOnIRMiddle();	
        digitalWrite(O_IRON_DG,HIGH);
        
	delay(1); //REDUCIR!!!
	
	for ( int i = 0 ;  i < 9; i++)
	{
		 if (digitalRead(middleSensor[i]) == HIGH)
		 {
			middleSensorAux[i] = false;
			middleSensorValue &= ~( 1 << i );
		 }
		 else
		 {
			middleSensorAux[i] = true;
			middleSensorValue |= ( 1 << i );
		 }
	}
	
	//TurnOffIRMiddle();	
        digitalWrite(O_IRON_DG,LOW);



	//REURN middleSensorValue;
}

void read_line(){

	//Descargo	
	for (int i = 0; i < 12; i++)
	{
		pinMode(frontSensor[i], OUTPUT);
		digitalWrite(frontSensor[i],HIGH);
	}
	
	delayMicroseconds(15);	
	
	//Cargo
	for (int i = 0; i < 12; i++)
	{
		pinMode(frontSensor[i], INPUT);	
		digitalWrite(frontSensor[i],LOW);
	}
	
	//Enciendo fila
	digitalWrite(O_IRON_AN,HIGH);
	
	delayMicroseconds(5);
	
	//Cuento 
	unsigned int cTiempo = 0;
	unsigned int cSensores = 0;
	while (cTiempo < 2000 && cSensores < 12)
	{
		for (int i = 0; i < 12; i++)
		{
			if (digitalRead(frontSensor[i]) == LOW && !sensorLeido[i])
			{
				sensorAux[i] = cTiempo;
				frontSensorValue[i] = map(cTiempo,calibrateMin[i],calibrateMax[i],0,100);				
				if (frontSensorValue[i] < 10) frontSensorValue[i] = 0;
				frontSensorBool[i] = frontSensorValue[i] > 0;
				sensorLeido[i] = true;
				cSensores++;
			}
		}
		cTiempo++;			
		delayMicroseconds(1);
	}	
	
	//Pongo los sensores a false (y relleno posibles valores time_out)
	for (int i = 0; i < 12; i++)
	{
		if (sensorLeido[i])
		{
			sensorLeido[i] = false;
		}
		else
		{
			sensorAux[i] = 2000;
			frontSensorValue[i] = 100; //map(2000,calibrateMin[i],calibrateMax[i],0,100);		
			frontSensorBool[i] = true;
		}
	}
		
	//Desactivo fila
	digitalWrite(O_IRON_AN,LOW);
}




