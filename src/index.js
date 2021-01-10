const path = require("path")
const express = require("express")
const { isObject } = require("util")
const app = express()
const http = require("http").createServer(app)
const socketio = require("socket.io")
const Filter = require("bad-words")
const { generateMessage } = require('../src/utils/message')


const port = process.env.PORT || 3000
const pucblicDirectory = path.join(__dirname,"../public")

app.use(express.static(pucblicDirectory))



const io = socketio(http)





io.on("connection", (socket) => {
    console.log("The user made a connection")

    socket.emit("message", generateMessage("Welcome!"))
    socket.on("sendMessage", (message, callback) => {
        const filter = new Filter()

        if(filter.isProfane(message)){
            return callback("Sorry, no profanity")
        }
        io.emit("message",generateMessage(message))
        callback()
    })

    socket.broadcast.emit("message",generateMessage( "A new user has joined") )

    socket.on("location", (position, ack) => {
        io.emit('locationMessage', `https://google.com/maps?q=${position.latitude},${position.longitude}`)
        ack()
    })

    socket.on("disconnect", ()=> {
        io.emit("message", generateMessage("A user has left"))
    })
   
})



http.listen(port, () => {
    console.log(`the server is running on port ${port}`)
})