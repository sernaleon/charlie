#!/bin/bash

ifconfig wlan0 down
iwconfig wlan0 mode ad-hoc essid "Robot" key "arduino123"
