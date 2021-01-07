const path = require("path")
const express = require("express")
const { isObject } = require("util")
const app = express()
const http = require("http").createServer(app)
const socketio = require("socket.io")


const port = process.env.PORT || 3000
const pucblicDirectory = path.join(__dirname,"../public")

app.use(express.static(pucblicDirectory))


// make io connection
const io = socketio(http)
let count = 0


io.on("connection", (socket) => {
    console.log("The user made a connection")
    socket.emit("countUpdated", count)

    socket.on('increment', () => {
        count++
        io.emit("countUpdated", count)
    })
})



http.listen(port, () => {
    console.log(`the server is running on port ${port}`)
})