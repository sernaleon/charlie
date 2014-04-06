#include <GoShield_GR_ua.h>

GoShield_GR_ua gr;


void setup() {
  Serial.begin(9600);
  attachInterrupt(13, GestionBotones, FALLING);
}

void GestionBotones()
{
  gr.GestionBotones();
}


void loop() {
  gr.Follow(0);  
}

