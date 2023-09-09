import { useDispatch, useSelector } from "react-redux";
import { useChat } from "../context/ChatProvider";
import useMessages from "./useMessages";
import { setChats } from "state";


const useChatActions = () => {
    const messages = useMessages();

    const {socket} = useChat();
    const dispatch = useDispatch()
    const userName = useSelector((state) => state.user.firstName) + " " + useSelector((state) => state.user.lastName)
    console.log(userName)
    var currentRoomId = useSelector((state) => state.chatData.currentChat)
    if (currentRoomId != null) {
        currentRoomId = currentRoomId._id
    }

    const joinRoom = (roomID) => {
        socket.emit('join-room', {userName, roomID, currentRoomId });
    }

    const leaveRoom = (roomID) => {
        socket.emit('leave-room', {roomID, userName});
    }

    const sendMessage = (text, roomID, userName) => {
        if(!text) {
            return;
        }
                
        socket.emit('send-message', { text, roomID, userName });
    }

    return {
        joinRoom,
        sendMessage,
        leaveRoom
    }
};

export default useChatActions;