let global_register = []

function register(){
    let pahoConfig = {
        hostname: "test.mosquitto.org",  //The hostname is the url, under which your FROST-Server resides.
        port: "8081",
        path:'/mqtt',        //The port number is the WebSocket-Port,                            // not (!) the MQTT-Port. This is a Paho characteristic.
        clientId: "11jolek11-panel",    //Should be unique for every of your client connections.
        keepAliveInterval: 0,
        // reconnect:true,
    }
    
    client = new Paho.MQTT.Client(pahoConfig.hostname, Number(pahoConfig.port), pahoConfig.clientId);
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    
    client.connect({
    onSuccess: onConnect
    });
    
    function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("Connected with Server");
    client.subscribe("waitroom459");
    }
    
    function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
        if(confirm('Connection with server broken. Reconnect?')){
            register();
        }
    }
    }
    function onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
    var obj = JSON.parse(message.payloadString);
    message = new Paho.MQTT.Message(obj.uuid);
    message.destinationName = 'transaction_channel';
    client.send(message);
    // console.log(obj);
    // console.log('history');
    // console.log(global_register.slice(-1)[0]);
    // global_register.push(obj);
    // global_register.slice(-1)[0]  obj
    if (JSON.stringify(global_register.slice(-1)[0]) !== JSON.stringify(obj)){
        // console.log('not doubled');
        global_register.push(obj)
        const dev = document.getElementById('registerlist');
        const payload = '<div><p>Name: ' + obj.name + '</p><p>IP: '+ obj.ip +'</p><p>Port: '+ obj.port + '</p><p>Interface id: '+ obj.uuid +'</p><button>Start</button></div>';
        dev.innerHTML += payload;
    };
    

    }  
}

