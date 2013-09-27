import socket  
  
s = socket.socket() 
s=socket.socket(socket.AF_INET,socket.SOCK_DGRAM)  
s.connect(("192.168.0.123", 5000))  

s.send("1")
s.close()  

  
s.close() 
