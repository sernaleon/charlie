#!/usr/bin/python
import  time,sys, struct, serial, signal, ssl, logging
import RPi.GPIO as GPIO
from math import sqrt
from SimpleWebSocketServer import WebSocket, SimpleWebSocketServer, SimpleSSLWebSocketServer
from optparse import OptionParser
from RPIO import PWM

logging.basicConfig(format='%(asctime)s %(message)s', level=logging.DEBUG)

SERVER_IP = ''
WS_PORT = 8000

LEDPIN = 4
SERVOPIN = 17
ECHOPIN = 27
TRIGPIN = 22
SONARTIMEOUT = 500

DUE_PORT =  '/dev/ttyACM0' # 'COM7' #
DUE_BAUDS = 9600
	
###########SONAR FUNCTIONS ###########
		
def initScript():
	print "INIT SONAR..."
	GPIO.setwarnings(False)
	GPIO.setmode(GPIO.BCM)	
	GPIO.setup(LEDPIN,GPIO.OUT)	
	GPIO.setup(TRIGPIN,GPIO.OUT)
	GPIO.setup(ECHOPIN,GPIO.IN)
	GPIO.output(LEDPIN, GPIO.HIGH)
	GPIO.output(TRIGPIN, GPIO.LOW)
	readSonar() #FIRST READ IS UNSTABLE
	time.sleep(0.1)
	print "...SONAR DONE"
	
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
	
	print "  SONAR:",distance		
	return distance
		
def destructScript():	
	GPIO.output(LEDPIN, GPIO.LOW)
	GPIO.cleanup()			

def moveServo(pos):
	servo.set_servo(SERVOPIN,pos)	
	print "  SERVO:", pos
		
def sendToArduino(cmd,p1,p2):
	msg = bytearray(3)
	msg[0] = struct.pack('B', int(cmd))
	msg[1] = struct.pack('B', int(p1))
	msg[2] = struct.pack('B', int(p2))
	serialArduino.write(msg)
	print "   SEND:", msg[0], msg[1], msg[2]

def receiveFromArduino(cmd,p1,p2):
	sendToArduino(cmd,p1,p2)
	recMsg = serialArduino.readline().strip()
	print "RECEIVE:",recMsg		
	return recMsg

	
def map(x, in_min, in_max, out_min, out_max):
	try:
		res = (float(x) - float(in_min)) * (float(out_max) - float(out_min)) / (float(in_max) - float(in_min)) + float(out_min)		
		return res
	except Exception as n:
			print "  ERROR:", n
			return 0
	
def executeScript(receivedCommand):
	print "SCRIPT RECEIVED:\n",receivedCommand
	initScript()
	print "STARTING BLOCKLY SCRIPT..."
	exec(receivedCommand)
	print "...BLOCKLY SCRIPT DONE"
	destructScript()
	
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

				serialArduino.write(msg)
			elif len(msg) == 2:
				p1 = struct.unpack('B', msg[1])[0] * 10
				moveServo(p1)
			else:
				executeScript(msg)
				self.sendClose()
		except Exception as n:
			print "  ERROR:", n
		
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
	parser.add_option("--ssl", default=0, type='int', action="store", dest="ssl", help="ssl (1: on, 0: off (default))")
	parser.add_option("--cert", default='./cert.pem', type='string', action="store", dest="cert", help="cert (./cert.pem)")
	parser.add_option("--ver", default=ssl.PROTOCOL_TLSv1, type=int, action="store", dest="ver", help="ssl version")
	(options, args) = parser.parse_args()

	if options.ssl == 1:
		server = SimpleSSLWebSocketServer(options.host, options.port, WebServer, options.cert, options.cert, version=options.ver)
	else:	
		server = SimpleWebSocketServer(options.host, options.port, WebServer)
	
	def close_sig_handler(signal, frame):
		server.close()
		sys.exit()
	
	servo = PWM.Servo()
	serialArduino = serial.Serial(DUE_PORT,DUE_BAUDS) 
	signal.signal(signal.SIGINT, close_sig_handler)
	server.serveforever()