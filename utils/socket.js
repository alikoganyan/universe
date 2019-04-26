import io from 'socket.io-client'
import { store } from '../reducers/store'
const socketServer = 'http://ser.univ.team'
const socketPath = '/socket.io'
export let socket = null

export const connectToSocket = () => {
    socket = io(socketServer, {
        path: socketPath,
        transports: ['polling'],
        secure: true,
        query: {
            token: 'Bearer ' + store.getState().userReducer.auth
        }
    })
    if (socket) {
        socket.on('disconnect', (reason) => {
            if (reason === 'io server disconnect') {
                socket.connect()
            }
        })
        socket.on('connect', () => {
            // console.log('connect')
        })
        socket.on('disconnect', (data) => {
            // console.log('disconnect')
        })
        socket.on('error', (data) => {
            console.log(data)
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