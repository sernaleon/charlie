//Add reserved word to prevent collisions with python server
Blockly.Python.addReservedWords("logging,SERVER_IP,WS_PORT,LEDPIN,SERVOPIN,ECHOPIN,TRIGPIN,SONARTIMEOUT,DUE_PORT,DUE_BAUDS,initSonar,readSonar,destructSonar,moveServo,sendToArduino,receiveFromArduino,executeScript,map,WebServer,WebSocket,self,parser,OptionParser,options,args,SimpleSSLWebSocketServer,SimpleWebSocketServer,close_sig_handler,server,sys,servo,serialArduino,signal");

/****************** Motor forwards******************/

Blockly.Blocks['move_fwd'] = {
    init: function() {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Move straight")
            .appendField(new Blockly.FieldDropdown([
                ["slow", SLOW_SPEED.toString()],
                ["medium", MEDIUM_SPEED.toString()],
                ["fast", FAST_SPEED.toString()]
            ]), "speed");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('');
    }
};
Blockly.Python['move_fwd'] = function(block) {
    var dropdown_speed = block.getFieldValue('speed');
    return PYT_SEND + '(' + CMD_BOTH_MOTORS + ',' + dropdown_speed + ',' + CMD_NOPARAM + ')\n';
};


Blockly.Blocks['move_l'] = {
    init: function() {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Move left")
            .appendField(new Blockly.FieldDropdown([
                ["slow", SLOW_SPEED.toString()],
                ["medium", MEDIUM_SPEED.toString()],
                ["fast", FAST_SPEED.toString()]
            ]), "speed");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('');
    }
};
Blockly.Python['move_l'] = function(block) {
    var dropdown_speed = block.getFieldValue('speed');
    return PYT_SEND + '(' + CMD_LEFT_MOTOR + ',' + dropdown_speed + ',' + CMD_NOPARAM + ')\n';
};


Blockly.Blocks['move_r'] = {
    init: function() {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Move right")
            .appendField(new Blockly.FieldDropdown([
                ["slow", SLOW_SPEED.toString()],
                ["medium", MEDIUM_SPEED.toString()],
                ["fast", FAST_SPEED.toString()]
            ]), "speed");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('');
    }
};
Blockly.Python['move_r'] = function(block) {
    var dropdown_speed = block.getFieldValue('speed');
    return PYT_SEND + '(' + CMD_RIGHT_MOTOR + ',' + dropdown_speed + ',' + CMD_NOPARAM + ')\n';
};

Blockly.Blocks['move_motor'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Set")
            .appendField(new Blockly.FieldDropdown([
                ["left", CMD_SET_LEFT.toString()],
                ["right", CMD_SET_RIGHT.toString()],
                ["both", CMD_BOTH_MOTORS.toString() ]
            ]),
                "motor")
            .appendField("motor speed at");
        this.appendValueInput("speed")
            .setCheck("Number");
        this.appendDummyInput()
            .appendField("(0-255)");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Speed should be between -100% and 100%. Numbers outside [-100,+100] are allowed but dangerous!');
    }
};
Blockly.Python['move_motor'] = function (block) {
    var cmd = block.getFieldValue('motor');
    var p1 = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
  //var p1 = Math.round(map(Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC), 0, 100, 0, 255));

    return PYT_SEND + '(' + cmd + ',' + p1 + ',' + CMD_NOPARAM + ')\n';
};


Blockly.Blocks['move_balanced'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Set speed");
        this.appendValueInput("speed")
            .setCheck("Number");
        this.appendDummyInput()
            .appendField("and balance");

        this.appendValueInput("balance")
            .setCheck("Number");
        this.appendDummyInput()
            .appendField("(0-255)");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Speed should be between -100% and 100%. Numbers outside [-100,+100] are allowed but dangerous!');
    }
};
Blockly.Python['move_balanced'] = function (block) {
    var speed = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
    var balance = Blockly.Python.valueToCode(block, 'balance', Blockly.Python.ORDER_ATOMIC);

    return PYT_SEND + '(' + CMD_MOVE_FORWARD + ',' + speed + ',' + balance + ')\n';
};

Blockly.Blocks['stop_motors'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Stop motors");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('');
    }
};
Blockly.Python['stop_motors'] = function (block) {
    return PYT_SEND + '(' + CMD_STOP + ',' + CMD_NOPARAM + ',' + CMD_NOPARAM + ')\n';
};


/****************** Motor backwards******************/


Blockly.Blocks['move_back'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Set both motors at back speed");
        this.appendValueInput("speed")
            .setCheck("Number");
        this.appendDummyInput()
            .appendField("(0-255)");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Speed should be between -100% and 100%. Numbers outside [-100,+100] are allowed but dangerous!');
    }
};
Blockly.Python['move_back'] = function (block) {
    var p1 = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
    return PYT_SEND + '(' + CMD_BACK_BOTH + ',' + p1 + ',' + CMD_NOPARAM + ')\n';
};


Blockly.Blocks['move_b_left'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Set left motor at back speed");
        this.appendValueInput("speed")
            .setCheck("Number");
        this.appendDummyInput()
            .appendField("(0-255)");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Speed should be between -100% and 100%. Numbers outside [-100,+100] are allowed but dangerous!');
    }
};
Blockly.Python['move_b_left'] = function (block) {
    var p1 = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
    return PYT_SEND + '(' + CMD_BACK_LEFT + ',' + p1 + ',' + CMD_NOPARAM + ')\n';
};


Blockly.Blocks['move_b_right'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Set right motor at back speed");
        this.appendValueInput("speed")
            .setCheck("Number");
        this.appendDummyInput()
            .appendField("(0-255)");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Speed should be between -100% and 100%. Numbers outside [-100,+100] are allowed but dangerous!');
    }
};
Blockly.Python['move_b_right'] = function (block) {
    var p1 = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
    return PYT_SEND + '(' + CMD_BACK_RIGHT + ',' + p1 + ',' + CMD_NOPARAM + ')\n';
};


Blockly.Blocks['move_back_balanced'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Set backward speed");
        this.appendValueInput("speed")
            .setCheck("Number");
        this.appendDummyInput()
            .appendField("and balance");

        this.appendValueInput("balance")
            .setCheck("Number");
        this.appendDummyInput()
            .appendField("(0-255)");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Speed should be between -100% and 100%. Numbers outside [-100,+100] are allowed but dangerous!');
    }
};
Blockly.Python['move_back_balanced'] = function (block) {
    var speed = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
    var balance = Blockly.Python.valueToCode(block, 'balance', Blockly.Python.ORDER_ATOMIC);

    return PYT_SEND + '(' + CMD_MOVE_BACKWARD + ',' + speed + ',' + balance + ')\n';
};


/****************** Ground sensors ******************/

Blockly.Blocks['read_front'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Read front sensors");
        this.setInputsInline(true);
        this.setOutput(true);
        this.setTooltip('');
    }
};
Blockly.Python['read_front'] = function (block) {
    return [PYT_RECEIVE + '(' + CMD_FRONT + ',' + CMD_NOPARAM + ',' + CMD_NOPARAM + ')', Blockly.Python.ORDER_FUNCTION_CALL];
};


Blockly.Blocks['read_middle'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Read middle sensors");
        this.setInputsInline(true);
        this.setOutput(true);
        this.setTooltip('');
    }
};
Blockly.Python['read_middle'] = function (block) {
    return [PYT_RECEIVE + '(' + CMD_MIDDLE + ',' + CMD_NOPARAM + ',' + CMD_NOPARAM + ')', Blockly.Python.ORDER_FUNCTION_CALL];
};


Blockly.Blocks['read_ground'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Read front and middle");
        this.setInputsInline(true);
        this.setOutput(true);
        this.setTooltip('');
    }
};
Blockly.Python['read_ground'] = function (block) {
    return [PYT_RECEIVE + '(' + CMD_SENSORS + ',' + CMD_NOPARAM + ',' + CMD_NOPARAM + ')', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['first_black_left'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("From")
        this.appendValueInput("sonarV")
            .setCheck("Array");
        this.appendDummyInput()
            .appendField("get first black from left");
        this.setInputsInline(true);
        this.setOutput(true,Number);
        this.setTooltip('');
    }
};

Blockly.Python['first_black_left'] = function (block) {
    try {
        var sonarV = Blockly.Python.valueToCode(block, 'sonarV', Blockly.Python.ORDER_ATOMIC);

        var code = sonarV+'.find("1")\n';
        return [code, Blockly.Python.ORDER_FUNCTION_CALL];
    }
    catch (e) {
        alert("Error:" + e);
    }
};


Blockly.Blocks['read_front_analog'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Analog read front sensors");
        this.setInputsInline(true);
        this.setOutput(true, "Array");
        this.setTooltip('');
    }
};
Blockly.Python['read_front_analog'] = function (block) {

    var code = PYT_RECEIVE + '(' + CMD_FRONT_ANALOG + ',' + CMD_NOPARAM + ',' + CMD_NOPARAM + ").split(',')";
    return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};



/****************** Other functions ******************/


Blockly.Blocks['wait'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Wait")
        this.appendValueInput("timeD")
            .setCheck("Number");
        this.appendDummyInput()
            .appendField("miliseconds");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('');
    }
};
Blockly.Python['wait'] = function (block) {
    try {
        var value_wait = Blockly.Python.valueToCode(block, 'timeD', Blockly.Python.ORDER_ATOMIC) / 1000;
        return "time.sleep(" + value_wait + ")\n";
    }
    catch (e) {
        alert("Error:" + e);
    }
};


Blockly.Blocks['read_sonar'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Read distance (cm)");
        this.setInputsInline(true);
        this.setOutput(true, "Number");
        this.setTooltip('');
    }
};
Blockly.Python['read_sonar'] = function (block) {
    return [PYT_SONAR + '()', Blockly.Python.ORDER_FUNCTION_CALL];
};


Blockly.Blocks['led'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Set led")
        this.appendValueInput("ledN")
            .setCheck("Number");
        this.appendDummyInput()
            .appendField("(0-13)")
            .appendField(new Blockly.FieldDropdown([
                ["on", "1"],
                ["off", "0"]
            ]),
                "state");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('');
    }
};
Blockly.Python['led'] = function (block) {
    var led = Blockly.Python.valueToCode(block, 'ledN', Blockly.Python.ORDER_ATOMIC)
    var state = block.getFieldValue('state');
    return PYT_SEND + '(' + CMD_LED + ',' + led + ',' + state + ')\n';
};


Blockly.Blocks['servo'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Set servo position")
        this.appendValueInput("pos")
            .setCheck("Number");
        this.appendDummyInput()
            .appendField("[-35,150]");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('');
    }
};
Blockly.Python['servo'] = function (block) {
    try {
        var pos = Blockly.Python.valueToCode(block, 'pos', Blockly.Python.ORDER_ATOMIC);

        p2 = Math.round(map(Math.round(pos), 0, 90, 215, 115))


        return PYT_SERVO + "(" + p2  + "0)\n";
    }
    catch (e) {
        alert("Error:" + e);
    }
};


Blockly.Blocks['horn'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Set horn")
            .appendField(new Blockly.FieldDropdown([
                ["on", "1"],
                ["off", "0"]
            ]),
                "state")
        this.appendDummyInput();
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('');
    }
};

Blockly.Python['horn'] = function (block) {
    var state = block.getFieldValue('state');
    return PYT_SEND + '(' + CMD_BEEP + ',' + state + ',' + CMD_NOPARAM + ')\n';
};

/****************** Math functions ******************/

Blockly.Blocks['map'] = {
    init: function() {
        this.setHelpUrl('http://www.example.com/');
        this.setColour(230);
        this.appendValueInput("x")
            .appendField("map");
        this.appendValueInput("in_min")
            .setCheck("Number")
            .appendField("in_min");
        this.appendValueInput("in_max")
            .setCheck("Number")
            .appendField("in_max");
        this.appendValueInput("out_min")
            .setCheck("Number")
            .appendField("out_min");
        this.appendValueInput("out_max")
            .setCheck("Number")
            .appendField("out_max");
        this.setOutput(true,"Number");
        this.setTooltip('');
    }
};
Blockly.Python['map'] = function(block) {
    var x = Blockly.Python.valueToCode(block, 'x', Blockly.Python.ORDER_ATOMIC);
    var in_min = Blockly.Python.valueToCode(block, 'in_min', Blockly.Python.ORDER_ATOMIC);
    var in_max = Blockly.Python.valueToCode(block, 'in_max', Blockly.Python.ORDER_ATOMIC);
    var out_min = Blockly.Python.valueToCode(block, 'out_min', Blockly.Python.ORDER_ATOMIC);
    var out_max = Blockly.Python.valueToCode(block, 'out_max', Blockly.Python.ORDER_ATOMIC);
    var res = PYT_MAP + "("+x+","+in_min+","+in_max+","+out_min+","+out_max+")\n";
    return [res, Blockly.Python.ORDER_FUNCTION_CALL];
};



Blockly.Blocks['toInt'] = {
    init: function() {
        this.setHelpUrl('http://www.example.com/');
        this.setColour(230);
        this.appendValueInput("x")
            .appendField("Round to Integer");
        this.setOutput(true,"Number");
        this.setTooltip('');
    }
};
Blockly.Python['toInt'] = function (block) {
    var x = Blockly.Python.valueToCode(block, 'x', Blockly.Python.ORDER_ATOMIC);
    var res =  "int(round(" +x+"))\n";

    return [res, Blockly.Python.ORDER_FUNCTION_CALL];
};