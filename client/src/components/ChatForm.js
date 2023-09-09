import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { IoIosSend } from 'react-icons/io'
import { ButtonContainer } from '../styled/Button';
import useChatActions from '../hooks/useChatActions';
import { useChat } from '../context/ChatProvider';
import { Box, TextField } from '@mui/material';
import { useSelector } from 'react-redux';
const MessageForm = styled.form`
    padding: 0.5vw 0;
    display: flex;
    align-items: center;
    height: 10%;
    border-top: 1px solid rgba(0, 0, 0, 0.08);

    & input {
        flex: 1;
        height: 100%;
        width: 100%;
        border: none;
    }
`;

const ChatForm = () => {
    const inputRef = useRef(null);
    const { sendMessage } = useChatActions();
    const currentRoom = useSelector((state) => state.chatData.currentChat)
    const userName = useSelector((state) => state.user.firstName) + " " + useSelector((state) => state.user.lastName)

    const [message, setMessage] = useState();
    const onSubmit = (e) => {

        e.preventDefault();

        sendMessage(
            message, 
            currentRoom._id, 
            userName
        );
        inputRef.current.value = '';
        inputRef.current.focus();

    }

    return (
        <MessageForm onSubmit={ onSubmit }>
            <input type="text" placeholder="Type a message here" onChange={(e) => setMessage(e.target.value)} ref={ inputRef }/>
            
            <ButtonContainer flex="0" padding="0" active={ true } size="2.2em" borderRadius="50%">
                <button>
                    <IoIosSend fill='#fff'/>
                </button>
            </ButtonContainer>
        </MessageForm>
    );
};

export default ChatForm;