import { Client } from 'whatsapp-web.js'
import qrcode from 'qrcode-terminal'

export const whatsapp = new Client()

whatsapp.on('qr', (qr) => {
  qrcode.generate(qr, { small: true })
})

whatsapp.on('ready', () => {
  console.log('Client is ready!')
})

whatsapp.initialize()
