const rooms = []

const removeRoom = (room) => {
    roomToDelete = rooms.findIndex((roomsItem) => {
        return roomsItem === room
    })

    rooms.splice(roomToDelete, 1)
}

const addRoom = (room) => {
room = room.trim().toLowerCase()

if (!room) {
    return {
        error: 'Room is required'
    }
}

const existingRoom = rooms.find((roomsItem) => {
    return roomsItem === room
})

if (existingRoom) {
    return {
        error: 'Room is duplicate'
    }
}

rooms.push(room)

}

module.exports = {
    addRoom, removeRoom, rooms
}

