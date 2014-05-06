echo "Charlie v0.03"
echo "Starting camera and websocket servers..."
#python2.7 websocket.py &
./cmdserver.py &
./cam.sh &

echo "Done!""
