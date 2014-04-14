Blockly.Blocks['move_motor'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Set")
            .appendField(new Blockly.FieldDropdown([
                ["left", CMD_LEFT_MOTOR.toString()],
                ["right", CMD_RIGHT_MOTOR.toString()],
                ["both", CMD_BOTH_MOTORS.toString() ]
            ]),
                "motor")
            .appendField("motor speed at");
        this.appendValueInput("speed")
            .setCheck("Number");
        this.appendDummyInput()
            .appendField("%");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Speed should be between -100% and 100%. Numbers outside [-100,+100] are allowed but dangerous!');
    }
};

Blockly.Python['move_motor'] = function (block) {
    var cmd = block.getFieldValue('motor');
    var p1 = Math.round(map(Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC), 0, 100, 0, 255));

    return PYT_SEND + '(' + cmd + ',' + p1 + ',' + CMD_NOPARAM + ')\n';
};



Blockly.Blocks['move_fwd'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Set")
            .appendField(new Blockly.FieldDropdown([
                ["left", CMD_LEFT_MOTOR.toString()],
                ["right", CMD_RIGHT_MOTOR.toString()],
                ["both", CMD_BOTH_MOTORS.toString() ]
            ]),
                "motor")
            .appendField("motor speed at");
        this.appendValueInput("speed")
            .setCheck("Number");
        this.appendDummyInput()
            .appendField("%");
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('Speed should be between -100% and 100%. Numbers outside [-100,+100] are allowed but dangerous!');
    }
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
    return [PYT_RECEIVE + '(' + CMD_SONAR + ',' + CMD_NOPARAM + ',' + CMD_NOPARAM + ')', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['read_infrared'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Read infrared")
            .appendField(new Blockly.FieldDropdown(
                [
                    ["1 (Front-left)", "1"],
                    ["2", "2"],
                    ["3", "3"],
                    ["4", "4"],
                    ["5", "5"],
                    ["6 (Front-middle)", "6"],
                    ["7 (Front-middle)", "7"],
                    ["8", "8"],
                    ["9", "9"],
                    ["10", "10"],
                    ["11", "11"],
                    ["12 (Front-right)", "12"],

                    ["13 (Middle-left)", "13"],
                    ["14", "14"],
                    ["15", "15"],
                    ["16", "16"],
                    ["17 (Middle-middle)", "17"],
                    ["18", "18"],
                    ["19", "19"],
                    ["20", "20"],
                    ["21 (Middle-right)", "21"]
                ]),
                "sensor");
        this.setInputsInline(true);
        this.setOutput(true);
        this.setTooltip('');
    }
};

Blockly.Python['read_infrared'] = function (block) {
    return [PYT_RECEIVE + '(' + CMD_INFRA + ',' + block.getFieldValue('sensor') + ',' + CMD_NOPARAM + ')', Blockly.Python.ORDER_FUNCTION_CALL];
};


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



//V2 FUNCTIONS

Blockly.Blocks['move_fwd'] = {
    init: function() {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Move forward")
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

Blockly.Blocks['read_ground'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Read ground");
        this.setInputsInline(true);
        this.setOutput(true, "Number");
        this.setTooltip('');
    }
};

Blockly.Python['read_ground'] = function (block) {
    return [PYT_RECEIVE + '(' + CMD_SENSORS + ',' + CMD_NOPARAM + ',' + CMD_NOPARAM + ')', Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['take_pic'] = {
    init: function () {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Take a picture");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('');
    }
};

Blockly.Python['take_pic'] = function (block) {
    return PYT_SEND + '(' + CMD_PIC + ',' + CMD_NOPARAM + ',' + CMD_NOPARAM + ')\n';
};