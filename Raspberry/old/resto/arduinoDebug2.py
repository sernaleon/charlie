import serial, struct
ser = serial.Serial('COM7',9600)

while True:
	inp = raw_input("IN:") 
	inp = inp.split(' ')
	
		
	cmd = bytes(chr(int(inp[0])))
	p1 = bytes(chr(int(inp[1])))
	p2 = bytes(chr(int(inp[2])))
	msg = bytearray ( [cmd, p1, p2] )
	
	print msg

ser.write(msg)