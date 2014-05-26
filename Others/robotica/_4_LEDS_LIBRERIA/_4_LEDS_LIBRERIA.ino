#include <GoShield_GR_ua.h>

GoShield_GR_ua gr;

int estado = SENSING;
int contador;
void setup() {
  Serial.begin(9600);
  contador = 0;
  gr.set_Forward_motors(100,100);
}

void loop() {
  gr.read_line();
  delay(50);
  
  /*
  contador++;
  
  int linea = gr.ReadMiddleLine();
  
  switch(estado) {
      case SENSING:
        gr.ShowMiddleLine(1);
        
        if (contador == 10 )
        {
          estado = FOLLOWING;
          contador = 0;
        }
      break;      
      case FOLLOWING:
        gr.middle_Follow();
                
        if (contador == 10 )
        {
          estado = SENSING;
          contador = 0;
        }
      break;
  }
  */
}
