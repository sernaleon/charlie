import sys, socket, struct, serial
from threading import Thread 

sock = socket.socket() 
sock=socket.socket(socket.AF_INET,socket.SOCK_DGRAM) 
sock.bind(('192.168.0.123', 5000))

ser = serial.Serial('/dev/ttyACM0',9600) 

lastReceived = -1 

remoteIP = None

def receptorThread( ):
	print ("Cargando receptorThread")
	while True:
		print ("Abriendo escucha con Arduino: ")
		fromArduino = ser.read();
		print ("Recibido desde Arduino: ",fromArduino)
		if remoteIP is not None:
			print "Enviando", chr(fromArduino), " a ", remoteIP
			sock.send(chr(fromArduino),(remoteIP,5000))
			print "Enviado!"
		else:
			print "No hay IP destino"



t = Thread(target=receptorThread)
t.start()
#Thread(target=receptorThread).start()
	
print ("Abriendo escucha con Android...")
while True:
	data,addr=sock.recvfrom(4)
	
	remoteIP = addr[0]
	
	cmd = struct.unpack('B', data[0])[0]
	p1 = struct.unpack('B', data[1])[0]
	p2 = struct.unpack('B', data[2])[0]
	p3 = struct.unpack('B', data[3])[0]
	
	#Si el comando es 0 hay que devolver un ACK
	if cmd == 0:
		sock.sendto(chr(p3), addr)
		print ("ACK!",p3,chr(p3))
		ser.write(data)
	elif p3 > lastReceived or ( p3 < 5 and lastReceived > 250 ):
		print(addr,cmd,p1,p2,p3)
		ser.write(data)
		lastReceived = p3
	else:
		print ("Tropezon!")
		
sock.close()
 
