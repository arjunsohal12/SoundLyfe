import { chatModel } from "../models/chat.js";
import User from "../models/user.js";

const createChat = async (req, res) => {
    try {
        const {name, membersOfChat} = req.body;
        // const imgName = await uploadToS3(req.file);
        // const imgUrl = await getImageURL(imgName);

        const newChat = new chatModel({
            name: name,
            picturePath: "imgUrl",
            members: membersOfChat,
            messages: []
        })


        const result = await newChat.save()
        membersOfChat.forEach( async (member) => {
            const user = await User.findById(member._id)

            user.chatIds.push(result._id) //push the chat id to the list of chats so we can find all the users chats later
            await user.save()
        })
        res.status(200).json(result)
    }

    catch (err) {
        console.log(err)
        res.status(500).json({error: err})
    }
}

const userChats = async (req, res) => {
    try {
        const {id} = req.params;
        const {chatIds} = req.body;

        const chats = await Promise.all(chatIds.map(async (id) => {
            const chat = await chatModel.findById(id)
            return ({_id: chat._id, name: chat.name, picturePath: chat.picturePath, members:chat.members, messages: chat.messages})
        }))
        console.log(chats)
        res.status(200).json({chats: chats})
    }

    catch (err) {
        console.log(err)
        res.status(500).json({error: err})
    }
}


export {userChats, createChat}