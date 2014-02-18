Blockly.Blocks['move_motor'] = {
  init: function() {
      this.setHelpUrl('http://www.example.com/');
      this.appendDummyInput()
          .appendField("Set")
          .appendField(new Blockly.FieldDropdown([["left", "left"], ["right", "right"], ["both", "both"]]), "motor")
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

Blockly.Python['move_motor'] = function(block) {
    var value_speed = Blockly.Python.valueToCode(block, 'speed', Blockly.Python.ORDER_ATOMIC);
    var dropdown_motor = block.getFieldValue('motor');
    return 'moveMotor('+dropdown_motor+','+value_speed+')\n';
};

Blockly.Blocks['stop_motors'] = {
    init: function() {
        this.setHelpUrl('http://www.example.com/');
        this.appendDummyInput()
            .appendField("Stop motors");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip('');
    }
};

Blockly.Python['stop_motors'] = function(block) {
    return 'stopMotors()\n';
};


Blockly.Blocks['read_sonar'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.appendDummyInput()
        .appendField("Read sonar");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
    this.setTooltip('');
  }
};

Blockly.Python['read_sonar'] = function(block) {
    var code = 'readSonar()';
    return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};

Blockly.Blocks['read_infrared'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.appendDummyInput()
        .appendField("Read infrared")
        .appendField(new Blockly.FieldDropdown(
		[["1 (Front-left)", "1"], 
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
		["15 (Middle-middle)", "15"],
		["16", "16"],
		["17 (Middle-right", "17"]]), "sensor");
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip('');
  }
};
  
  Blockly.Python['read_infrared'] = function(block) {
  var dropdown_sensor = block.getFieldValue('sensor');
  var code = 'readInfrared('+dropdown_sensor+')';
  return [code, Blockly.Python.ORDER_FUNCTION_CALL];
};