#!/usr/bin/python
import  time


from RPIO import PWM

servo = PWM.Servo()

#Range 400-2500
#servo.set_servo(17,500)
#time.sleep(5)

for i in range(2500,401,-100):
    servo.set_servo(17,i)
    time.sleep(1)

for i in range(400,2501,100):
    servo.set_servo(17,i)
    time.sleep(1)

# Clear servo on GPIO17
servo.stop_servo(17)

