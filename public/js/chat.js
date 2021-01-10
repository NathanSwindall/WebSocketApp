const socket = io()


//Elements
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector("#send-location")
const $messages = document.querySelector("#messages")

//template
const messageTemplate = document.querySelector("#message-template").innerHTML // grabs innerHtml
const locationTemplate = document.querySelector("#location-template").innerHTML




$messageForm.addEventListener("submit", (e) => {
    e.preventDefault()

    // disable the button
    $messageFormButton.setAttribute("disabled", true) // " you can put a string because strings are truthy"

    const message = e.target.elements.message_input.value
    socket.emit("sendMessage", message, (error) => {
        $messageFormButton.removeAttribute("disabled")
        $messageFormInput.value = ""
        $messageFormInput.focus()
        if(error){
            console.log("Sorry, no profanity please!")
        }
    })

})

$sendLocationButton.addEventListener('click', (e) => {
    e.preventDefault()

    if(!navigator.geolocation){
        return alert("Can't share location!")
    }
    $sendLocationButton.setAttribute("diabled", true)

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit("location", {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log("Location was shared")
            $sendLocationButton.removeAttribute("disabled")
        })
    })
})



socket.on("message", (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm a")
    })
    $messages.insertAdjacentHTML('beforeend', html)
})


socket.on("locationMessage", (url) => {
    const urlHtml = Mustache.render(locationTemplate, {
        url
    })
    $messages.insertAdjacentHTML('beforeend', urlHtml)


})


