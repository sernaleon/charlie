
#define analogIn A0

void setup()
{
  Serial.begin(9600);
  pinMode(analogIn,INPUT);
}

void loop()
{
  Serial.println(analogRead(analogIn));
}
