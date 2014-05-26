import sys, struct, serial, signal, ssl, logging ,time



DUE_PORT = 'COM7' #'/dev/ttyACM0'
DUE_BAUDS = 9600

ser = serial.Serial(DUE_PORT,DUE_BAUDS) 


#1 255 123 -> Avanza a to pijo
#0 0 0 -> freno bloqueo

def sendToArduino(cmd,p1,p2):
	msg = bytearray(3)
	msg[0] = struct.pack('B', int(cmd))
	msg[1] = struct.pack('B', int(p1))
	msg[2] = struct.pack('B', int(p2))
	
	ser.write(msg)
	
	print "   Send:", msg[0], msg[1], msg[2], msg
		
def receiveFromArduino(cmd,p1,p2):
	sendToArduino(cmd,p1,p2)
	recMsg = ser.readline()
	
	print "Receive:",recMsg
	
	return recMsg.strip()
	
def analogReadFront():
	cmd = "16"
	nop = "0"
	res = receiveFromArduino(cmd,nop,nop).split(',')
	print res

	
a = raw_input("cmd:")
# b = "16"
# print a, len(a), type(a)
# print b, len(b), type(b)

# receiveFromArduino(a,a,a)
# receiveFromArduino(b,b,b)



analogReadFront()
#receiveFromArduino(raw_input("cmd:"),raw_input(" p1:"),raw_input(" p2:"))
#receiveFromArduino(15,0,0)
	
	
