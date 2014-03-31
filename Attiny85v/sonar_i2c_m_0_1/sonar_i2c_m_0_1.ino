#include <TinyWireM.h>

#define ARDUINO_ADDR 4

#define trigPin 3
#define echoPin 4

#define timeOut 10000

/** ATtiny Pinou
1 = (RESET) N/U    8 = VCC (2.7-5.5V)                  
2 = (D3) LED3      7 = SCK on DS1621
3 = (D4) to LED1   6 = (D1) to LED2                    
4 = GND            5 = SDA on DS1621
 */

//             +-\/-+
// Ain0 RST 5 -|o   |- Vcc
// Ain3     3 -|    |- 2 Ain1
// Ain2     4 -|    |- 1 pwm1
//        GND -|    |- 0 pwm0
//             +----+



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
