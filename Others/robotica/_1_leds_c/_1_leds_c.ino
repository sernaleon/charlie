  unsigned char time_delay = 100;
  unsigned char leds[]  = {22,24,26,28,32,34,36,42,46,48,50,52};
  unsigned char azules[]  = {30,44};

void setup() {
  
    for (unsigned char i = 0; i < sizeof(leds); i++) 
  {
    pinMode(leds[i],OUTPUT);
  }

}

void loop() {
  
  unsigned char tamLeds = sizeof(leds);
  
  for (unsigned char i = 0, j = tamLeds-1; i < tamLeds; i++, j--) 
  {
    digitalWrite(leds[i],HIGH);
    digitalWrite(leds[j],HIGH);
    delay(time_delay);
    digitalWrite(leds[i],LOW);
    digitalWrite(leds[j],LOW);
  } 
  
}
