
#define pinAnal 0

int value = 666;

void setup()
{
  pinMode(pinAnal,OUTPUT);
}


void loop()
{
  /*
    if (value >= 1024) value = 0;
    else value += 10;
    */
    analogWrite(pinAnal,value); 
    

    
}
