cd /home/pi/server/mjpg-streamer/

uv4l --driver raspicam --auto-video_nr --width 320 --height 240 --framerate 15 --sched-rr

export LD_LIBRARY_PATH="$(pwd)"

LD_PRELOAD=/usr/lib/uv4l/uv4lext/armv6l/libuv4lext.so ./mjpg_streamer -i "input_uvc.so -d /dev/video0 -r 320x240 -f 15" -o "output_http.so -w ./www" &
