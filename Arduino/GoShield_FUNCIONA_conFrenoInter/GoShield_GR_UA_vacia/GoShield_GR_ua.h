/*
 GoShield_GR_ua.cpp - library for the GoShield GR Robot Shield - GoShield GR Shield for Arduino
 Released by GoShield like a robot Shield compatible for Arduino DUE.
 ---------------------------
 Release for Arduino IDE v1.5.2 or laster for
 www.goshield.es
*/ 


#ifndef GoShield_GR_ua_h
#define GoShield_GR_ua_h

#include <stdio.h>
#include <string.h>
#include <inttypes.h>
#include <inttypes.h>
#include "./utility/Types.h"


class GoShield_GR_ua {
	public:
		GoShield_GR_ua();
		void init();
		void begin();

		
		int numPulsaciones;
		void Stop();
		void USBMode();
		void BatMode();
		void GestionBotones();
		//*****************************************************
		// CLASE Lunes Mañana: Encendido y Apagado de LEDS
		//-------------------------------------------------

		//Leds seañalizadores Frontales (Rojo, Amarillo y Verde)
		void TurnOnLeftLED();
		void TurnOffLeftLED();

		//Leds señalizador derecho (Azul)
		void TurnOnRightLED();
		void TurnOffRightLED();
		
		//Leds señalizador izquierdo (Azul)
		void TurnOnFrontLED(const int numLed);
		void TurnOffFrontLED(const int numLed);
		
		
		//*****************************************************
		// CLASE Lunes Tarde: Movimiento básico y giros
		//-------------------------------------------------
		
		//Establecer velocidad de avance en motor derecho
		void setForwardSpeedRight(int speed);
		//Establecer velocidad de avance en motor izqueirdo
		void setForwardSpeedLeft(int speed);
		
		//Giro a la derecha sobre rueda izquierda
		void TurnRight(unsigned int speed);
		//Giro a la izquierda sobre rueda derecha
		void TurnLeft(unsigned int speed);
		
		//Mover el coche hacia delante
		void Move_Forward();
		//Poner velocidad a ambos motores
		void set_Forward_motors(int speedLeft, int speedRight);	
	
	
		//--Solo los avanzados pueden intentar programar la inversión de motor
		void Move();
		//Poner velocidad a ambos motores contemplando la inversión de motor
		void set_motors(int speedLeft, int speedRight);
		
		//*****************************************************
		// CLASE Martes Mañana: IR medios, Zumbador, Divisores de tensión y medidor de batería
		//-------------------------------------------------
		
		//Encender sensores centrales
		void TurnOnIRMiddle();		
		//Apagar sensores centrales
		void TurnOffIRMiddle();
		
		//Leer un sensor central centrales
		unsigned char getMiddleSensor(unsigned char sensor);		
		//Leer la linea de sensores central
		unsigned int ReadMiddleLine();
		
		//-----------------------------------
		//Esto si da tiempo se haría en esta clase y si no en la calse del miercoles
		//-----------------------------------

		//Marca en los leds el estado de los sensores infrarrojos
		void ShowMiddleLine(bool oneLed=false);
		//Seguidor de lineas basado en los sensores centrales
		void middle_Follow();

		//*****************************************************
		// CLASE Miercoles Mañana: Seguimiento lineas con sensores frontales
		//-------------------------------------------------

		//Enciende los infrarrojos frontales
		void TurnOnIRFront();	
		//Apagan los infrarrojos frontales	
		void TurnOffIRFront();
		
		
		void calibrate();
		
		
		//Lee la linea de sensores frontales (analógicos)
		void read_line();		
		//Obtiene el valor leido en un senesor frontal, necesita haber leido la linea frontal con la función read_line previamente
		int getSensor(unsigned char sensor);
		//Marca la linea en los sensores superiores
		void MarcaLinea(bool oneLed=false);
		
		//Obtiene el centro de la linea leida (requiere leer previamente la linea con la función read_line)
		unsigned int get_Center();
		
		//-----------------------------------	
		//Sino  da tiempo a partir de aqui se deja para el día siguiente
		//-----------------------------------
		//Siguelineas sin Inversión de motor
		void Follow(int pid);	
		
		
		//-----------------------------------
		// Esta es la forma de seguir lineas avanzada contemplando la inversión de motor
		// Este es sólo para los alumnos más avanzados que hayan programado el control
		// de motores con inversión de giro
		//-----------------------------------
		void Optimun_Follow(int pid);
		
		//*****************************************************
		// CLASE JUEVES Mañana: PID
		//-------------------------------------------------
		//Permite establecer los valores para las constantes de PID
		int getPID();
		//Obtiene el valor de PID a partir del la lectura de los sensores frontales
		void setPID(const double kp, const double ki, const double kd);
		
		
		//*****************************************************
		// CLASE VIERNES Mañana: Marcas, detección y seguimiento de marcas
		//-------------------------------------------------
		//A partir de aquí se irán terminando los diferentes metodos según el ritmo de cada alumno
		//Número de blancso a la izquierda
		unsigned char BlancosIzquierdas();
		//Número de blancso a la derecha
		unsigned char BlancosDerecha();
		//Obtiene el número de cambios (entre negro y blanco)
		unsigned char DetectaCambios();
		//Determina la marca actual y modifica el estado del robot (IZQUIERDAS, CENTRO ó DERECHAS)
		unsigned char GetMarca();
		//Muestra una marca según el estado en que se encuentra el robot
		void MarcaEstado();
		
		//Estos dos algoritmos tendrán que inventarselo ellos
		//Devuelve el centro de la líena de más a la izquierda (ir hacia la izquierda)
		unsigned int get_Center_Izquierda();
		//Devuelve el centro de la líena de más a la derecha (ir hacia la derecha)
		unsigned int get_Center_Derecha();
		
		
		bool haySaltos();
		
		//***********************
		// YA PROGRAMADOS
		//-----------------------
		
		unsigned char getNumCambios();
		unsigned char getNumBlancosDer();
		unsigned char getNumBlancosIzq();
		
		unsigned char getNumVotosIzq();
		unsigned char getNumVotosDer();
		unsigned char getNumVotosCen();
		
		unsigned long getNumPilaCen();
		unsigned long getNumPilaDer();
		unsigned long getNumPilaIzq();
		
		int speedLeft;
		int speedRight;
		
		bool reverseLeft;
		bool reverseRight;
		
		bool blockLeft;
		bool blockRight;
		
		
		int frontSensorValue [12];
		bool frontSensorBool [12];
		unsigned int calibrateMin[12];
		unsigned int calibrateMax[12];
		
		unsigned char cambios;
		
		int centroAnt;
		
		void esInicioInter();
		int tamInter;
		int posInter;
		bool esInterseccion;
		
	private:
	
		void GestionEstados(unsigned char estadoL);		
		unsigned int estadoV;
		unsigned char estadoN;
		unsigned int estadoNV;
		
		unsigned char lineLEDS [12];
		
		unsigned char middleSensor [9];
		bool middleSensorAux [9];

		unsigned char frontSensor [12];
		unsigned int sensorAux [12];
		unsigned int sensorAuxAnt [12];
		unsigned int middleSensorValue;
		
		bool sensorLeido [12];
		
		int proportional;
		int last_proportional;
		int derivative;
		int integral;
		int maxRes;
		
		double ki,kd,kp;
		
		//Marcas
		unsigned char estado;
		unsigned char votosIzquierda;
		unsigned char votosDerecha;
		unsigned char votosCentro;
		
		
		unsigned int pilaIzquierda;
		unsigned int pilaDerecha;
		unsigned int pilaCentro;
		
		unsigned int blancosIzq;
		unsigned int blancosDer;
		
		
		bool d;
		bool i;
		bool c;
		
};

#endif
