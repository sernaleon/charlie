#include <Wire.h>

int x;

void setup() {
  
  Serial.begin(9600);
  
  Wire.begin(9);                // Start I2C Bus as a Slave (Device Number 9)
  Wire.onReceive(receiveEvent); // register event
  
  x = 0;
}

void loop() {
  //Serial.println(x);
}

void receiveEvent(int howMany) {
  x = Wire.read();    // receive byte as an integer
  
  Serial.println(x);
}
