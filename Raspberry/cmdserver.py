#!/usr/bin/python
import  time,sys, struct, serial, signal, ssl, logging
import RPi.GPIO as GPIO
from math import sqrt
from SimpleWebSocketServer import WebSocket, SimpleWebSocketServer, SimpleSSLWebSocketServer
from optparse import OptionParser
from RPIO import PWM

logging.basicConfig(format='%(asctime)s %(message)s', level=logging.DEBUG)

ArduinoConnected = True
PrintDebugMessages = True

SERVER_IP = ''
WS_PORT = 8000

LEDPIN = 4
SERVOPIN = 17
ECHOPIN = 27
TRIGPIN = 22
SONARTIMEOUT = 500


servo = PWM.Servo()

if (ArduinoConnected):
	DUE_PORT =  '/dev/ttyACM0' # 'COM7' #
	DUE_BAUDS = 9600
	serialPortArduinoCom = serial.Serial(DUE_PORT,DUE_BAUDS) 
	
		
def initSonar():
	GPIO.setwarnings(False)
	GPIO.setmode(GPIO.BCM)	
	GPIO.setup(LEDPIN,GPIO.OUT)	
	GPIO.setup(TRIGPIN,GPIO.OUT)
	GPIO.setup(ECHOPIN,GPIO.IN)
	GPIO.output(LEDPIN, GPIO.HIGH)
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

	distance = (signalon - signaloff) * 17953.27521508037
	
	if (PrintDebugMessages):
		print "SONAR:",distance
		
	return distance
	
def moveServo(pos):
	servo.set_servo(SERVOPIN,pos)
		
def destructSonar():	
	GPIO.output(LEDPIN, GPIO.LOW)
	GPIO.cleanup()			

def sendToAndroid(msg):
	cls.sendBack(msg)

def firstBlackLeft(sonar):
	res = sonar.find("1");
	
	if (PrintDebugMessages):
		print res
		
	return res
	
def sendToArduino(cmd,p1,p2):
	msg = bytearray(3)
	msg[0] = struct.pack('B', int(cmd))
	msg[1] = struct.pack('B', int(p1))
	msg[2] = struct.pack('B', int(p2))
	
	if (ArduinoConnected):
		serialPortArduinoCom.write(msg)
	
	if (PrintDebugMessages):
		print "   Send:", msg[0], msg[1], msg[2]

def receiveFromArduino(cmd,p1,p2):
	sendToArduino(cmd,p1,p2)
	if (ArduinoConnected):
		recMsg = serialPortArduinoCom.readline()
	else:
		recMsg = "FAKEMSG"
	
	if (PrintDebugMessages):
		print "Receive:",recMsg
		
	
	return recMsg.strip()
	
def takePic():
	if (PrintDebugMessages):
		print "PICTURE TAKEN!"

	
def executeScript(receivedCommand):
	if (PrintDebugMessages):
		print receivedCommand
	initSonar()
	exec(receivedCommand)
	destructSonar()
	

def map(x, in_min, in_max, out_min, out_max):
	res = (int(x) - int(in_min)) * (int(out_max) - int(out_min)) / (int(in_max) - int(in_min)) + int(out_min)
		
	if (PrintDebugMessages):
		print "MAP:",res
	
	return int(res)

	
class WebServer(WebSocket):
	def handleMessage(self):
		if self.data is None:
			self.data = ''                            
		
		try:
			msg = str(self.data)
			
			if len(msg) == 3:
				cmd = struct.unpack('B', msg[0])[0]
				p1 = struct.unpack('B', msg[1])[0]
				p2 = struct.unpack('B', msg[2])[0]
				print cmd, p1,p2	

				if (ArduinoConnected):
					serialPortArduinoCom.write(msg)
			elif len(msg) == 2:
				p1 = struct.unpack('B', msg[1])[0] * 10
				
				if (PrintDebugMessages):
					print p1
				moveServo(p1)
			else:
				executeScript(msg)
				self.sendClose()
		except Exception as n:
			print "Err: ", 
			print "Err: ", n
			
	def sendBack(self,data):
		self.sendMessage(str(data))
			
	def handleConnected(self):
		print self.address, 'connected'

	def handleClose(self):
		time.sleep(2)
		servo.stop_servo(SERVOPIN)
		print self.address, 'closed'

		
		
if __name__ == "__main__":

	parser = OptionParser(usage="usage: %prog [options]", version="%prog 1.0")
	parser.add_option("--host", default=SERVER_IP, type='string', action="store", dest="host", help="hostname (localhost)")
	parser.add_option("--port", default=WS_PORT, type='int', action="store", dest="port", help="port (8000)")
	parser.add_option("--example", default='echo', type='string', action="store", dest="example", help="echo, chat")
	parser.add_option("--ssl", default=0, type='int', action="store", dest="ssl", help="ssl (1: on, 0: off (default))")
	parser.add_option("--cert", default='./cert.pem', type='string', action="store", dest="cert", help="cert (./cert.pem)")
	parser.add_option("--ver", default=ssl.PROTOCOL_TLSv1, type=int, action="store", dest="ver", help="ssl version")
	
	(options, args) = parser.parse_args()

	cls = WebServer
	
	if options.ssl == 1:
		server = SimpleSSLWebSocketServer(options.host, options.port, cls, options.cert, options.cert, version=options.ver)
	else:	
		server = SimpleWebSocketServer(options.host, options.port, cls)

	def close_sig_handler(signal, frame):
		server.close()
		sys.exit()
	
	signal.signal(signal.SIGINT, close_sig_handler)
	server.serveforever()
	
