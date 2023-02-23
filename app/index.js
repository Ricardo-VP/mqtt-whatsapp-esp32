import { mqttClient } from './mqtt.js'
import { whatsapp } from './whatsapp.js'

const NUMBERS = ['XXXX@c.us', 'XXXX@c.us']

mqttClient.on('message', (topic, message) => {
  console.log(`Message received: <<${message.toString()}>>`)

  if (topic === 'esp32/led') {
    if (message.toString() === 'ALARMA ENCENDIDA') {
      NUMBERS.forEach((number) => {
        whatsapp.sendMessage(number, 'Alarma: ON')
      })
    }

    if (message.toString() === 'sendAlert') {
      NUMBERS.forEach((number) => {
        whatsapp.sendMessage(number, 'Alarma: OFF')
      })
    }
  }
})

whatsapp.on('message', (message) => apagarAlarma(message))

whatsapp.on('message_create', (message) => apagarAlarma(message))

function apagarAlarma(message) {
  console.log(`Message received: <<${message.body}>>`)
  console.log(`From: ${message.from}`)

  if (NUMBERS.includes(message.from)) {
    if (message.body === '/apagar') {
      mqttClient.publish('esp32/led', '/apagar')
    }
  }
}
