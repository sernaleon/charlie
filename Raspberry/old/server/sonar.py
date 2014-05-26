#!/usr/bin/python
import time
from math import sqrt
import RPi.GPIO as GPIO

ECHOPIN = 27
TRIGPIN = 22
SONARTIMEOUT = 500

def mean(elem):

	size = len(elem)
	
	sum = 0.0
	for x in elem:
		sum+=x
	return  sum / size

def truncMean(elem):
	elem.sort()
	numDel = len(elem) * 0.2;
	while numDel > 0:
		elem.pop(0)
		elem.pop()
		numDel -=1
	return mean(elem)

def readMulti(numreads):
	res = []
	aux = 0
	i = numreads
	while i > 0:	
		aux	= readSonar()
		if aux >= 0:		
			print aux
			res.append(aux)
			i -= 1
		else:
			print "ERROR", aux
		time.sleep(0.04)
	
	return truncMean(res)	
		
	
def initSonar():
	GPIO.setwarnings(False)
	GPIO.setmode(GPIO.BCM)
	GPIO.setup(TRIGPIN,GPIO.OUT)
	GPIO.setup(ECHOPIN,GPIO.IN)
	GPIO.output(TRIGPIN, GPIO.LOW)
	readSonar() #FIRST READ IS UNSTABLE
	time.sleep(0.1)
	
def readSonar():

	GPIO.output(TRIGPIN, True)
	time.sleep(0.00001)
	GPIO.output(TRIGPIN, False)

	maxTime = SONARTIMEOUT
	while GPIO.input(ECHOPIN) == 0 and maxTime > 0:
		maxTime -= 1	
	signaloff = time.time()
	if maxTime == 0:
		return -1

	maxTime = SONARTIMEOUT
	while GPIO.input(ECHOPIN) == 1 and maxTime > 0:
		maxTime -= 1	
	signalon = time.time()	
	if maxTime == 0:
		return -2	

	return (signalon - signaloff) * 17953.27521508037
		
def onClose():	
	GPIO.cleanup()

initSonar()

r1 = "%.1f" % readSonar()
res = readMulti(10)
r2 = "%.1f" % res
print r1, res,r2
