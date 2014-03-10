/**
 * Created by monkey on 26/02/14.
 */


function save(n){

    if (n == null) {
        n = window.prompt("Save as ",'s'+localStorage.length); //navigator.notification.prompt(

        if (n==null) return false;
    }

    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    var xml_text = Blockly.Xml.domToText(xml);
    localStorage.setItem(n,xml_text)


    alert("Saved as "+n)
}

function load(n){

    if (n == null) {
        var text = "Stored files: \n";
        for (var storedName in localStorage) {
            text += storedName + '\n';
            n = storedName;
        }
        text += "Load program name: ";
        n = window.prompt(text,n);

        if (n==null) return false;
    }

    var xml_text = localStorage.getItem(n)
    var xml = Blockly.Xml.textToDom(xml_text);
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
}