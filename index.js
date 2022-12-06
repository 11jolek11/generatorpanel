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
        const dev = document.getElementById('registerlist');
        // console.log('not doubled');

        // for (i = 0; i < global_register.length; i++){
        //     if (global_register[i].uuid == obj.uuid && global_register[i].uuid == obj.uuid){
        //         delete global_register[i]
        //     }
        // }
        // FIXME: possible problem
        // const element_to_del = document.getElementById(obj.name);
        // element_to_del.remove();
        global_register.push(obj)
        const payload = 
        `<div class="item", id=${obj.name}>\
            <input type="button" value=${obj.name} onclick="exit_generator(this)">Delete</input>\
            <p>Name: ${obj.name}</p><p>Interface IP: ${obj.ip}</p>\
            <p>Port: ${obj.port}</p>\
            <p>Interface id: ${obj.uuid}</p>\
            <p>Config vector: ${obj.config}</p>\
            <input type="button" value=${obj.name} onclick="status_generator(this)">Status</input>\
                <p id="status-${obj.name}"></p>\
            <input type="button" value=${obj.name} onclick="stop_generator(this)">Stop</input>\
            <input type="button" value=${obj.name} onclick="hide(this)">Edit</input>\
            <div id="edit-${obj.name}" class="common-edit">
                <label for="channel">Channel: </label>
                <input type="text" id="channel" class="_input"><br><br>
                <label for="frequency">Frequency: </label>
                <input type="number" id="frequency" class="_input"><br><br>
                <p>MQTT</p>
                <label for="mqttbroker">Broker adress: </label>
                <input type="text" id="mqttbroker" class="_input"><br><br>
                <label for="mqttport">Broker port</label>
                <input type="number" id="mqttport" class="_input"><br><br>
                <label for="mqtttopic">Topic to publish on: </label>
                <input type="text" id="mqtttopic" class="_input"><br><br>
                <p>HTTP</p>
                <label for="httphost">Recipient IP adress: </label>
                <input type="text" id="httphost" class="_input"><br><br>
                <label for="httpport">Port: </label>
                <input type="number" id="httpport" class="_input"><br><br>
                <button type="submit" id="start-${obj.name}" value=${obj.name} onclick="start_generator(this)">Send</button>
            </div>
        </div>`;
        dev.innerHTML += payload;
    } else {
        window.alert("Doubled config");
    };
    }  
}

// <input type="button" id="start-${obj.name}" value=${obj.name} onclick="start_generator(this)">Send</input>

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
            // const element_to_del = document.getElementById(button.value);
            // element_to_del.remove();
            // global_register.splice(i, 1);
            fetch(`http://${element.ip}:${element.port}/${button.value}/stop`, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        }
    // });
 };
}

function exit_generator(button) {
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

function hide(button) {
    for (let i = 0; i < global_register.length; i++){
        const element = global_register[i];
        if (element.name == button.value){
            var x = document.getElementById(`edit-${element.name}`);
            if (x.style.display === "none") {
              x.style.display = "block";
            } else {
              x.style.display = "none";
            }
        }
    }    
}



function start_generator(button){
    let json_parse = {}
    // console.log('1');
    for (let i = 0; i < global_register.length; i++){
        var data_source = '';
        var url = '';
        // console.log('2');
        let temp = [];
        const element = global_register[i];
        // console.log(element.name + ' - ' + button.value);
        if (element.name == button.value){
            console.log('#####');
            console.log(JSON.parse(element.config).data.source);
            console.log('#####');
            data_source = JSON.parse(element.config).data.source;
            // console.log('3');
            url = `http://${element.ip}:${element.port}/${button.value}/start`;
            var targetInput = document.getElementById(`edit-${element.name}`).getElementsByClassName("_input");
            for (i = 0; i < targetInput.length; i++){
                temp.push(targetInput[i].value)
                // console.log(targetInput[i].value);
            }
        }
        console.log(data_source);

        json_parse = {
            data: {
                source: data_source,
                channel: temp[0],
                frequency: temp[1]
            },
            MQTT: {
                broker: temp[2],
                port: temp[3],
                topic: temp[4]
            },
            HTTP: {
                host: temp[5], 
                port: temp[6]
            }
        };
    };
        // json_parse = JSON.parse(str_parse);
        console.log(JSON.stringify(json_parse));
        x = fetch(
            url,
            {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(json_parse)
                // body: str_parse,
              });
    }; 


function start_generator(button){
    let json_parse = {}
    // console.log('1');
    for (let i = 0; i < global_register.length; i++){
        var data_source = '';
        var url = '';
        // console.log('2');
        let temp = [];
        const element = global_register[i];
        // console.log(element.name + ' - ' + button.value);
        if (element.name == button.value){
            console.log('#####');
            console.log(JSON.parse(element.config).data.source);
            console.log('#####');
            data_source = JSON.parse(element.config).data.source;
            // console.log('3');
            url = `http://${element.ip}:${element.port}/${button.value}/start`;
            var targetInput = document.getElementById(`edit-${element.name}`).getElementsByClassName("_input");
            for (i = 0; i < targetInput.length; i++){
                temp.push(targetInput[i].value)
                // console.log(targetInput[i].value);
            }
        }
        console.log(data_source);

        json_parse = {
            data: {
                source: data_source,
                channel: temp[0],
                frequency: temp[1]
            },
            MQTT: {
                broker: temp[2],
                port: temp[3],
                topic: temp[4]
            },
            HTTP: {
                host: temp[5], 
                port: temp[6]
            }
        };
    };
        // json_parse = JSON.parse(str_parse);
        console.log(JSON.stringify(json_parse));
        x = fetch(
            url,
            {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(json_parse)
                // body: str_parse,
              });
    }; 


function first_generator(){
    let ip = document.getElementById('ip').value;
    let port = document.getElementById('port').value;
    let name = document.getElementById('name').value;
    let json_parse = {}
    temp = []
    var targetInput = document.getElementById("command").getElementsByClassName("subfield");

    for (i = 0; i < targetInput.length; i++){
        temp.push(targetInput[i].value);
    }
    // console.log('1');
    // for (let i = 0; i < global_register.length; i++){
        // var data_source = '';
        // var url = '';
        // console.log('2');
        // let temp = [];
        // const element = global_register[i];
        // console.log(element.name + ' - ' + button.value);
        // if (element.name == button.value){
            // console.log('#####');
            // console.log(JSON.parse(element.config).data.source);
            // console.log('#####');
            // data_source = JSON.parse(element.config).data.source;
            // // console.log('3');
            // url = `http://${element.ip}:${element.port}/${button.value}/start`;
            // var targetInput = document.getElementById(`man-edit-${element.name}`).getElementsByClassName("man_input");
            // for (i = 0; i < targetInput.length; i++){
            //     temp.push(targetInput[i].value)
                // console.log(targetInput[i].value);
        //     }
        // }
        json_parse = {
            data: {
                source: temp[0],
                channel: temp[1],
                frequency: temp[2]
            },
            MQTT: {
                broker: temp[2+1],
                port: temp[3+1],
                topic: temp[4+1]
            },
            HTTP: {
                host: temp[5+1], 
                port: temp[6+1]
            }
        };

        var url = `http://${ip}:${port}/${name}/start`;
        // json_parse = JSON.parse(str_parse);
        console.log(JSON.stringify(json_parse));
        x = fetch(
            url,
            {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(json_parse)
                // body: str_parse,
              });
    }; 































// global_register.forEach(element => {
//    for (let i = 0; i < global_register.length; i++){
//        const element = global_register[i];
//        var requestOptions = {
//            method: 'POST',
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

// TODO: zrob panel ktory pozwoli uruchomić po raz pierwszy generator
// TODO: zrób tak aby usuwał duplikujące się panele 
// TODO: przycisk wznów
