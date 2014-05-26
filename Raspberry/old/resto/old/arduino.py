import serial
//ser = serial.Serial('COM7',9600)

while True:
	msg = raw_input; 
	cmd = struct.unpack('B', msg[0])[0]
	p1 = struct.unpack('B', msg[1])[0]
	p2 = struct.unpack('B', msg[2])[0]
	print cmd, p1,p2	


//ser.write(msg)