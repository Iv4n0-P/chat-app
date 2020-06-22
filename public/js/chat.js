const socket = io()

//selected DOM elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


//options
const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoscroll = () => {
    //New Message Element
    const $newMessage = $messages.lastElementChild

    //Height of the new Message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //Visible height
    const visibleHeight = $messages.offsetHeight //visina scrool pointera tj. visina onoga što vidimo trenutno

    //Height of the the container
    const containerHeight = $messages.scrollHeight //visina kompletnog chat message boxa

    //How far have i scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight //koliko je scroola-o od vrha do kraja pointera

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

socket.on('message', ({username, message, createdAt}) => {
    const html = Mustache.render(messageTemplate, {username, message, createdAt: moment(createdAt).format('h:mm a')})
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationMessageTemplate, {username: message.username, url: message.url, createdAt: moment(message.createdAt).format('h:mm a')})
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log('Message delivered')
    })
})

$sendLocationButton.addEventListener('click', () => {
    $sendLocationButton.setAttribute('disabled', 'disabled')
   
    if(!navigator.geolocation) { //ovo će provjerit jeli browser podržava ovo, noviji browseri svi podržavaju ali moramo defenzivno programirat pa napravit ovu provjeru. Ako navigator.geolocation postoji znači da podržava
        return alert('Geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position) => { //ovo je asinkrono ali ne podržava promise api pa moramo prosljedit callback funkciju koja će se izvršit nakon što se dohvati lokacija
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('Location shared')
            $sendLocationButton.removeAttribute('disabled')
        })
    })
})