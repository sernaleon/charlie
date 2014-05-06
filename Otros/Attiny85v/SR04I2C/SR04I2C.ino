//             +-\/-+
// Ain0 RST 5 -|o   |- Vcc
// Ain3     3 -|    |- 2 Ain1
// Ain2     4 -|    |- 1 pwm1
//        GND -|    |- 0 pwm0
//             +----+

/* SETUP:
 * ATtiny Pin 1 = (RESET) N/U        ATtiny Pin 8 = VCC (2.7-5.5V) ~= 3.3V              
 * ATtiny Pin 2 = (D3) TRIG          ATtiny Pin 7 = I2C SCK on DS1621  & GPIO 
 * ATtiny Pin 3 = (D4) ECHO          ATtiny Pin 6 = (D1) to ALARMPIN                 
 * ATtiny Pin 4 = GND                ATtiny Pin 5 = I2C SDA on DS1621  & GPIO        
 *        
 * NOTE! - It's very important to use pullups on the SDA & SCL lines!
 * Current Rx & Tx buffers set at 32 bytes - see usiTwiSlave.h
 * Credit and thanks to Don Blake for his usiTwiSlave code. 
 * More on TinyWireS usage - see TinyWireS.h
 */
#include "TinyWireS.h"

#define trigPin          3
#define echoPin          4
#define alarmPin         1

#define I2C_SLAVE_ADDR   0x26

int duration;
int jumpValue;
int timeOut;

void setup() {
  
  TinyWireS.begin(I2C_SLAVE_ADDR);
  
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(alarmPin, OUTPUT);
  
  digitalWrite(alarmPin, LOW);
       
  jumpValue = 750;
  timeOut = 1000000;
}

void loop() {
  /*
  duration = ReadSonar();
  if (duration > 0 && duration < jumpValue)  digitalWrite(alarmPin, HIGH);
  sendI2C(duration);
  if (TinyWireS.available()) receiveI2C();     
  */
  Funk();
}

byte ReadSonar(){
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  return pulseIn(echoPin, HIGH,timeOut);
}


void sendI2C(int toTransfer){
  //if (toTransfer > 10000) toTransfer = 10000;
  //TinyWireS.send(map(toTransfer,0,10000,0,255));
  
  TinyWireS.send( toTransfer & 0x00FF);
  TinyWireS.send((toTransfer & 0xFF00) >> 8);
}

/* 
Possible values to receive:
0x00 (1 BYTE )-> alarmPin = LOW
0x01 (3 BYTES)-> jumpValue = X
0x02 (3 BYTES)-> timeOut = X
*/
void receiveI2C(){
  byte cmd = TinyWireS.receive(); 
  if (cmd == 0){
    digitalWrite(alarmPin, LOW);
  }
  else  {
    int value = TinyWireS.receive();
    int rec = TinyWireS.receive();
    value = (rec << 8) | value;
    switch (cmd) {
      case 1:
        jumpValue = value;
        break;
      case 2:
        timeOut = value;
        break;
    }
  }
}




int time1 = millis();
int interval = 100;
void Funk(){
  if (( millis()-time1 )>interval)
  {
    byte bbb4 = 0xFF;
    TinyWireS.send(bbb4);
    time1=millis();
    digitalWrite(alarmPin,!digitalRead(alarmPin));
  }
}
