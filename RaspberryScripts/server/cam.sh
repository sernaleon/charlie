raspivid -t 999999 -o - | nc 192.168.0.193 5001 -u
