import sys, struct, serial, signal, ssl, logging , time, array
from SimpleWebSocketServer import WebSocket, SimpleWebSocketServer, SimpleSSLWebSocketServer
from optparse import OptionParser

logging.basicConfig(format='%(asctime)s %(message)s', level=logging.DEBUG)

SERVER_IP = ''
WS_PORT = 8000

DUE_PORT = 'COM7' #'/dev/ttyACM0'
DUE_BAUDS = 9600


ser = serial.Serial(DUE_PORT,DUE_BAUDS) 


while True:
	time.sleep(1)
	print "send 10"
	
	
	msg = bytearray(3)
	msg[0] = struct.pack('B', 10)
	msg[1] = struct.pack('B', 0)
	msg[2] = struct.pack('B',0)
	ser.write(msg)
	recMsg = map(int, ser.readline().split('.'))
	print recMsg
	



