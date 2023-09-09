import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useChat } from '../context/ChatProvider';
import useChatActions from '../hooks/useChatActions';
import useDebounce from '../hooks/useDebounce';
import { Description } from '../styled/Description';
import { useDispatch, useSelector } from 'react-redux';
import { setChatData, setChatRoom } from 'state';
import SearchRooms from './SearchRooms';

const RoomListContainer = styled.div`
    --space: 1em;
    --horizontal-space: 2vw;
    class: FriendList

    display: flex;
    flex-direction: column;
    width: 20%;
    height: 100%;
    padding-top: var(--vertical-padding);
    overflow: auto;
    border-top-left-radius: 45px;
    border-bottom-left-radius: 45px;
    color: #fff;
    
    & h3 {
        font-size: 1.2em;
        font-weight: 500;
        padding: 0.9em var(--horizontal-space);
    }

    background: linear-gradient(45deg, purple, mediumpurple, blueviolet);
    background-size: 400% 400%;
    background-position: 300%;
    animation: gradient 3 ease infinite
    
  
  
  @keyframes gradient {
    0% {
      background-position: 0%;
    }
    50% {
      background-position: 100%
    }
    100% {
      background-position: 0%
    }
  }
    @media (max-width: 820px) {
        position: absolute;
        opacity: ${ props => props.open ? '1' : '0'};
        pointer-events: ${ props => props.open ? 'null' : 'none'};
        right: 0;
        width: 100%;
        border-radius: 0;
        z-index: 1;
    }
`;

const RoomItem = styled.li`
    display: flex;
    gap: 1vw;
    width: 100%;
    flex: 1;
    padding: var(--space) var(--horizontal-space);
    list-style: none;
    background: ${ props => props.active ?  'var(--blue-active-color)' : 'transparent'};
    cursor: pointer;
    transition: all .05s;

    &:hover {
        background: var(--blue-active-color);
    }

    & img {
        height: 3vw;
        width: 3vw;
        border-radius: 20px;
        object-fit: cover;
    }

    & div {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    
    & span {
        font-weight: 500;
        font-size: 0.8em;
    }
`;


// Static rooms in the chat
const rooms = [
    {
        id: 1,
        name: 'Dog Lovers 🐶',
        src: './rooms-images/dog-lovers.jpg',
        description: 'A community for dog lovers to share information, photos, experiences, and support each other.'
    },

    {
        id: 2,
        name: 'Developers 💻',
        src: './rooms-images/developers.jpeg',
        description: 'Community for developers, we help each other.'
    },
    
    {
        id: 3,
        name: 'Foodies 🍕',
        src: './rooms-images/foodies.png',
        description: 'A community of people who have a passion for food and love to explore new culinary experiences.'
    },

    {
        id: 4,
        name: 'Bookworms 📚',
        src: './rooms-images/bookworms.png',
        description: 'Those who love to read and immerse themselves in books, and often discuss and share their favorite stories with others'
    },

    {
        id: 5,
        name: 'Movie Buffs 🎬',
        src: './rooms-images/movie-buffs.jpg',
        description: 'A group of individuals who love to engage in outdoor activities such as hiking, camping, and rock climbing'
    },

    {
        id: 6,
        name: 'DIYers 🙌',
        src: './rooms-images/diyers.jpg',
        description: ' People who like to take on home improvement and craft projects, and enjoy working with their hands to create something new and unique'
    },

    {
        id: 7,
        name: 'Fitness Enthusiasts 💪🏽',
        src: './rooms-images/fitness.jpg',
        description: 'Individuals who have a love for films and enjoy watching and discussing different genres, styles, and storylines.'
    }
];

const RoomList = ({ query, isNavOpen, setIsNavOpen }) => {

    const debouncedSearch = useDebounce(query, 350);
    const { joinRoom } = useChatActions();

    const currentRoom = useSelector((state) => state.chatData.currentChat)
    const chats = useSelector((state) => state.chatData.chats)
    const userName = useSelector((state) => state.user.firstName) + " " + useSelector((state) => state.user.lastName)

    const dispatch = useDispatch()

    const filteredChats = useMemo(() => {
        const filter = chats.filter(chat => {
            const includesCaseInsensitive  = {
                name: chat.name.toLowerCase(),
                description: "REPLACE WITH MEMBERS"
            };
    
            const { name, description } = includesCaseInsensitive;
    
            return name.includes(debouncedSearch.toLowerCase()) || description.includes(debouncedSearch.toLowerCase());
        });

        return filter;
    }, [debouncedSearch]);

    const handleRoomClick = (chatId) => {
        if(currentRoom?._id === chatId) {
            return;
        }
        const selectedRoom = chats.find(chat => chat._id === chatId);
        dispatch(setChatRoom({chat: selectedRoom}));
        console.log(chatId)
        
        joinRoom(chatId);

        setIsNavOpen(false);
    }

    return (
        <RoomListContainer open={ isNavOpen }>
            <h3>Chats</h3>

            <ul>
                {   
                    
                    filteredChats.map(chat => {
                        const { _id, name, picturePath} = chat;

                        return (
                            <RoomItem active={ currentRoom?.id === _id } key={ _id } onClick={ () => handleRoomClick(_id) }>
                                <img alt='room-img' src={ picturePath } />

                                <div>
                                    <span>{ name }</span>
                                    <Description color='rgba(254,254,254,0.5)' size='0.7em'>{"Start Chatting!"}</Description>
                                </div>
                            </RoomItem>
                        );
                    })
                }
            </ul>
        </RoomListContainer>
    );
};

export default RoomList;