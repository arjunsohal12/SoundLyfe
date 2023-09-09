import mongoose from "mongoose";
import {MongoClient, ObjectId} from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
await client.connect();


const getMessages = async (objectId) => {

    const db = client.db();
    const chats = db.collection('chats');

    const query = { _id: new ObjectId(objectId) };
    const chat = await chats.findOne(query);
    return chat.messages
}

const uploadMessages = async (objectId, messages) => {
    const db = client.db();
    const chats = db.collection('chats');
    
    const query = { _id: new ObjectId(objectId) };
    const update = {$set: {messages: messages}};

    chats.updateOne(query, update);
}

  
export {getMessages, uploadMessages}