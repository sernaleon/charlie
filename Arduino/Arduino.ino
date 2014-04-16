#include <Wire.h>

#include <avr/pgmspace.h>
#include "Types.h"
#include "Motors.c"

byte leds[NUMLEDS];
byte blueLeds[NUMBLUELEDS];
byte middleSensor[NUMMIDS];
byte frontSensor[NUMFRONTS];

unsigned int frontSensorValue [12];

unsigned int sensorValues;
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
  //Wire.begin(ARDUINO_ADDR);
  //Wire.onReceive(receiveSonarEvent);
  
  // Setup Ultrasonic
  pinMode(ULTRASONIC_TRIG, OUTPUT);
  pinMode(ULTRASONIC_ECHO, INPUT);

  //Activates interrups again
  interrupts();
}

void loop()
{
  getAndRunCommandFromUSB();
  //checkSonar();
}

void WriteValues(){
  
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
  
      //Command 2 -> Move backwards
      case 2:
        moveBackward(p1,p2);
        break;
  
      //Command 3 -> Beep
      case 3:
        beep(p1);
        break;
  
      //Command 4 -> LED <1..12> <ON|OFF>
      case 4:
        led(p1,p2);
        break;
        
     //Command 5 -> Set left motor at <SPPED>
      case 5:
        setLeftSpeed(p1);
        break;
     
      //Command 6 -> Set right motor at <SPPED>
      case 6:
        setRightSpeed(p1);
        break;
        
      //Command 7 -> Move forward
      case 7:
        moveForward(p1);
        break;
        
      //Command 9 -> Read ultrasonic
     case 9:
        readSonar();
        break;
        
      //Command 10 -> Send all CNY70 values
      case 10:
        sendSensorValues();
        break;
    }
  }
}



void led(byte num,bool state)
{
  digitalWrite(leds[num],state);
}




void beep(byte status)
{
  if  (status == 1)   digitalWrite(O_BUZZER,HIGH);
  else                digitalWrite(O_BUZZER,LOW);
}





/********************** LECTURA CNY70***********************/
void sendSensorValues()
{
    read_front();
    read_middle();
    
//    for(int i = 0; i < 12; i++)
//    {
//      Serial.print(frontSensorValue[i]);
//      Serial.print('.');
//    }
//    Serial.print(sensorValues);

    for (int i = 0; i< 9; i++)
    {
      Serial.print(middleSensorAux[i]);// ? "1" : "0");
    }    
    for(int i = 0; i < 12; i++)
    {
      Serial.print(frontSensorBool[i]);// ? "1" : "0");
    }
    Serial.println();
}


void read_middle(){
	sensorValues = 0;
	
        digitalWrite(O_IRON_DG,HIGH);
	delay(10);
	
	for ( int i = 0 ;  i < 9; i++)
	{
              middleSensorAux[i] = !digitalRead(middleSensor[i]);
              
              if (middleSensorAux[i])  sensorValues &= ~( 1 << i );
              else                     sensorValues |=  ( 1 << i );
              
//		 if (digitalRead(middleSensor[i]) == HIGH)
//		 {
//			middleSensorAux[i] = false;
//			sensorValues &= ~( 1 << i );
//		 }
//		 else
//		 {
//			middleSensorAux[i] = true;
//			sensorValues |= ( 1 << i );
//		 }
	}
	
        digitalWrite(O_IRON_DG,LOW);
}


void read_front()
{
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
	while (cTiempo < FRONTAL_TIMEOUT && cSensores < 12)
	{
		for (int i = 0; i < 12; i++)
		{
			if (digitalRead(frontSensor[i]) == LOW && !sensorLeido[i])
			{
				sensorAux[i] = cTiempo;
				frontSensorValue[i] = cTiempo;	
      		                
				frontSensorBool[i] = cTiempo >= CNY70DIVIDER;	

                                if (frontSensorBool[i])  sensorValues &= ~( 1 << i+9 );
                                else                     sensorValues |=  ( 1 << i+9 );
                                
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
			frontSensorValue[i] = 0; //FRONTAL_TIMEOUT;
                        frontSensorBool[i] = 0;
		}
	}
		
	//Desactivo fila
	digitalWrite(O_IRON_AN,LOW);
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



/*************************** SR04 ************************************/


void readSonar()
{
  /* The following trigPin/echoPin cycle is used to determine the
 distance of the nearest object by bouncing soundwaves off of it. */ 
 digitalWrite(ULTRASONIC_TRIG, LOW); 
 delayMicroseconds(2); 

 digitalWrite(ULTRASONIC_TRIG, HIGH);
 delayMicroseconds(10); 
 
 digitalWrite(ULTRASONIC_TRIG, LOW);
 int duration = pulseIn(ULTRASONIC_ECHO, HIGH,ULTRASONIC_TIMEOUT);
 
 //Calculate the distance (in cm) based on the speed of sound.
 int distance = duration/58.2;
 
 Serial.println(distance);
}
