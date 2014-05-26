#ifndef _GR_TYPES
#define _GR_TYPES
#include "Arduino.h"

/**********************************************/
//
//            SYSTEM CONSTANTS
//
/**********************************************/

#define KMAXSPEED       400
#define KSTRAIGHTSPEED  300
#define KTURNSPEED      200


#define MAX_ANALOG_RESOLUTION 1023

#define FRONTAL_TIMEOUT 2000
#define CNY70DIVIDER 30

//-------------------------
//        INPUTS
//-------------------------

#define NUMINPUTS 22

//Push button (Pull-up)
#define  I_BUTTON	13


//On/off infrared sensors

#define  O_IRON_AN	29   // Analogical infrared (Pull-Up)
#define  O_IRON_DG	27   // Digital infrared (Pull-Down)

//Analog infrared sensors

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

#define NUMOUTPUTS 21

//Buzzer (Pull-Down)
#define  O_BUZZER	23


//LEDs

#define  NUMLEDS        14

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

//------------------------
//          Lists
//------------------------

const byte LEDS[NUMLEDS] = { O_LED4, O_LED5,O_LED6,O_LED7,O_LED9,O_LED10,O_LED11,O_LED12,O_LED14,O_LED15,O_LED16,O_LED17 ,O_LED8, O_LED13 };

const byte MIDDLESENSORS[NUMMIDS] = {  I_IR1, I_IR2, I_IR3, I_IR4, I_IR5, I_IR6, I_IR7, I_IR8, I_IR9};
const byte FRONTSENSORS[NUMFRONTS] = { I_IR10, I_IR11, I_IR12, I_IR13, I_IR14, I_IR15, I_IR16, I_IR17, I_IR18, I_IR19, I_IR20, I_IR21    };

const byte INPUTS [NUMINPUTS]= { I_BUTTON, I_IR1, I_IR2, I_IR3, I_IR4, I_IR5, I_IR6, I_IR7, I_IR8, I_IR9, I_IR10, I_IR11, I_IR12, I_IR13, I_IR14, I_IR15, I_IR16, I_IR17, I_IR18, I_IR19, I_IR20, I_IR21  };
const byte OUTPUTS [NUMOUTPUTS] = { O_IRON_AN, O_IRON_DG , O_BUZZER,  O_LED4, O_LED5,O_LED6,O_LED7,O_LED8,O_LED9,O_LED10,O_LED11,O_LED12,O_LED13,O_LED14,O_LED15,O_LED16,O_LED17,O_Ain1,O_Ain2,O_Bin1,O_Bin2  };

#endif
