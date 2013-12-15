import sys,socket, struct, serial 

s = socket.socket()
s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
s.bind(('192.168.0.123', 5000))  

#ser = serial.Serial('/dev/ttyACM0',9600)

lastReceived = -1 

while True:
	data,addr=s.recvfrom(4)
	
	cmd = struct.unpack('B', data[0])[0]
	p1  = struct.unpack('B', data[1])[0]
	p2  = struct.unpack('B', data[2])[0]
	p3  = struct.unpack('B', data[3])[0]
	
	#Si el comando es 0 hay que devolver un ACK
	if cmd == 0:
		socket.sendto(chr(p3), addr)
		print ("ACK!",p3)
		#ser.write(data)
	else if p3 > lastReceived or ( p3 < 5 and lastReceived > 250 ):
		print(addr,cmd,p1,p2,p3)	
		#ser.write(data)		
		lastReceived = p3
	else:
		print ("Tropezon!")
	
s.close()  

 