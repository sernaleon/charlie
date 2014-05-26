import sys, socket, struct, serial 

sock = socket.socket() 
sock=socket.socket(socket.AF_INET,socket.SOCK_DGRAM) 
sock.bind(('192.168.0.123', 5000)) 

ser = serial.Serial('/dev/ttyACM0',9600) 

lastReceived = -1 
 
while True:
	data,addr=sock.recvfrom(4)

	cmd = struct.unpack('B', data[0])[0]
	p1 = struct.unpack('B', data[1])[0]
	p2 = struct.unpack('B', data[2])[0]
	p3 = struct.unpack('B', data[3])[0]
	
	#Si el comando es 0 hay que devolver un ACK
	if cmd == 0:
		sock.sendto(chr(p3), addr)
		ser.write(bytearray([cmd,p1,p2]))
	elif p3 > lastReceived or ( p3 < 5 and lastReceived > 250 ):
		ser.write(bytearray([cmd,p1,p2]))
		lastReceived = p3
		
sock.close()
 
