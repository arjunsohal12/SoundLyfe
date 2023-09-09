import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    picturePath: String,
    members: {
        type: Array,
        default: []
    },
    messages: {
        type: Array,
        default: []
    }
}, {
    timestamps: true
    }
)



const MessageSchema = mongoose.Schema({
    chatId: {
        type: String
    },
    senderId: {
        type: String
    },
    message: {
        type: String
    }
}, {timestamps: true})

const chatModel = mongoose.model("chat", chatSchema)
const messageModel = mongoose.model("message", MessageSchema)

export  {chatModel, messageModel}
