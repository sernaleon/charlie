import socket, time


IPADDR = '192.168.0.192'
PORTNUM = 5000

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM, socket.getprotobyname('udp'))

addr = (IPADDR, PORTNUM)

#s.connect(addr)

while True:
	print "Enviado 5 a ",addr
	s.sendto(chr(5),addr)
	time.sleep(1)

s.close()
