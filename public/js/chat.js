const socket = io()

socket.on("connection", () => {
    console.log("hello")
})

socket.on("countUpdated", (count) => {
    console.log(count)
})


document.querySelector("#increment").addEventListener('click',(e) => {
    e.preventDefault()
    socket.emit("increment")
})