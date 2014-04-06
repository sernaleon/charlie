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
   
   attachInterrupt(13,botonActivado,RISING);

}

void botonActivado() {
  
  if (digitalRead(34) == HIGH || digitalRead(36) == HIGH)
  {      
      if (time_delay == 40)
      {
          for (unsigned char i = 0; i < sizeof(leds); i++) 
          {
            digitalWrite(leds[i],HIGH);
          }
          
        //digitalWrite(pito,HIGH);
        flag = 1;
        time_delay = 100;
      }
      else
      {
        
        digitalWrite(pito,HIGH);
        digitalWrite(30,HIGH);
        digitalWrite(44,HIGH);
        time_delay -= 20;
      }
  }
  else
  {
    time_delay += 20;
    //Enciende los extremos
    digitalWrite(22,HIGH);
    digitalWrite(52,HIGH);
  }
  
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
