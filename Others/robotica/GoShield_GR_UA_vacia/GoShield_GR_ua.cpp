/*
 GoShield_GR_ua.cpp - library for the GoShield GR Robot Shield - GoShield GR Shield for Arduino
 Released by GoShield like a robot Shield compatible for Arduino DUE.
 ---------------------------
 Release for Arduino IDE v1.5.2 or laster for
 www.goshield.es
*/ 

#include "GoShield_GR_ua.h"
#include "Arduino.h"


GoShield_GR_ua::GoShield_GR_ua()
{
	init();
}


void GoShield_GR_ua::init()
{

	//Desactiva las interrupciones
	noInterrupts(); 
	
	//Resolución del puerto analógico: 1024 (se puede configurar hasta 12-4095)
	analogWriteResolution(10);
	
	//Constantes
	lineLEDS= { O_LED4, O_LED5,O_LED6,O_LED7,O_LED9,O_LED10,O_LED11,O_LED12,O_LED14,O_LED15,O_LED16,O_LED17 };
	middleSensor= { I_IR1, I_IR2, I_IR3, I_IR4, I_IR5, I_IR6, I_IR7, I_IR8, I_IR9 };
	frontSensor = { I_IR10, I_IR11, I_IR12, I_IR13, I_IR14, I_IR15, I_IR16, I_IR17, I_IR18, I_IR19, I_IR20, I_IR21  };

	//Array de entradas y salidas
    unsigned char listaIN []= { I_IR10, I_IR11, I_IR12, I_IR13, I_IR14, I_IR15, I_IR16, I_IR17, I_IR18, I_IR19, I_IR20, I_IR21, I_IR1, I_IR2, I_IR3, I_IR4, I_IR5, I_IR6, I_IR7, I_IR8, I_IR9, O_LED4, O_LED5,O_LED6,O_LED7,O_LED8,O_LED9,O_LED10,O_LED11,O_LED12,O_LED13,O_LED14,O_LED15,O_LED16,I_BUTTON };
    unsigned char listaOUT [] = {O_IRON_AN, O_IRON_DG , O_BUZZER,  O_LED4, O_LED5,O_LED6,O_LED7,O_LED8,O_LED9,O_LED10,O_LED11,O_LED12,O_LED13,O_LED14,O_LED15,O_LED16,O_LED17,O_Ain1,O_Ain2,O_Bin1,O_Bin2};
    
	int i=0;
    //Configuracion de Pines
    for(i=0;i<KENTRADAS;i++){
      pinMode(listaIN[i],INPUT);
    }
    for(i=0;i<KSALIDAS;i++){
      pinMode(listaOUT[i],OUTPUT);
    }
    
	
	reverseLeft=false;
	reverseRight=false;
	
	last_proportional=0;
	proportional=0;
	last_proportional=0;
	derivative=0;
	integral=0;
	maxRes=MAXSPEED;
	
	ki=0;
	kp=0.25;
	kd=0.3;
	
    //Se activan las interrupciones
    interrupts();    
    
}


//********************************************************************************************
//********************************************************************************************
// 								CLASE LUNES MAÑANA 
//--------------------------------------------------------------------------------------------
//	Encendido y Apagado de LEDS
//********************************************************************************************
//********************************************************************************************

//Enciende el LED Frontal numLed  
void GoShield_GR_ua::TurnOnFrontLED(const int numLed){
	if(numLed>=0 && numLed<12){
		digitalWrite(lineLEDS[numLed],HIGH);
	}
}

//Apaga el LED Frontal numLed  
void GoShield_GR_ua::TurnOffFrontLED(const int numLed){
}

//Enciende el LED señalizador izquierdo 
void GoShield_GR_ua::TurnOnLeftLED(){
	digitalWrite(O_LED8,HIGH);
}

//Apagar el LED señalizador izquierdo
void GoShield_GR_ua::TurnOffLeftLED(){
}

//Enciende el LED señalizador derecho
void GoShield_GR_ua::TurnOnRightLED(){
	digitalWrite(O_LED13,HIGH);
}

//Apagar el LED señalizador derecho
void GoShield_GR_ua::TurnOffRightLED(){
}


//********************************************************************************************
//********************************************************************************************
// 								CLASE LUNES TARDE 
//--------------------------------------------------------------------------------------------
//	 Movimiento básico y giros
//********************************************************************************************
//********************************************************************************************


//--------------------------
//	  Control de Motores
//--------------------------
//Establecer velocidad de avance en motor derecho
void GoShield_GR_ua::setForwardSpeedRight(unsigned int speed){
	analogWrite(O_Ain1,speed);
	digitalWrite(O_Ain2,LOW);
}

//Establecer velocidad de avance en motor izquierdo
void GoShield_GR_ua::setForwardSpeedLeft(unsigned int speed){
	analogWrite(O_Bin1,speed);
	digitalWrite(O_Bin2,LOW);
}

//Giro a la derecha sobre rueda izquierda
void GoShield_GR_ua::TurnRight(unsigned int speed){

}

//Giro a la izquierda sobre rueda derecha
void GoShield_GR_ua::TurnLeft(unsigned int speed){

}



//********************************************************************************************
//********************************************************************************************
// 								CLASE MARTES MAÑANA 
//--------------------------------------------------------------------------------------------
//	 IR medios, Zumbador, Divisores de tensión y medidor de batería
//********************************************************************************************
//********************************************************************************************



//Establece la velocidad calculada a los motores (esta es la forma sencilla)
void GoShield_GR_ua::set_Forward_motors(int speedLeftIn , int speedRightIn){
//gestiona establecer la velocidad a los motores en valor positivo
	speedLeft=speedLeftIn;
	speedRight=speedRightIn;
	
	if(speedLeft > maxRes){
		speedLeft = maxRes;
	}else if(speedLeft<0){
		speedLeft = 0;
	}
	
	if(speedRight > maxRes){
			speedRight = maxRes;
	}else if(speedRight<0){
		speedRight = 0;
	}
}

//--------------------------------------------------------------------
//--Solo los avanzados pueden intentar programar la inversión de motor
		
//Mueve el robot aplicando las últimas velocidades calculadas para las ruedas
void GoShield_GR_ua::Move_Forward(){
	//Motor izquierdo avanza

	//Motor derecho avanza

}


//Mueve el robot aplicando las últimas velocidades calculadas para las ruedas teniendo en cuenta las variables reverseRight/reverseLeft
void GoShield_GR_ua::Move(){

}

//Establece la velocidad calculada a los motores (para control optimo del sigue-lineas)
void GoShield_GR_ua::set_motors(int speedLeftIn , int speedRightIn){

}


//********************************************************************************************
//********************************************************************************************
// 								CLASE MIÉRCOLES MAÑANA 
//--------------------------------------------------------------------------------------------
//	 Movimiento básico y giros
//********************************************************************************************
//********************************************************************************************

//----------------------------------------
// LEDs y Activación de los infrarrojos centrales
//----------------------------------------

//Enciende la linea de infrarrojos centrales
void GoShield_GR_ua::TurnOnIRMiddle(){
}

//Apaga la linea de infrarrojos centrales
void GoShield_GR_ua::TurnOffIRMiddle(){
}

//--------------------------------------------
// 		Sensores centrales
//--------------------------------------------


//Obtiene el valor leido en un senesor central
unsigned char GoShield_GR_ua::getMiddleSensor(unsigned char sensor){
}


//Lee los sensores centrales y los almacena en un vector (middleSensorAux) y en un entero middleSensorValue
unsigned int GoShield_GR_ua::ReadMiddleLine(){
}


//-----------------------------------
//Esto si da tiempo se haría en esta clase y si no en la calse del miercoles
//-----------------------------------

//Marca en los leds el estado de los sensores infrarrojos
//Si se pasa true como parametros se encienden cuando los sensores detectan blanco y se apagan si los sensores detectan negro
//Si se pasa false como parametros se encienden cuando los sensores detectan negro y se apagan si los sensores detectan blanco
void GoShield_GR_ua::ShowMiddleLine(bool oneLed){
}

//-------------------------------------------
//Realiza el seguimiento con los sensores centrales
//-------------------------------------------

//Esta función sigue una linea siempre a la derecha utilizando los sensores centrales (digitales)
void GoShield_GR_ua::middle_Follow(){	 
}



//----------------------------------------
// LEDs y Activación de los infrarrojos frontales
//----------------------------------------

//Enciende los infrarrojos frontales
void GoShield_GR_ua::TurnOnIRFront(){
}

//Apagan los infrarrojos frontales
void GoShield_GR_ua::TurnOffIRFront(){
}



//-------------------------------------------------------
// 		Sensores Frontales
//-----------------------------------------------------


//Lee la linea de sensores
//Se busca determinar como de excitado está cada sensor en base al tiempo que tarda en escargarse cada condensador
void GoShield_GR_ua::read_line(){
}



//Obtiene el centro de la linea leida (requiere leer previamente la linea con la función read_line)
unsigned int GoShield_GR_ua::get_Center(){
}


//Obtiene el valor leido en un senesor frontal, necesita haber leido la linea frontal con la función read_line previamente
unsigned int GoShield_GR_ua::getSensor(unsigned char sensor){
}


//Marca la linea en los sensores superiores
void GoShield_GR_ua::MarcaLinea(bool oneLed){
}

//Sino  da tiempo a partir de aqui se deja para el día siguiente

//-------------------------------------------------------
//		Siguelineas sin Inversión de motor
//-------------------------------------------------------
//Este es el sistema para seguir una linea facil (es el mas sencillo ya que no contempla la inversión en los ejes de los motores), los motores siempre giran hacia delante.
//En caso de quere poder girar sobre si mismo el robot, hay que controlarlo porque hay que frenar los motores antes de comenzar a girar a la inversa para no estropear la reductora
void GoShield_GR_ua::Follow(int power_difference){	 
}




//------------------------------------------------------------------------------
// Esta es la forma de seguir lineas avanzada contemplando la inversión de motor
// Este es sólo para los alumnos más avanzados que hayan programado el control
// de motores con inversión de giro
//------------------------------------------------------------------------------
void GoShield_GR_ua::Optimun_Follow(int power_difference){
}




//********************************************************************************************
//********************************************************************************************
// 								CLASE JUEVES MAÑANA 
//--------------------------------------------------------------------------------------------
//	 Movimiento básico y giros
//********************************************************************************************
//********************************************************************************************


//*****************************************************
// 		PID
//-----------------------------------------------------

//Permite establecer los valores para las constantes de PID
void GoShield_GR_ua::setPID(const double kp_i, const double ki_i, const double kd_i){
	kp=kp_i;
	ki=ki_i;
	kd=kd_i;
}

//Obtiene el valor de PID a partir del la lectura de los sensores frontales
int GoShield_GR_ua::getPID(){
}


//********************************************************************************************
//********************************************************************************************
// 								CLASE VIERNES MAÑANA 
//--------------------------------------------------------------------------------------------
//	 Movimiento básico y giros
//********************************************************************************************
//********************************************************************************************

//----------------------------------------
// 		Detección de Marcas


//Tras leer la linea central de sensores se pueden contar la cantidad de cambios
unsigned char GoShield_GR_ua::DetectaCambios(){
}

//Número de blancso a la derecha
unsigned char GoShield_GR_ua::BlancosDerecha(){
}

//Número de blancso a la izquierda
unsigned char GoShield_GR_ua::BlancosIzquierdas(){
}


//TODO: Simplificar
//Esto es un ejemplo de implementación pero se puede simplificar mucho
unsigned char GoShield_GR_ua::GetMarca(){
}

//Marca el estado según la marca que se haya leido
void GoShield_GR_ua::MarcaEstado(){
}

//Obtiene el centro de la linea leida (requiere leer previamente la linea con la función read_line)
unsigned int GoShield_GR_ua::get_Center_Derecha(){
}



//Obtiene el centro de la linea leida (requiere leer previamente la linea con la función read_line)
unsigned int GoShield_GR_ua::get_Center_Izquierda(){
}

//********************************************************************************************
//********************************************************************************************
// 								YA PROGRAMADOS
//--------------------------------------------------------------------------------------------
//	
//********************************************************************************************
//********************************************************************************************

unsigned char GoShield_GR_ua::getNumVotosIzq(){
	return votosIzquierda;
}

unsigned char GoShield_GR_ua::getNumVotosDer(){
	return votosDerecha;
}

unsigned char GoShield_GR_ua::getNumVotosCen(){
	return votosCentro;
}
		

unsigned char GoShield_GR_ua::getNumCambios(){
	return cambios;
}

unsigned char GoShield_GR_ua::getNumBlancosDer(){
	return blancosDer;
}

unsigned char GoShield_GR_ua::getNumBlancosIzq(){
	return blancosIzq;
}

		
unsigned long GoShield_GR_ua::getNumPilaCen(){
	return pilaCentro;
}
		
unsigned long GoShield_GR_ua::getNumPilaIzq(){
	return pilaIzquierda;
}	
	
unsigned long GoShield_GR_ua::getNumPilaDer(){
	return pilaDerecha;
}
	  

