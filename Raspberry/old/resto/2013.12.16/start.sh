echo "Creando punto de acceso..."
./wifiaccesspoint.sh
echo "¡¡¡CUIDADO!!! 10 segundos para conectar el robot"
sleep 10
echo "Ejecutando servidor..."
python2.7 server.py
