#include <TinyWireM.h>

#define ARDUINO_ADDR 4

#define trigPin 3
#define echoPin 4

#define timeOut 10000

void setup()
{
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  TinyWireM.begin(); 
}

int sonarValue;
void loop()
{  
  sonarValue = readSonar();
  
  if (sonarValue) sendI2C(sonarValue);
  
  delay(5);
}


int readSonar(){
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  return pulseIn(echoPin, HIGH,timeOut);
}

void sendI2C(int toSend){
  TinyWireM.beginTransmission(ARDUINO_ADDR);
  TinyWireM.write(highByte(toSend));
  TinyWireM.write(lowByte(toSend));
  TinyWireM.endTransmission();
}
