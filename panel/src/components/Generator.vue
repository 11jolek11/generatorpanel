<script>

import { ref } from 'vue'
export default {
    setup() {
        return {}
    }
}
</script>

<template>
    <div class="item">
            <input type="button" />
            <p>Name: </p><p>Interface IP: </p>
            <p>Port: </p>
            <p>Interface id: </p>
            <p>Config vector: </p>
            <button>TEXT</button>
                <p ></p>
            <input type="button" />
            <input type="button" />
            <div id="" class="common-edit">
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
                <button type="submit">Send</button>
            </div>
        </div>
</template>