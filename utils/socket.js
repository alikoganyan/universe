import io from 'socket.io-client'

const socketServer = 'http://192.168.88.239:8000'
const socketPath = ''

export var socket = null

export const connectToSocket = () => {
    socket = io(socketServer, {
        path: socketPath,
        transports: ['polling'],
        secure: true
    })
    if (socket) {
        socket.on('disconnect', (reason) => {
            if (reason === 'io server disconnect') {
                socket.connect()
            }
        })
        socket.on('connect', () => {
            console.log('connect')
        })
        socket.on('disconnect', (data) => {
            console.log('disconnect')
        })
        socket.on('reconnect_attempt', () => {
            socket.io.opts.transports = ['polling']
            // socket.io.opts.transports = ['polling', 'websocket']
        })
    }
}

export const disconnectFromSocket = () => {
    socket.disconnect()
}

// export const addListener = (listener) => {
//     if (socket) {
//         let f = Object.keys(listener)
//         listeners.push(f)
//         socket.on(f[0], message => {
//             listener[f](message)
//         })
//     }
// }