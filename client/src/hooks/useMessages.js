import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useChat } from "context/ChatProvider";

const useMessages = () => {

    const {socket} = useChat();
    const currentChat = useSelector((state) => state.chatData.currentChat)
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        console.log("change")

        try {
            socket.on('receive-message', (newMessage) => {
                console.log('received message')
                setMessages((m) => [...m, newMessage]);
            });
    
            return () => {
                socket.off('receive-message');
            }
            
        }
        catch (err) {
            console.log(err + " " +  socket)
        }
        

    }, [socket]);

    useEffect(() => {
        try {
            socket.on('receive-message-history', (messageHistory) => {
                console.log("received message history")
                console.log(messageHistory)
                setMessages((m) => messageHistory);
            });
    
            return () => {
                socket.off('receive-message-history');
            }
            
        }
        catch (err) {
            console.log(err + " " +  socket)
    }
        

    }, [socket]);

    useEffect(() => {
        if (currentChat != null) {
            setMessages(currentChat.messages);
        }
        else {
            setMessages([])
        }
    }, [currentChat])

    return messages;
}

export default useMessages;
