import mqtt from 'mqtt'

export const mqttClient = mqtt.connect('mqtt://localhost:1883')

mqttClient.on('connect', () => {
  mqttClient.subscribe('esp32/led', (err) => {
    if (err) {
      return console.log(err)
    }
  })
})

mqttClient.on('error', (err) => {
  console.log(err)
})

mqttClient.on('close', () => {
  console.log('Connection closed!')
})
