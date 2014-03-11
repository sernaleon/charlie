/**
 * Created by monkey on 26/02/14.
 */

function sendToRaspi(){
    var code = Blockly.Python.workspaceToCode()
    var websocket = new WebSocket(WEBHOST);

    websocket.onopen = function(evt) {
        console.log("connected\n");
        websocket.send(code);
        console.log("sent:\n" + code + '\n');
        websocket.close();
    };

    websocket.onclose = function(evt) {
        console.log("disconnected\n");
    };

    websocket.onmessage = function(evt) {
        console.log("response:\n" + evt.data + '\n');
    };

    websocket.onerror = function(evt) {
        console.log('error: ' + evt.data + '\n');
        websocket.close();
    };
}