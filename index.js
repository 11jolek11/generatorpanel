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
        if(confirm('Connection with broker broken. Reconnect?')){
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
        const payload = 
        `<div style="border:thin" class="Item", id=${obj.name}>\
            <p>Name: ${obj.name}</p><p>Interface IP: ${obj.ip}</p>\
            <p>Port: ${obj.port}</p>\
            <p>Interface id: ${obj.uuid}</p>\
            <input type="button" value=${obj.name} onclick="status_generator(this)">Status</input>\
                <p id="status-${obj.name}"></p>\
            <input type="button" value=${obj.name} onclick="stop_generator(this)">Stop</input>\
        </div>`;
        dev.innerHTML += payload;
    };
    }  
}

function stop_generator(button) {
    // global_register.forEach(element => {
    for (let i = 0; i < global_register.length; i++){
        const element = global_register[i];
        var requestOptions = {
            method: 'POST',
            redirect: 'follow',
            // mode: 'no-cors',
          };
        if (element.name == button.value){       
            const element_to_del = document.getElementById(button.value);
            element_to_del.remove();
            global_register.splice(i, 1);
            fetch(`http://${element.ip}:${element.port}/${button.value}/stop`, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        }
    // });
 };
}

function start_generator(){
    
}

function status_generator(button) {

    var requestOptions = {
        method: 'POST',
        redirect: 'follow',
        mode: 'cors',
      };
      
      for (let i = 0; i < global_register.length; i++){
        const element = global_register[i];
        if (element.name == button.value){
        fetch(`http://${element.ip}:${element.port}/${button.value}/status`, requestOptions)
            .then(response => response.json())
            .then(result => {
                tekst_holder = document.getElementById(`status-${element.name}`);
                tekst_holder.innerText = result.status
            })
            .catch(error => console.log('error', error));
        }
    }
}






    // global_register.forEach(element => {
//     for (let i = 0; i < global_register.length; i++){
//         const element = global_register[i];
//         var requestOptions = {
//             method: 'POST',
//             redirect: 'follow',
//             // mode: 'no-cors',
//           };

//         temp = ''
//         if (element.name == button.value){       
//             fetch(`http://${element.ip}:${element.port}/${button.value}/status`, requestOptions)
//                 .then(response => {return response.text()})
//                 .then((jsona) => {console.log(jsona)})
//                 .catch(error => console.log('error', error));
//         }

//     // });
//  };
// }

// TODO: zrob panel ktory pozwoli uruchomić lub zmodyfikować generator 
// TODO: podpiąć button status do backendu