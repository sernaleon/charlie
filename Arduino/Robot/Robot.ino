#include "GoShield.h"

GoShield *gr;

void setup()
{
    gr = new GoShield();
}

void loop()
{
    gr->loop();
}

