#ifndef _GR_TYPES
#define _GR_TYPES

/**********************************************/
//
//            SYSTEM CONSTANTS
//
/**********************************************/
#define ARDUINO_ADDR    4     //
#define KMAXSPEED       400
#define KSPEED          300
#define KTURNSPEED      200


//-------------------------
//        INPUTS
//-------------------------

//EMERGENCY STOP SONAR
#define SONARPIN        A10

//Push button (Pull-up)
#define  I_BUTTON	13


//On/off infrared sensors

#define  O_IRON_AN	29   // Analogical infrared (Pull-Up)
#define  O_IRON_DG	27   // Digital infrared (Pull-Down)

//Analogical infrared sensors

#define NUMFRONTS  12

#define I_IR10	53
#define I_IR11	51
#define I_IR12	49
#define I_IR13	47
#define I_IR14	45
#define I_IR15	43
#define I_IR16	41
#define I_IR17	39
#define I_IR18	37
#define I_IR19	35
#define I_IR20	33
#define I_IR21	31

//Digital infrared sensors

#define NUMMIDS  9

#define I_IR1	4
#define I_IR2	5
#define I_IR3	A0
#define I_IR4	A1
#define I_IR5	6
#define I_IR6	A2
#define I_IR7	A3
#define I_IR8	11
#define I_IR9	12

//-------------------------
//        OUTPUTS
//-------------------------

//Buzzer (Pull-Down)
#define  O_BUZZER	23


//LEDs

#define  NUMLEDS        12
#define  NUMBLUELEDS    2

#define  O_LED4		52
#define  O_LED5		50
#define  O_LED6		48
#define  O_LED7		46
#define  O_LED8		44
#define  O_LED9		42
#define  O_LED10	36
#define  O_LED11	34
#define  O_LED12	32
#define  O_LED13	30
#define  O_LED14	28
#define  O_LED15	26
#define  O_LED16	24
#define  O_LED17	22

//------------------------
//          Motor
//------------------------

//A channel
#define  O_Ain1	9
#define  O_Ain2	7

//B channel
#define  O_Bin1	10
#define  O_Bin2	 8

#define RESOLUTION 700
#endif
