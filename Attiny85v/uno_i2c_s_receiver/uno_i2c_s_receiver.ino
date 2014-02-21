#include <Wire.h>

#define ARDUINO_ADDR 4

void setup(){
  Wire.begin(ARDUINO_ADDR);
  Wire.onReceive(receiveSonarEvent);
  Serial.begin(9600);
}

void loop(){
  delay(100);
}

void receiveSonarEvent(int howMany) {
  if (howMany == 2) {
    int received = word(Wire.read(), Wire.read());
    Serial.print("!");
    Serial.println(received); 
  }
  else {
    Serial.print("WTF?!");
  }
}
