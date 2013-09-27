import socket  
  
s = socket.socket() 
s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)  
s.connect(("192.168.0.123", 5000))  
  
while True:  
      mensaje = raw_input("> ")  
      s.send(mensaje)  
      if mensaje == "quit":  
         break  
  
print "adios"  
  
s.close() 
