import { Server } from '@hocuspocus/server'
import { Logger } from '@hocuspocus/extension-logger'

const server = new Server({
  port: 1234,
  extensions: [
    new Logger(),
  ],
  
  async onConnect(data) {
    console.log(`User connected to room: ${data.documentName}`)
  },

  async onDisconnect(data) {
    console.log(`User disconnected from room: ${data.documentName}`)
  },

  async onLoadDocument(data) {
    console.log(`Document loaded: ${data.documentName}`)
    return data.document
  },

  async onStoreDocument(data) {
    console.log(`Document stored: ${data.documentName}`)
  }
})

server.listen()

console.log('🚀 OmniDesign Collaboration Server running on ws://localhost:1234')
console.log('📝 Ready for real-time design collaboration!')