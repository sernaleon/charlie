#include <TinyWireM.h>                  // I2C Master lib for ATTinys which use USI

void setup(){
  TinyWireM.begin();   
}


void loop(){ 
  TinyWireM.beginTransmission(9);
  TinyWireM.write(66);                 
  TinyWireM.endTransmission();    
  delay(750);  
}
