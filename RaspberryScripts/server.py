import sys,socket  

s = socket.socket()

s.bind(('192.168.0.123', 5000))  
s.listen(1)

sc, addr = s.accept()
while True:  
      recibido = sc.recv(1024)  
      print recibido
      sc.send(recibido)

sc.close()
s.close()  

