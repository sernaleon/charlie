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
	estado = FOLLOWING;
	estadoV = 0;
	estadoN = 0;
	estadoNV = 0;
	numPulsaciones = 0;

	votosIzquierda = 0;
	votosDerecha = 0;
	votosCentro = 0;
	
	esInterseccion = false;
	tamInter = -1;
	posInter = -1;
	
	
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
	kp=0.35;
	kd=0.95;
	
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
	if(numLed>=0 && numLed<12){
		digitalWrite(lineLEDS[numLed],LOW);
	}
}

//Enciende el LED señalizador izquierdo 
void GoShield_GR_ua::TurnOnLeftLED(){
	digitalWrite(O_LED8,HIGH);
}

//Apagar el LED señalizador izquierdo
void GoShield_GR_ua::TurnOffLeftLED(){
	digitalWrite(O_LED8,LOW);
}

//Enciende el LED señalizador derecho
void GoShield_GR_ua::TurnOnRightLED(){
	digitalWrite(O_LED13,HIGH);
}

//Apagar el LED señalizador derecho
void GoShield_GR_ua::TurnOffRightLED(){
	digitalWrite(O_LED13,LOW);
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
void GoShield_GR_ua::setForwardSpeedRight(int speed){

	if (speed < 0) speed = 0;
	else if (speed > MAXSPEED) speed = MAXSPEED;
	
	analogWrite(O_Ain1,speed);
	digitalWrite(O_Ain2,LOW);
}

//Establecer velocidad de avance en motor izquierdo
void GoShield_GR_ua::setForwardSpeedLeft(int speed){

	if (speed< 0) speed = 0;
	else if (speed > MAXSPEED) speed = MAXSPEED;
	
	analogWrite(O_Bin1,speed);
	digitalWrite(O_Bin2,LOW);
}

//Giro a la derecha sobre rueda izquierda
void GoShield_GR_ua::TurnRight(unsigned int speed){
	setForwardSpeedRight(speed);
	setForwardSpeedLeft(0);
}

//Giro a la izquierda sobre rueda derecha
void GoShield_GR_ua::TurnLeft(unsigned int speed){
	setForwardSpeedRight(0);
	setForwardSpeedLeft(speed);
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
	/*
Serial.print(speedLeft);
Serial.print(" ");
Serial.println(speedRight);
	
	if (speedLeft < 0)
	{
		digitalWrite(O_Bin1,HIGH);
		digitalWrite(O_Bin1,HIGH);		
		delayMicroseconds(10);
		
		analogWrite(O_Bin1,-speedLeft);
		digitalWrite(O_Bin2,HIGH);
	}
	else
	{
		setForwardSpeedLeft(speedLeft);
	}
	
	if (speedRight < 0)
	{
		digitalWrite(O_Ain1,HIGH);
		digitalWrite(O_Ain1,HIGH);
		delayMicroseconds(10);
		
		analogWrite(O_Ain1,-speedRight); 
		digitalWrite(O_Ain2,HIGH);
	}	
	else
	{
		setForwardSpeedRight(speedRight);
	}
	
	*/
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


	setForwardSpeedRight(speedRight);		
	setForwardSpeedLeft(speedLeft);
	

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
	digitalWrite(O_IRON_DG,HIGH);
}

//Apaga la linea de infrarrojos centrales
void GoShield_GR_ua::TurnOffIRMiddle(){
	digitalWrite(O_IRON_DG,LOW);
}

//--------------------------------------------
// 		Sensores centrales
//--------------------------------------------


//Obtiene el valor leido en un senesor central
unsigned char GoShield_GR_ua::getMiddleSensor(unsigned char sensor)
{
	if (sensor >= 0 && sensor < 9)
	{
		return middleSensorAux[sensor] ? 1 : 0;
	}
	else return 0;
}


//Lee los sensores centrales y los almacena en un vector (middleSensorAux) y en un entero middleSensorValue
unsigned int GoShield_GR_ua::ReadMiddleLine(){
	middleSensorValue = 0;
	
	TurnOnIRMiddle();	
	delay(100);
	
	for ( int i = 0 ;  i < 9; i++)
	{
		 if (digitalRead(middleSensor[i]) == HIGH)
		 {
			middleSensorAux[i] = false;
			middleSensorValue &= ~( 1 << i );
		 }
		 else
		 {
			middleSensorAux[i] = true;
			middleSensorValue |= ( 1 << i );
		 }
	}
	
	TurnOffIRMiddle();	
	return middleSensorValue;
}


//-----------------------------------
//Esto si da tiempo se haría en esta clase y si no en la calse del miercoles
//-----------------------------------

//Marca en los leds el estado de los sensores infrarrojos
//Si se pasa true como parametros se encienden cuando los sensores detectan blanco y se apagan si los sensores detectan negro
//Si se pasa false como parametros se encienden cuando los sensores detectan negro y se apagan si los sensores detectan blanco
void GoShield_GR_ua::ShowMiddleLine(bool oneLed){
	
	for (int i = 0; i < 9; i++)
	{
		if (oneLed)
		{
			if (i < 4)
			{ 
				(middleSensorAux[i]) ? TurnOnFrontLED(i+1) : TurnOffFrontLED(i+1); 
			}
			else if (i == 4)
			{
				if (middleSensorAux[4])
				{
					TurnOnFrontLED(5);
					TurnOnFrontLED(6);
				}
				else
				{
					TurnOffFrontLED(5);
					TurnOffFrontLED(6);
				}
			}
			else
			{
				(middleSensorAux[i]) ? TurnOnFrontLED(i+2) : TurnOffFrontLED(i+2); 
			}			
		}
		else
		{
			if (i < 4)
			{ 
				(middleSensorAux[i]) ? TurnOffFrontLED(i+1) : TurnOnFrontLED(i+1); 
			}
			else if (i == 4)
			{
				if (middleSensorAux[4])
				{
					TurnOffFrontLED(5);
					TurnOffFrontLED(6);
				}
				else
				{
					TurnOnFrontLED(5);
					TurnOnFrontLED(6);
				}
			}
			else
			{
				(middleSensorAux[i]) ? TurnOffFrontLED(i+2) : TurnOnFrontLED(i+2); 
			}
		}
	}
}

//-------------------------------------------
//Realiza el seguimiento con los sensores centrales
//-------------------------------------------

//Esta función sigue una linea siempre a la derecha utilizando los sensores centrales (digitales)
void GoShield_GR_ua::middle_Follow(){

	if((middleSensorValue&0x38)>0){	
		Move_Forward();		
	}
	else
	{
	 	setForwardSpeedRight(0);
		setForwardSpeedLeft(0);
		
		if((middleSensorValue&0x07)>0){	
			TurnRight(150);
		}else{	
			TurnLeft(150);
		}
	}
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

void GoShield_GR_ua::calibrate()
{
	set_Forward_motors(0,0);	
	Move_Forward();
	
	for (int i = 0; i < 12; i++);
	{
		digitalWrite(lineLEDS[i], LOW);
	}
	digitalWrite(50, HIGH);
	digitalWrite(24, HIGH);  
	for (int i=0; i < 12; i++)
	{
		calibrateMin[i] = 50000000;
		calibrateMax[i] = 0;
	}
	for (int t = 0; t < 5000; t++)
	{
		read_line();
		for (int i=0; i < 12; i++)
		{
			if (calibrateMin[i] >  sensorAux[i]) calibrateMin[i] = sensorAux[i]; 		
			if (calibrateMax[i] <  sensorAux[i]) calibrateMax[i] = sensorAux[i];	 		
		}		
	}
}


//Lee la linea de sensores
//Se busca determinar como de excitado está cada sensor en base al tiempo que tarda en escargarse cada condensador
void GoShield_GR_ua::read_line(){

	//Descargo	
	for (int i = 0; i < 12; i++)
	{
		pinMode(frontSensor[i], OUTPUT);
		digitalWrite(frontSensor[i],HIGH);
	}
	
	delayMicroseconds(15);	
	
	//Cargo
	for (int i = 0; i < 12; i++)
	{
		pinMode(frontSensor[i], INPUT);	
		digitalWrite(frontSensor[i],LOW);
	}
	
	//Enciendo fila
	digitalWrite(O_IRON_AN,HIGH);
	
	delayMicroseconds(5);
	
	//Cuento 
	unsigned int cTiempo = 0;
	unsigned int cSensores = 0;
	while (cTiempo < 2000 && cSensores < 12)
	{
		for (int i = 0; i < 12; i++)
		{
			if (digitalRead(frontSensor[i]) == LOW && !sensorLeido[i])
			{
				sensorAux[i] = cTiempo;
				frontSensorValue[i] = map(cTiempo,calibrateMin[i],calibrateMax[i],0,100);				
				if (frontSensorValue[i] < 10) frontSensorValue[i] = 0;
				frontSensorBool[i] = frontSensorValue[i] > 0;
				sensorLeido[i] = true;
				cSensores++;
			}
		}
		cTiempo++;			
		delayMicroseconds(1);
	}	
	
	//Pongo los sensores a false (y relleno posibles valores time_out)
	for (int i = 0; i < 12; i++)
	{
		if (sensorLeido[i])
		{
			sensorLeido[i] = false;
		}
		else
		{
			sensorAux[i] = 2000;
			frontSensorValue[i] = 100; //map(2000,calibrateMin[i],calibrateMax[i],0,100);		
			frontSensorBool[i] = true;
		}
	}
		
	//Desactivo fila
	digitalWrite(O_IRON_AN,LOW);
	
}



//Obtiene el centro de la linea leida (requiere leer previamente la linea con la función read_line)
unsigned int GoShield_GR_ua::get_Center(){
	
	if (estado == IZQUIERDA) return get_Center_Izquierda();
	else if (estado == DERECHA) return get_Center_Derecha();
	
	if (esInterseccion)
	{
		int c =  posInter +(tamInter / 2);
		if (c >= 0 && c < 12)
		{
			frontSensorValue[c] = 100;
			for (int i = 0; i < 12; i++)
			{
				frontSensorValue[i] = 0;
			}
		}		
	}
	
	int arriba = 0;
	int abajo = 0;
	for (int i = 0; i < 12; i++)
	{
		arriba += frontSensorValue[i]*(i+1)*1000;
		abajo += frontSensorValue[i];
	}
	return arriba/abajo;
}


//Obtiene el valor leido en un senesor frontal, necesita haber leido la linea frontal con la función read_line previamente
int GoShield_GR_ua::getSensor(unsigned char sensor){	
	return frontSensorValue[sensor];
}


//Marca la linea en los sensores superiores
void GoShield_GR_ua::MarcaLinea(bool oneLed){

	for (int i = 0; i < 12; i++ )
	{
		digitalWrite(lineLEDS[i], frontSensorBool[i] ? HIGH : LOW);
	}
	
	/*
	
	int encendido = numPulsaciones;
	for (int i = 0; i < 12; i++ )
	{
		digitalWrite(lineLEDS[i], encendido > 0 ? HIGH : LOW);
		encendido--;
	}
	
	*/
}

//Sino  da tiempo a partir de aqui se deja para el día siguiente

//-------------------------------------------------------
//		Siguelineas sin Inversión de motor
//-------------------------------------------------------
//Este es el sistema para seguir una linea facil (es el mas sencillo ya que no contempla la inversión en los ejes de los motores), los motores siempre giran hacia delante.
//En caso de quere poder girar sobre si mismo el robot, hay que controlarlo porque hay que frenar los motores antes de comenzar a girar a la inversa para no estropear la reductora
void GoShield_GR_ua::Follow(int power_difference){	


 
	read_line();
	
	//Limpia marcas
	
	esInicioInter();
	 
	if (!esInterseccion) GetMarca(); 
	
	int pid = getPID();
	if (pid > 0)
	{
		set_Forward_motors(SPEED,SPEED-pid);
	}
	else
	{
		set_Forward_motors(SPEED+pid, SPEED);
	}
	Move_Forward();
	MarcaLinea();
	MarcaEstado();
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
	last_proportional = proportional;
	proportional = get_Center() - 6500;
	return kp*proportional+kd*(proportional-last_proportional);
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


void GoShield_GR_ua::GestionEstados(unsigned char estadoL)
{
	switch(estadoL)
	{
		case CENTRO:
			votosCentro++;
		break;
		case IZQUIERDA:
			votosIzquierda++;
		break;
		case DERECHA:
			votosDerecha++;
		break;
	}
	
	//Centro mayor
	if (estado != CENTRO && votosCentro >= 50)
	{
		numPulsaciones++;
		estado = CENTRO;
		votosIzquierda = 0;
		votosDerecha = 0;
	}
	// Izquierda mayOr
	else if  (estado != IZQUIERDA && votosIzquierda >= 50)
	{
	
		numPulsaciones++;
		estado = IZQUIERDA;
		votosCentro = 0;
		votosDerecha = 0;
	}
	//dERECHA
	else if (estado != DERECHA && votosDerecha >= 50)
	{
	
		numPulsaciones++;
		estado = DERECHA;
		votosCentro = 0;
		votosIzquierda = 0;
	}
}

bool GoShield_GR_ua::haySaltos()
{
	int i = 0;	
	while ( i < 12)
	{
		//Encontrada linea
		if (frontSensorBool[i])
		{
			i++;
			while ( i < 12)
			{
				//Fin de la linea (encontrado blanco)
				if (!frontSensorBool[i])
				{
					i++;
					while ( i < 12)
					{
						//Encontrada nueva linea (nuevo negro);
						if (frontSensorBool[i]) return true;
						i++;
					}
				}
				i++;
			}
		}
		i++;
	}
	return false;
}

//Tras leer la linea central de sensores se pueden contar la cantidad de cambios
unsigned char GoShield_GR_ua::DetectaCambios()
{
	bool estadoAnterior = frontSensorBool[0];
	cambios = 0;
	for (int i = 1; i < 12; i++)
	{
		if (frontSensorBool[i] != estadoAnterior)
		{
			cambios++;
			estadoAnterior = frontSensorBool[i];
		}
	}
	
	return cambios;
}


void GoShield_GR_ua::esInicioInter()
{
	if (!esInterseccion)
	{
		int lineaG = -1;
		int posIni = -1;
		int lineaAux = -1;
		int i = 0;
		
		int primerBlanco = -1;
		while (i < 12)
		{
			
			//Para en el primer blanco
			while (i < 12 && !frontSensorBool[i]) i++;
			primerBlanco = i;
			
			//Para en el último blanco
			while (i < 12 && frontSensorBool[i]) i++;
			
			lineaAux = i - primerBlanco;
			
			if (lineaAux > lineaG)
			{
				posIni = primerBlanco;
				lineaG = lineaAux;
				
			}
		}
		
		if (lineaG > 3)
		{
			esInterseccion = true;
			posInter = posIni;
			tamInter = lineaG;
			
			
			//  set_Forward_motors(0,0);	
			//  Move_Forward();
			analogWrite(O_Ain1,maxRes);
			digitalWrite(O_Ain2,HIGH);
			
			analogWrite(O_Bin1,maxRes);
			digitalWrite(O_Bin2,HIGH);
			delay(100);
		}
	}
	else
	{
		int res=0;
		for (int i=0; i < 12; i++)
		{
			if (frontSensorBool[i]) res++;
		}		
		//FIN INTERSECCION
		if (res <= 2)
		{
			esInterseccion = false;
		}
	}
	
}

//Número de blancso a la derecha
unsigned char GoShield_GR_ua::BlancosDerecha(){

}

//Número de blancso a la izquierda
unsigned char GoShield_GR_ua::BlancosIzquierdas(){
}


//TODO: Simplificar
//Esto es un ejemplo de implementación pero se puede simplificar mucho
unsigned char GoShield_GR_ua::GetMarca()
{

	DetectaCambios();

		if (cambios >= 5)
		{
			GestionEstados(CENTRO);
		}
		else if (cambios >= 3)
		{
			int auxIz = 0;
			int auxDe = 0;
			
			for (int i = 1; i <=  6; i++)
			{
				auxIz+= frontSensorBool[6-i]*i*2;
				auxDe+= frontSensorBool[5+i]*i*2;
			}
			if (auxIz > auxDe)
			{
				GestionEstados(IZQUIERDA);

			}
			else if (auxDe > auxIz)
			{
				GestionEstados(DERECHA);
			}	
		}
	
	return cambios;
}

//Marca el estado según la marca que se haya leido
void GoShield_GR_ua::MarcaEstado()
{
	switch (estado)
	{
		case CENTRO:
			digitalWrite(O_LED8,HIGH);
			digitalWrite(O_LED13,HIGH);
		break;
		case IZQUIERDA:
			digitalWrite(O_LED8,HIGH);
			digitalWrite(O_LED13,LOW);
		break;
		case DERECHA:
			digitalWrite(O_LED8,LOW);
			digitalWrite(O_LED13,HIGH);
		break;
		default:
			digitalWrite(O_LED8,LOW);
			digitalWrite(O_LED13,LOW);		
	}
	
	if (esInterseccion)
	{
		digitalWrite(lineLEDS[0],HIGH);
		digitalWrite(lineLEDS[11],HIGH);
	}
}

//Obtiene el centro de la linea leida (requiere leer previamente la linea con la función read_line)
unsigned int GoShield_GR_ua::get_Center_Derecha(){
	int arriba = 0;
	int abajo = 0;
	
	bool encontrado = false;
	for (int i = 11; i >= 0 && !encontrado; i--)
	{
		arriba += frontSensorValue[i]*(i+1)*1000;	
		abajo += frontSensorValue[i];
		
		encontrado = frontSensorBool[i];
	}
	return arriba/abajo;
}



//Obtiene el centro de la linea leida (requiere leer previamente la linea con la función read_line)
unsigned int GoShield_GR_ua::get_Center_Izquierda(){
	int arriba = 0;
	int abajo = 0;
	
	bool encontrado = false;
	for (int i = 1; i < 12 && !encontrado; i++)
	{
		arriba += frontSensorValue[i]*(i+1)*1000;	
		abajo += frontSensorValue[i];
		
		encontrado = frontSensorBool[i];
	}
	return arriba/abajo;
}


void GoShield_GR_ua::Stop()
{

	  bool alternador = true;
	  for (int i = 0; i < 12; i++);
	  {
		digitalWrite(lineLEDS[i], alternador ? HIGH : LOW);
		alternador = !alternador;
	  }
	  set_Forward_motors(0,0);	
	  Move_Forward();
}


void GoShield_GR_ua::USBMode()
{
	  set_Forward_motors(0,0);	
	  Move_Forward();
	  for (int i = 0; i < 6; i++);
	  {
		digitalWrite(lineLEDS[i], HIGH);
	  }
	  for (int i = 6; i < 12; i++);
	  {
		digitalWrite(lineLEDS[i], LOW);
	  }
	  delay(300);
	  SPEED = USBSPEED;
}

void GoShield_GR_ua::BatMode()
{
	  set_Forward_motors(0,0);	
	  Move_Forward();
	  for (int i = 0; i < 12; i++);
	  {
		digitalWrite(lineLEDS[i], HIGH);
	  }
	  for (int i = 6; i < 12; i++);
	  {
		digitalWrite(lineLEDS[i], LOW);
	  }
	  delay(300);
	  SPEED = BATSPEED;
}

void GoShield_GR_ua::GestionBotones()
{

	votosIzquierda = 0;
	votosDerecha = 0;
	votosCentro = 0;
	calibrate();
	/*
	  switch (numPulsaciones)
	  {
		case 0:			
			Stop();
			break;
		  
		case 1:			
			USBMode();
			break;	  
		case 2:    
			BatMode(); 	
			break;	  
		case 3:    		
			calibrate();
	  }
  
	//Incremento pulsaciones
  if (numPulsaciones < 3)  numPulsaciones++;
  else numPulsaciones = 0;
  
  */
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
	  

