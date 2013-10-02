#! /bin/sh
# /etc/init.d/robotManager
 
### BEGIN INIT INFO
# Provides:          robotManager
# Required-Start:    $remote_fs $syslog $local_fs $network
# Required-Stop:     $remote_fs $syslog $local_fs $network
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Starts the robot
# Description:       Starts the robot
### END INIT INFO
 
# If you want a command to always run, put it here
 
# Carry out specific functions when asked to by the system
case "$1" in
  start)
    echo "Starting robotManager"
    # run application you want to start
    python2.7 /home/pi/server/server.py
    ;;
  stop)
    echo "Stopping robotManager"
    # kill application you want to stop
    killall robotManager2
    ;;
  *)
    echo "Usage: robotManager {start|stop}"
    exit 1
    ;;
esac
 
exit 0