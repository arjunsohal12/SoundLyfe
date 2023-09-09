import React from 'react';
import styled from 'styled-components';
import { useChat } from '../context/ChatProvider';
import ChatContainer from './ChatContainer';
import Navbar from 'scenes/navbar';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setChats } from 'state';
import { io } from "socket.io-client";
import useChatActions from 'hooks/useChatActions';

const WrapperContainer = styled.div`
  display: grid;
  height: 100vh;
  place-items: center;
`;

const Wrapper = () => {
    const userName = useSelector((state) => state.user.firstName) + " " + useSelector((state) => state.user.lastName)
    const user = useSelector((state) => state.user)
    const token = useSelector((state) => state.token)
    const chatData = useSelector((state) => state.chatData)
    const { socket, setSocket } = useChat();
    const {joinRoom} = useChatActions()
    const dispatch = useDispatch()

    const getChats = async () => {
        const id = user._id
        const chatIds = user.chatIds
        const response = await fetch(`http://localhost:3001/chats/getChat/${id}`, {
            method: "POST",
            headers: {"Content-Type": "application/json", Authorization: `Bearer ${token}`},
            body: JSON.stringify({chatIds})
        })
        const data = await response.json()
        dispatch(setChats({chats: data}))
        return data
    }

    const handleChatConnects = async () => {

        const socketConnect = io.connect("http://localhost:5000");
        await new Promise((resolve) => socketConnect.on("connect", resolve)); // wait till the socket is connected to proceed
        console.log(socketConnect)
        setSocket(socketConnect);



    }

    const handleRefresh = async () => {
        if (socket == null) {
            await handleChatConnects()
        }
        console.log("refresh")
        await getChats()
    }

    useEffect(() => {
        
        handleRefresh()
    }, [])



    return (
        <WrapperContainer>
            {
                <ChatContainer />
            }
        </WrapperContainer>
    );
};

export default Wrapper;
