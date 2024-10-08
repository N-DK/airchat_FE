import React, { useEffect, useState, useCallback, useMemo } from 'react';
import FooterChat from '../components/FooterChat';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { FaAngleLeft } from 'react-icons/fa';
import { Avatar } from 'antd';
import MessageChatRoom from '../components/MessageChatRoom';
import {
    connectSocket,
    detailMessage,
    disconnectSocket,
} from '../redux/actions/MessageAction';
import { useDispatch, useSelector } from 'react-redux';
import RecordModal from '../components/RecordModal';
import {
    listenEvent,
    sendMessage,
    removeListener,
} from '../services/socket.service';
import { EMIT_EVENT, LISTEN_EVENT } from '../constants/sockets.constant';
import LoadingSpinner from '../components/LoadingSpinner';
import { getProfileStranger, profile } from '../redux/actions/UserActions';

const ChatRoom = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const { state } = useLocation();
    const { detailMessage: initMessages, loading: loadingMessage } =
        useSelector((state) => state.detailMessage);
    const { userInfo } = useSelector((state) => state.userProfile);
    const { socket, isConnected } = useSelector((state) => state.socket);
    const [minHeight, setMinHeight] = useState('100%');
    const [messages, setMessages] = useState(initMessages);

    useEffect(() => {
        const sortedMessages = initMessages?.sort((a, b) => a?.id - b?.id);
        setMessages(sortedMessages);
    }, [initMessages]);

    useEffect(() => {
        if (!userInfo) dispatch(profile());
        dispatch(connectSocket());
        return () => dispatch(disconnectSocket());
    }, [dispatch]);

    const getMessageIndex = useCallback(
        (__message_) =>
            messages?.findLastIndex(
                (message) => message?.sender_name === __message_.sender,
            ),
        [messages],
    );

    const handleNewMessage = useCallback(
        (message) => {
            console.log('new message', message);

            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    ...messages[getMessageIndex(message)],
                    sender_name: message.sender,
                    message: message.message,
                    id: message.messageID,
                    temp_image: message.temp_image,
                    audio: message.audioPath,
                    video: message.videoPath,
                    number_heart: 0,
                    created_at: Date.now() / 1000,
                    sender_avt: message.avatarw,
                },
            ]);
        },
        [getMessageIndex, messages],
    );

    const handleMessageReadNotification = useCallback((data) => {
        console.log(data);
    }, []);

    const handleMessageDeleteNotification = useCallback((data) => {
        if (data.del != 0) {
            setMessages((prev) => {
                return prev?.filter((message) => message?.id != data?.mess_id);
            });
        } else {
            alert('Xóa không được');
        }
    }, []);

    useEffect(() => {
        const setupSocketListeners = () => {
            if (isConnected && socket?.connected && socket) {
                listenEvent(
                    socket,
                    LISTEN_EVENT.NEW_PRIVATE_MESSAGE,
                    handleNewMessage,
                );
                listenEvent(
                    socket,
                    LISTEN_EVENT.MESSAGE_READ_NOTIFICATION,
                    handleMessageReadNotification,
                );
                listenEvent(
                    socket,
                    LISTEN_EVENT.MESSAGE_DELETE_NOTIFICATION,
                    handleMessageDeleteNotification,
                );
            }
        };

        const cleanupSocketListeners = () => {
            if (socket?.connected && socket) {
                removeListener(
                    socket,
                    LISTEN_EVENT.NEW_PRIVATE_MESSAGE,
                    handleNewMessage,
                );
                removeListener(
                    socket,
                    LISTEN_EVENT.MESSAGE_READ_NOTIFICATION,
                    handleMessageReadNotification,
                );
            }
        };

        if (isConnected && socket && socket?.connected) {
            setupSocketListeners();
        }

        return cleanupSocketListeners;
    }, [
        socket,
        isConnected,
        handleNewMessage,
        handleMessageReadNotification,
        handleMessageDeleteNotification,
    ]);

    useEffect(() => {
        if (id) dispatch(detailMessage(id));
    }, [id, dispatch]);

    useEffect(() => {
        if (messages?.length > 0) {
            const newHeight =
                messages.length <= 5
                    ? `${100 + messages.length * 14}%`
                    : `${100 + messages.length * 11.2}%`;
            setMinHeight(newHeight);
        } else {
            setMinHeight('100%');
        }
    }, [messages]);

    const sendNewMessage = useCallback(
        (message) => {
            const newMessage = message;
            if (socket?.connected) {
                sendMessage(socket, EMIT_EVENT.PRIVATE_MESSAGE, {
                    sender: userInfo?.name,
                    receiver: id,
                    message: newMessage,
                });
                if (userInfo?.id != id) {
                    setMessages((prev) => {
                        // console.log('lastId ', prev?.[prev.length - 1]?.id);
                        return [
                            ...prev,
                            {
                                ...prev?.[
                                    getMessageIndex({ sender: userInfo?.name })
                                ],
                                id: prev?.[prev.length - 1]?.id + 1,
                                sender_id: userInfo?.id,
                                sender_name: userInfo?.name,
                                message: newMessage,
                                number_heart: 0,
                                created_at: Date.now() / 1000,
                                sender_avt: userInfo?.image,
                            },
                        ];
                    });
                }
            }
        },
        [socket, userInfo, id, messages, getMessageIndex],
    );

    const renderMessages = useMemo(() => {
        if (loadingMessage) return <LoadingSpinner />;
        if (messages?.length > 0) {
            return messages.map((message, index) => (
                <MessageChatRoom
                    key={index}
                    position={
                        message?.sender_name === userInfo?.name
                            ? 'left'
                            : 'right'
                    }
                    message={message}
                    setMessages={setMessages}
                />
            ));
        }

        return (
            <div className="rounded-lg dark:bg-darkPrimary bg-white flex items-center justify-end h-[70px] py-3">
                <div className="flex items-center px-3">
                    <div className="mr-2">
                        <p className="dark:text-white text-end text-lg">
                            {userInfo?.name}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400">
                            Record to chat
                        </p>
                    </div>
                    <figure>
                        <Avatar
                            size={38}
                            src={`https://talkie.transtechvietnam.com/${userInfo?.image}`}
                            alt=""
                        />
                    </figure>
                </div>
            </div>
        );
    }, [loadingMessage, messages, userInfo, initMessages]);

    return (
        <div className="relative flex flex-col justify-between h-screen overflow-hidden">
            <div className="overflow-auto scrollbar-none h-screen w-screen dark:bg-dark2Primary">
                <div className="fixed z-50 top-0 left-0 w-full h-[90px] bg-slatePrimary dark:bg-darkPrimary border-b-[1px] border-gray-200 dark:border-dark2Primary">
                    <div className="flex items-center justify-center h-full px-6 md:px-10 relative text-black dark:text-white">
                        <button
                            className="absolute left-6 top-50"
                            onClick={() => navigate(-1)}
                        >
                            <FaAngleLeft className="text-2xl md:text-[22px]" />
                        </button>
                        <h5 className="md:text-2xl">
                            <Avatar
                                size={44}
                                src={`https://talkie.transtechvietnam.com/${state?.user?.image}`}
                            />
                        </h5>
                    </div>
                </div>
                <div className="h-full">
                    <div
                        className="dark:border-dark2Primary dark:bg-dark2Primary bg-slatePrimary pt-[100px] px-4"
                        style={{ minHeight }}
                    >
                        {renderMessages}
                    </div>
                </div>
            </div>
            <RecordModal />
            <FooterChat
                title="messages"
                isPlay={true}
                handleSend={sendNewMessage}
            />
            {/* <button
                onClick={sendNewMessage}
                className="absolute top-[70%] left-4 bg-slate-600"
            >
                SEND MESSAGE
            </button> */}
        </div>
    );
};

export default ChatRoom;
