import socket, serial

s = socket.socket()
s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)
s.bind(('192.168.0.123', 5000))  

ser = serial.Serial('/dev/ttyACM0',9600)

while True:
	data,addr=s.recvfrom(3)
	ser.write(data)

s.close()
