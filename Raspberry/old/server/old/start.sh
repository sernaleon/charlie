echo "Creando red ad hoc..."
service hostapd start
service isc-dhcp-server start
echo "¡¡¡CUIDADO!!! 10 segundos para conectar el robot"
sleep 10
echo "Ejecutando servidor..."
python2.7 server2.py &
echo "Ejecutando servidor de camara..."
./cam.sh &
echo "OK"

