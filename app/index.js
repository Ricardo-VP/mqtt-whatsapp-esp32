import { mqttClient } from './mqtt.js'
import { whatsapp } from './whatsapp.js'

whatsapp.on('message_create', (message) => {
  console.log(`Message received: <<${message.body}>>`)

  if (message.body === '/ledOn') {
    mqttClient.publish('esp32/led', '/ledOn')

    whatsapp.sendMessage(message.from, 'Led: ON')
  }

  if (message.body === '/ledOff') {
    mqttClient.publish('esp32/led', '/ledOff')

    whatsapp.sendMessage(message.from, 'Led: OFF')
  }
})
