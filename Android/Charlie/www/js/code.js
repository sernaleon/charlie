
document.addEventListener("deviceready", onDeviceReady, false);


function blocklyLoaded(blockly) {
    // Called once Blockly is fully loaded.
    window.Blockly = blockly;
}

function onDeviceReady() {
    document.getElementById('test').onclick = test;
    document.getElementById('btSend').onclick = sendToRaspi;
    document.getElementById('btSave').onclick = save;
    document.getElementById('btLoad').onclick = load;

    document.addEventListener("backbutton", onBackKeyDown, false);
}

function onBackKeyDown() {
    window.location.href = "index.html";
}


function test() {
    alert(Blockly.Python.workspaceToCode())
}

function save() {
    var n = window.prompt("Save as ", 's' + localStorage.length);
    if (n) {
        var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
        var xml_text = Blockly.Xml.domToText(xml);
        localStorage.setItem(n, xml_text)
        alert("Saved as " + n)
    }
}

function load() {
    var text = "Stored files: \n";
    for (var storedName in localStorage) {
        text += storedName + '\n';
        n = storedName;
    }
    text += "Load program name: ";

    var n = window.prompt(text, n);
    if (n) {
        var xml_text = localStorage.getItem(n)
        var xml = Blockly.Xml.textToDom(xml_text);
        Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
    }
}

function sendToRaspi() {
    var code = Blockly.Python.workspaceToCode()
    var websocket = new WebSocket(WEBHOST);

    websocket.onopen = function (evt) {
        websocket.send(code);
        console.log("sent:\n" + code + '\n');
    };

    websocket.onclose = function (evt) {
        console.log("disconnected\n");
    };

    websocket.onmessage = function (evt) {
        console.log("Received: " + evt.data);
    };

    websocket.onerror = function (evt) {
        websocket.close();
    };
}