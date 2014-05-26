  unsigned char time_delay = 100;
  unsigned char leds[]  = {22,24,26,28,32,34,36,42,46,48,50,52};
  unsigned char azules[]  = {30,44};
  unsigned char pito = 23;
  unsigned char flag = 0;

void setup() {
  
  for (unsigned char i = 0; i < sizeof(leds); i++) 
  {
    pinMode(leds[i],OUTPUT);
  }
  
   pinMode(pito,OUTPUT);
   pinMode(30,OUTPUT);
   pinMode(44,OUTPUT);
}


void loop() {
  
  unsigned char tamLeds = sizeof(leds);  
  digitalWrite(pito,LOW);
  digitalWrite(22,LOW);
  digitalWrite(52,LOW);
  
  for (unsigned char i = 0, j = tamLeds-1; i < tamLeds; i++, j--) 
  {
    digitalWrite(leds[i],HIGH);
    digitalWrite(leds[j],HIGH);
    delay(time_delay);
    digitalWrite(leds[i],LOW);
    digitalWrite(leds[j],LOW);
  } 
  
  
  
  if (flag == 1 )
  {
    digitalWrite(pito,HIGH);
    delay(100);  
    digitalWrite(pito,LOW); 
    
    delay(50);  
    digitalWrite(pito,HIGH);
    delay(100);  
    digitalWrite(pito,LOW);
    
    delay(50);  
    digitalWrite(pito,HIGH);
    delay(50);  
    digitalWrite(pito,LOW); 
    
    delay(50);  
    digitalWrite(pito,HIGH);
    delay(50);  
    digitalWrite(pito,LOW);
    
    delay(50);  
    digitalWrite(pito,HIGH);
    delay(100);  
    digitalWrite(pito,LOW);
    
    flag = 0;
  }
}
