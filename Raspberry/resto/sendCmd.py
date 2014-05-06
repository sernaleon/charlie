import sys, struct, serial, signal, ssl, logging 



DUE_PORT = 'COM7' #'/dev/ttyACM0'
DUE_BAUDS = 9600

ser = serial.Serial(DUE_PORT,DUE_BAUDS) 


#1 255 127 -> Avanza a to pijo
#0 0 0 -> freno bloqueo
while True:
	
	msg = bytearray(3)
	msg[0] = struct.pack('B', int(raw_input("cmd:")))
	msg[1] = struct.pack('B', int(raw_input("p1:")))
	msg[2] = struct.pack('B', int(raw_input("p2:")))
	print msg
	ser.write(msg)
	
	recMsg = ser.readline().strip()
	
	
