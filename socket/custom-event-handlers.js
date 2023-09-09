import {getMessages, uploadMessages} from "./models.js";
import Redis from "redis";
import redisClient from "./server.js";
import crypto from 'crypto'
const rooms = {};
const onlineUsers = {};

const randomID = (bytes) => (crypto.randomBytes(bytes).toString('hex'))

const handleConnection = (socket) => {
    onlineUsers[socket.id] = {};
}

const handleJoinRoom = async (socket, data) => {
    console.log(data)
    const { userName, roomID, currentRoomId } = data;
    // Check if we are already in the room
    const isAlreadyInRoom = await handleAddParticipantToRoom(socket, roomID, userName);
    if(isAlreadyInRoom) {
        return;
    }
    // Leave our current room 
    if (currentRoomId != null) {
        leaveCurrentRoom(socket, userName, currentRoomId);
    }
    socket.join(roomID);


}

const handleLeaveRoom = (socket, data) => {
        console.log("handleLeave")
        console.log(data)
        const {userName, roomID} = data

        leaveCurrentRoom(socket, userName, roomID);
}

const handleSendMessage = async (io, data, socket_id = null) => {
    const { text, roomID, userName } = data;
    console.log("handleSendMessage")
    const formatMessage = {
        author: userName ?? 'BOT',
        socket_id: socket_id ?? null,
        text,
        time: Date.now()
    }
    io.to(roomID).emit('receive-message', formatMessage);
    // log message into redis
    const jsonRoom = await redisClient.get(roomID)
    const room = await JSON.parse(jsonRoom)
    room.messages.push(formatMessage)
    redisClient.set(roomID, JSON.stringify(room))
    console.log(room)
}

const handleSendMessageSingle = (socket, messages) => {
    // Send message to single user, mainly in messaging history once they join
    console.log("sending message history")
    console.log(messages)
    socket.emit('receive-message-history', messages);
}

const handleDisconnect = (socket) => { // we should store socket id with the userID

}

const handleAddParticipantToRoom = async (socket, roomID, userName) => {
    // check cache for pre-existing room

    const roomInfo = await redisClient.get(roomID)
    console.log(roomInfo)
    if (roomInfo != null) { // room is created
        var room = JSON.parse(roomInfo)

        if (room.users.includes(userName)) {
            return true
        }

        else { // add users to room
            room.users.push({userName, socketId: socket.id})
            redisClient.set(roomID, JSON.stringify(room)) 
            // emit pre-existing  messages to user
            console.log("message history:")
            console.log(room.messages)
            handleSendMessageSingle(socket, room.messages)
        }
    }

    else { // Room is not yet created
        await handleCreateRoom(roomID, userName, socket)
    }

    return false

}

const handleCreateRoom = async (roomID, userName, socket) => {
    console.log("createRoom")
    // get previous messages from database
    const messages = await getMessages(roomID)
    console.log(messages)
    const activeUsers = [userName]

    const room = {roomID: roomID, users: activeUsers, messages: messages}
    console.log(room)
    // store in redis
    redisClient.set(roomID, JSON.stringify(room))

    const newRoom = await redisClient.get(roomID)
    console.log(newRoom)
    // emit pre-existing messages to user
    handleSendMessageSingle(socket, room.messages)

}

const leaveCurrentRoom = (socket, userName, roomID) => {


    // Remove user from Redis cache of room session
    removeParticipantFromLists(userName, roomID);
    
    socket.leave(roomID);
}

const removeParticipantFromLists = async (userName, roomID) => {
    // TODO: remove from redis cache room session
    console.log("REMOVING")
    console.log(roomID)
    const data = await redisClient.get(roomID)
    console.log(data)
    const room = await JSON.parse(data)

    const newRoomUsers = room.users.filter((user) => user != userName)
    room.users = newRoomUsers
    console.log(room.users)
    if (newRoomUsers.length !== 0) {
        redisClient.set(roomID, JSON.stringify(room))
    }
    else { // if empty room, remove it
        const messages = room.messages
        console.log("uploading messages:")
        console.log(messages)
        uploadMessages(roomID, messages);
        await redisClient.del(roomID)
        console.log(`removed room with ID: ${roomID}`)
    }

}

const handlejoinListeningParty = async (socket, data) => {
    const {userName, roomID} =  data;

    if (roomID == null) { // room not yet created
        const room = {users: [userName], queue:[], messages:[], currentSong: null}
        const roomID = randomID(16)
        redisClient.set(randomID, room)
    }
    else {
        const room = await redisClient.get(roomID)
        
        if (room == null) {
            
        }

        else {

            if (room.users.includes(userName)) {
                return 
            }

            room.users.push({userName, socketId: socket.id})
            redisClient.set(roomID, JSON.stringify(room)) 

            if (room.currentSong != null) { // if the chat is playing a song already then send the song
                playSong(song)
            }
            handleSendMessageSingle(socket, room.messages)

        }
    }
}

const playSong = async (song) => {

}


export {handleSendMessage, handleJoinRoom, handleLeaveRoom, handleDisconnect, handleConnection, handleCreateRoom, handlejoinListeningParty}