//Based in http://arduino.cc/en/Tutorial/MasterReader

#include <Wire.h>


int receivedValue;

void setup()
{
  Wire.begin();
  Serial.begin(9600);
  
  receivedValue = -1;
}

void loop()
{
  if (Wire.available()) ReceiveI2C();
  
  Funk();
}

void ReceiveI2C(){
  int low = Wire.read();
  int high = Wire.read();
  receivedValue = (high << 8 ) | low;
  Serial.println(receivedValue);
}

int time1 = millis();
int interval = 1000;
void Funk(){
  if (( millis()-time1 )>interval)
  {
    Serial.println("ccoco");
    time1=millis();
  }
}
