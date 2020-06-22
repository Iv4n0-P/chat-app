const users = []

const addUser = ({ id, username, room }) => {
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    //Check for duplicate
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username //provjerit će jeli u istoj sobi, jer je dopušteno da mogu imat isto ime u različitim sobama
    })

    //Validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    //Store user
    const user = { id, username, room }
    users.push(user)
    return {user}
}

const removeUser = (id) => {
    const index = users.findIndex((user) => { //index je sad broj, -1 ako nije pronađen, 0 ili veći ako je pronađen
        return user.id === id
    })

    if (index !== -1) {
        //ako ga je naša onda ćemo splicat array, splice-u prosljedimo index itema koje režemo iz arraya i za koliko mjesta režemo
        return users.splice(index, 1)[0] //znači vratilo bi array a zbog [0] će vratit samo prvi itme tog array, prvi objekt u ovom slučaju
    }
    users.slice()
    //mogli smo koristit i filter ali on nebi stao radit dok ne izvrti cijeli array a findIndex će stat čim nađe prvi

}

//get user
const getUser = (id) => {
    return users.find((user) => {
        return user.id === id
    })
}
//get users in room
const getUsersInRoom = (room) => {
   return users.filter((user) => {
        return user.room === room
    })
}

module.exports = {
    addUser, removeUser, getUser, getUsersInRoom
}


