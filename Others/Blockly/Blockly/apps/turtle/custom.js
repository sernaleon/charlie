Blockly.Blocks['draw_moveto'] = {
  // move turtle to absolute x,y location
  // for reference 0,0 is top/let and 200,200 is centre
  init: function() {
    this.setHelpUrl('');
    this.setColour(160);
    this.appendDummyInput()
        .appendField(BlocklyApps.getMsg('Turtle_moveTo'));
    this.appendValueInput("XPOS")
        .setCheck("Number")
        .appendField("x");
    this.appendValueInput("YPOS")
        .setCheck("Number")
        .appendField("y");
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(BlocklyApps.getMsg('Turtle_moveToTooltip'));
  }
};

Blockly.JavaScript['draw_moveto'] = function(block) {
  // Generate JavaScript for moving to absolute position
  var xpos = Blockly.JavaScript.valueToCode(block, 'XPOS', Blockly.JavaScript.ORDER_NONE) || '0';
  var ypos = Blockly.JavaScript.valueToCode(block, 'YPOS', Blockly.JavaScript.ORDER_NONE) || '0';
  return 'Turtle.moveTo(' + xpos + ',' + ypos + ', \'block_id_' + block.id + '\');\n';
};