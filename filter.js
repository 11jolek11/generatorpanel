let filter_global_register = []
// TODO: rename all mqtt topics!!!
// FIXME: find bug

function filter_register(){
    let pahoConfig = {
        hostname: "test.mosquitto.org",  //The hostname is the url, under which your FROST-Server resides.
        port: "8081",
        path:'/mqtt',        //The port number is the WebSocket-Port,                            // not (!) the MQTT-Port. This is a Paho characteristic.
        agr_clientId: "11jolek11-filter",    //Should be unique for every of your client connections.
        keepAliveInterval: 0,
        // reconnect:true,
    }
    

    function agr_onConnect() {
        console.log("Connected with Server");
        agr_client.subscribe("filter_register_8678855");
    }

    agr_client = new Paho.MQTT.Client(pahoConfig.hostname, Number(pahoConfig.port), pahoConfig.agr_clientId);
    agr_client.onConnectionLost = agr_onConnectionLost;
    agr_client.onMessageArrived = agr_onMessageArrived;
    
    agr_client.connect({
    onSuccess: agr_onConnect
    });
    

    
    function agr_onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
        if(confirm('Connection with broker broken. Reconnect?')){
            filter_register();
        }
    }
    }
    function agr_onMessageArrived(message) {
    console.log("onMessageArrived:" + message.payloadString);
    var obj = JSON.parse(message.payloadString);
    message = new Paho.MQTT.Message(obj.uuid);
    message.destinationName = 'goblin-5644';
    agr_client.send(message);
    if (JSON.stringify(filter_global_register.slice(-1)[0]) !== JSON.stringify(obj)){
        const dev = document.getElementById('filter_registerlist');
        filter_global_register.push(obj)
        const payload = 
        `<div style="background-color:green;",  class="filter", id=${obj.uuid}>\
            <input type="button" value=${obj.uuid} onclick="exit_filter(this)">Delete</input>\
            <p>Name: ${obj.uuid}</p><p>filter IP: ${obj.ip}</p>\
            <p>Port: ${obj.port}</p>\
            <p>filter id: ${obj.uuid}</p>\
            <p>Config vector: ${obj.config}</p>\
            <input type="button" value=${obj.uuid} onclick="status_filter(this)">Status</input>\
            <p id="status-${obj.uuid}"></p>\
            <input type="button" value=${obj.uuid} onclick="stop_filter(this)">Stop</input>\
            <input type="button" value=${obj.uuid} onclick="hide_filter(this)">Edit</input>\
            <div id="edit-${obj.uuid}" class="filter-common-edit">

                <label for="channel">Channel: </label>
                <input type="text" id="filter_channel" class="filter_input"><br><br>
                <label for="frequency">Frequency: </label>
                <input type="number" id="filter_frequency" class="filter_input"><br><br>

                <p>MQTT</p>
                <label for="mqttbroker">Broker adress: </label>
                <input type="text" id="filter_mqttbroker" class="filter_input"><br><br>
                <label for="mqttport">Broker port</label>
                <input type="number" id="filter_mqttport" class="filter_input"><br><br>
                <label for="mqtttopic">Topic to publish on: </label>
                <input type="text" id="filter_mqtttopic" class="filter_input"><br><br>
                <label for="filter_mqtt_listen_topic">Topic to listen on: </label>
                <input type="text" id="filter_mqtt_listen_topic" class="filter_input"><br><br>

                <p>HTTP</p>
                <label for="httphost">Recipient IP adress: </label>
                <input type="text" id="filter_httphost" class="filter_input"><br><br>
                <label for="httpport">Port: </label>
                <input type="number" id="filter_httpport" class="filter_input"><br><br>
                <label for="httpath">Path to resource: </label>
                <input type="text" id="filter_httppath" class="filter_input"><br><br>

                <p>Constraints</p>
                <label for="filter_select">Query: </label>
                <input type="text" id="filter_select" class="filter_input"><br><br>

                
                <!-- <button type="submit" id="start-${obj.uuid}" value=${obj.uuid} onclick="start_filter(this)">Send</button> -->
                <button type="submit" id="start-${obj.uuid}" value=${obj.uuid} onclick="change_config_filter(this)">Send</button>
            </div>
        </div>`;
        dev.innerHTML += payload;
    } else {
        window.alert("Doubled config");
    };
    }  
}


function stop_filter(button) {
    for (let i = 0; i < filter_global_register.length; i++){
        const element = filter_global_register[i];
        var requestOptions = {
            method: 'POST',
            redirect: 'follow',
          };
        if (element.uuid == button.value){       

            // fetch(`http://${element.ip}:${element.port}/stop`, requestOptions)
            fetch(`http://${element.ip}:${element.port}/stop`, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        }
 };
}

function exit_filter(button) {
    for (let i = 0; i < filter_global_register.length; i++){
        const element = filter_global_register[i];
        var requestOptions = {
            method: 'POST',
            redirect: 'follow',
          };
        if (element.uuid == button.value){       
            const element_to_del = document.getElementById(button.value);
            element_to_del.remove();
            filter_global_register.splice(i, 1);
            // fetch(`http://${element.ip}:${element.port}/${button.value}/stop`, requestOptions)
            fetch(`http://${element.ip}:${element.port}/stop`, requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        }
 };
}

// Backend not implemented yet
function status_filter(button) {
    var requestOptions = {
        method: 'POST',
        redirect: 'follow',
        mode: 'cors',
      };
      
      for (let i = 0; i < filter_global_register.length; i++){
        const element = filter_global_register[i];
        if (element.uuid == button.value){
        fetch(`http://${element.ip}:${element.port}/status`, requestOptions)
            .then(response => response.json())
            .then(result => {
                tekst_holder = document.getElementById(`status-${element.uuid}`);
                tekst_holder.innerText = result.status
            })
            .catch(error => console.log('error', error));
        }
    }
}

function hide_filter(button) {
    for (let i = 0; i < filter_global_register.length; i++){
        const element = filter_global_register[i];
        if (element.uuid == button.value){
            var x = document.getElementById(`edit-${element.uuid}`);
            if (x.style.display === "none") {
              x.style.display = "block";
            } else {
              x.style.display = "none";
            }
        }
    }    
}



function change_config_filter(button){
    let json_parse = {}
    for (let i = 0; i < filter_global_register.length; i++){
        var data_source = '';
        var url = '';
        let temp = [];
        const element = filter_global_register[i];
        if (element.uuid == button.value){
            console.log('#####');
            console.log(element.config);
            console.log('#####');
            // data_source = JSON.parse(element.config).data.source;
            // data_source = JSON.parse(element.config);
            url = `http://${element.ip}:${element.port}/config`;
            var targetInput = document.getElementById(`edit-${element.uuid}`).getElementsByClassName("filter_input");
            for (i = 0; i < targetInput.length; i++){
                temp.push(targetInput[i].value)
            }
        }
        console.log(data_source);
        console.log(temp);

        json_parse = 
        {
            "method": temp[0],
            "frequency": temp[1],
            "mqtt":{
                "broker": temp[3],
                "broker_port": temp[4],
                "send_topic": temp[5],
                "recive_topic": temp[6]
                },
            "http":{
                "destiantion": temp[7],
                "destiantion_port": temp[8],
                "destiantion_path": temp[9]
                },
            "constraints": {
                "query": temp[10],
                }
            }
    };
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
              });
    }; 


function start_filter(button){
    let json_parse = {}
    for (let i = 0; i < filter_global_register.length; i++){
        var data_source = '';
        var url = '';
        let temp = [];
        const element = filter_global_register[i];
        if (element.uuid == button.value){
            console.log('#####');
            console.log(JSON.parse(element.config).data.source);
            console.log('#####');
            data_source = JSON.parse(element.config).data.source;
            url = `http://${element.ip}:${element.port}/${button.value}/start`;
            var targetInput = document.getElementById(`edit-${element.uuid}`).getElementsByClassName("filter_input");
            for (i = 0; i < targetInput.length; i++){
                temp.push(targetInput[i].value)
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
              });
    }; 
