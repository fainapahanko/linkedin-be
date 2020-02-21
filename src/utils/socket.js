const { checkToken } = require('./auth')
const Message = require('../models/messages')

module.exports = {
    configureIO: (io) => {
        io.on('connection', async socket => {
            socket.on("login", (payload) => {
                const token = checkToken(payload.token);
                const username = payload.username
                socket.username =  username
                const connectedUsers = []
                Object.keys(io.sockets.connected).forEach(socketKey => { 
                    if (io.sockets.connected[socketKey].username)
                        connectedUsers.push(io.sockets.connected[socketKey].username)
                })
                socket.emit("login", {
                    newUser: username,
                    connectedUsers: connectedUsers
                })
                socket.broadcast.emit("login", {
                    newUser: username,
                    connectedUsers: connectedUsers
                })
            })

            socket.on('message', message => {
                socket.broadcast.emit("message", message)
                Object.keys(io.sockets.connected).forEach(async key => { 
                    if (message.from === io.sockets.connected[key].username) {
                        await Message.create({
                            from: message.from,
                            to: message.to,
                            text: message.text,
                            created: new Date
                        })
                        io.sockets.connected[key].emit("message", message)
                    }
                })
            })
        })
        // io.on('connection', socket => {
        //     socket.emit('list', () => {

        //     })
        //     socket.on('broadcast', payload => {
        //         console.log("first payload", payload)
        //         socket.broadcast.emit('broadcast', payload)
        //     })
        // })
    }
}