import sys,socket, struct

s = socket.socket()
s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
s.bind(('192.168.0.123', 5000))  
while True:
	data,addr=s.recvfrom(3)
	print(addr,struct.unpack('B', data[0])[0],struct.unpack('B', data[1])[0],struct.unpack('B', data[2])[0])	
	
s.close()  

