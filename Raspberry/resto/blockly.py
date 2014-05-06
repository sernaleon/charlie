#!/usr/bin/python
import time
import RPi.GPIO as GPIO

ECHOPIN = 27
TRIGPIN = 17
SONARTIMEOUT = 500

def readSonar():
	time.sleep(0.01)

	GPIO.output(TRIGPIN, True)
	time.sleep(0.00001)
	GPIO.output(TRIGPIN, False)

	maxTime = SONARTIMEOUT
	while GPIO.input(ECHOPIN) == 0 and maxTime > 0:
		maxTime -= 1
	signaloff = time.time()

	maxTime = maxTime = SONARTIMEOUT
	while GPIO.input(ECHOPIN) == 1 and maxTime > 0:
		maxTime -= 1	
	signalon = time.time()		

	timepassed = signalon - signaloff
	#distance = timepassed * 17000
	
	return timepassed
	

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(TRIGPIN,GPIO.OUT)
GPIO.setup(ECHOPIN,GPIO.IN)
GPIO.output(TRIGPIN, GPIO.LOW)

i = 0
while i < 10:	
	print readSonar()
	print readSonar()
	print readSonar()
	time.sleep(2)
	i += 1

GPIO.cleanup()