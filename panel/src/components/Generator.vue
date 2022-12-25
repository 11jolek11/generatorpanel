<script setup>
    import { useGeneratorStore } from "../store/generator"
    import axios from 'axios'

    const props = defineProps({
        id: Number
    })

    const generators = useGeneratorStore()
    const data = generators.register[props.id]


    var new_data = {
        data: {
            source: '',
            channel: '',
            frequency: 0
        },
        MQTT: {
            broker: '',
            port: 0,
            topic: ''
        },
        HTTP: {
            host: '', 
            port: 0
        }
    }

    function start_generator(params) {
        
    }

    function stop_generator(params){

    }

    function status_generator(params) {
        
    }



</script>

<template>
    <div class="item">
            <button>TEXT</button>
            <p>Name: {{ data.config.name }}</p>
            <p>Interface IP: {{ data.config.ip }}</p>
            <p>Port: {{ data.config.port }}</p>
            <p>Interface id: {{ data.config.uuid }}</p>
            <p>Config vector: {{ data.config.config }}</p>
            <button>Delete</button>
            <p></p>
            <button>Status</button>
            <button>Stop</button>
            <div id="" class="common-edit">
                <label for="channel">Channel: </label>
                <input type="text" id="channel" class="_input" v-model="new_data.data.channel"><br><br>
                <label for="frequency">Frequency: </label>
                <input type="number" id="frequency" class="_input" v-model="new_data.data.frequency"><br><br>
                <p>MQTT</p>
                <label for="mqttbroker">Broker adress: </label>
                <input type="text" id="mqttbroker" class="_input" v-model="new_data.MQTT.broker"><br><br>
                <label for="mqttport">Broker port</label>
                <input type="number" id="mqttport" class="_input" v-model="new_data.MQTT.port"><br><br>
                <label for="mqtttopic">Topic to publish on: </label>
                <input type="text" id="mqtttopic" class="_input" v-model="new_data.MQTT.port"><br><br>
                <p>HTTP</p>
                <label for="httphost">Recipient IP adress: </label>
                <input type="text" id="httphost" class="_input" v-model="new_data.HTTP.host"><br><br>
                <label for="httpport">Port: </label>
                <input type="number" id="httpport" class="_input" v-model="new_data.HTTP.port"><br><br>
                <button  type="submit">Send</button>
            </div>
        </div>
</template>