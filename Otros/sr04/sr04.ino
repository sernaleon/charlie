//             +-\/-+
// Ain0 RST 5 -|o   |- Vcc
// Ain3     3 -|    |- 2 Ain1
// Ain2     4 -|    |- 1 pwm1
//        GND -|    |- 0 pwm0
//             +----+



#define trigPin 3
#define echoPin 4
#define alarmPin 0

#define jumpValue 750


int duration;

void setup() {
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
    
  pinMode(alarmPin, OUTPUT);
}

void loop() {
//  digitalWrite(trigPin, LOW); 
//  delayMicroseconds(2); 
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  duration = pulseIn(echoPin, HIGH);

  if   (duration > 0 && duration < jumpValue)  digitalWrite(alarmPin, HIGH);
  else                                         digitalWrite(alarmPin, LOW);

  //delay(50);
}
