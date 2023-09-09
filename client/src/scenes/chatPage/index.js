import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { ChatProvider } from 'context/ChatProvider';
import Wrapper from 'components/Wrapper';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setChatData, setChatRoom, setChats } from 'state';
import { useChat } from 'context/ChatProvider';

const GlobalStyle = createGlobalStyle`
  :root {
    --main-color-dark-palette: #1a1a1a;
    --secondry-color-dark-palette: #373737;
    --blue-button-color: #3c95f4;
    --blue-active-color: #2070c6;
    --blue-gradient: linear-gradient(90deg, #3c95f4 65%, #3385dc 100%);
  }

  * {
    margin: 0;
    padding: 0;
    outline: transparent;
    text-decoration: none;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
  }

  body {
    background: var(--blue-gradient);
  }
`;

const ChatPage = () => {
    const dispatch = useDispatch()
    dispatch(setChatRoom({chat: null}))


    return (
        <>
        <GlobalStyle />
        <ChatProvider>
            <Wrapper padding="0 0 0 1.5rem" />
        </ChatProvider>
        </>
    );
    }

    export default ChatPage;
