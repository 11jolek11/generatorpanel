import * as mqtt from "mqtt";
import { useAgregatorStore } from "../store/agregator";
import { useGeneratorStore } from "../store/generator";


class mqttRegistrator{
    constructor(listen, confirmation, brokerHost, type){
        this.client = mqtt.connect(brokerHost, {clientId: '11jolek11_' + Math.random().toString(16).substring(2, 8), keepalive: 0})
        this.register
        if (type == 'agregator') {
            this.register = useAgregatorStore()
        } else if (type == 'generator') {
            this.register = useGeneratorStore()
        } else {
            throw new Error("Value of type parameter not recognized!")
        }

        // MQTT callbacks
        this.client.on('connect', (connack) => {
            console.log('Connected with broker: ', connack.toString())
            this.client.subscribe(listen)
        })

        this.client.on('error', (error) => {
            console.log(error)
        })

        this.client.on('message', (topic, message, packet) => {
            message = message.toJSON()
            console.log(message)

            this.register.addItem({config: message})

            this.client.publish(confirmation, message.uuid)
        })
    }
}