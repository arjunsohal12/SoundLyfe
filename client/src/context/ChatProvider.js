import React, { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const useChat = () => {
    return useContext(ChatContext);
}

export const ChatProvider = ({ children }) => {

    const [socket, setSocket] = useState(null);
    
    const value = {
        socket,
        setSocket
    };
    
    return (
        <ChatContext.Provider value={ value }>
            { children }
        </ChatContext.Provider>
    );
};

