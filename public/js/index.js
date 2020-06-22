const socket = io()
const roomListTemplate = document.querySelector('#room-list-template').innerHTML

socket.on('rooms', (rooms) => {
    if (rooms.length === 0) {
        return
    }
const html = Mustache.render(roomListTemplate, {
        rooms
    })
    document.querySelector('#roomsList').innerHTML = html
})