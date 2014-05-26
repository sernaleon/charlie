#!/usr/bin/python

import picamera
from time import sleep
camera = picamera.PiCamera()
camera.vflip = False
camera.hflip = False
camera.brightness = 60

camera.start_preview()
sleep(0.5)
camera.capture('image.gif', format='gif', resize=(WIDTH,HEIGHT))
screen.fill(black)
pygame.display.update()    
camera.stop_preview()
