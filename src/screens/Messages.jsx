import { IoSearch } from 'react-icons/io5';
import FooterChat from './../components/FooterChat';
import { HiOutlineUserAdd } from 'react-icons/hi';
import icon from '../assets/Untitled-2.png';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useContext, useEffect, useState } from 'react';
import { POST_LIST_RESET } from '../redux/constants/PostConstants';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    connectSocket,
    disconnectSocket,
    listMessageRecent,
} from '../redux/actions/MessageAction';
import { Avatar } from 'antd';
import moment from 'moment';
import LoaderSkeletonPosts from '../components/LoaderSkeletonPosts';
import DrawerNewDirect from '../components/DrawerNewDirect';
import { AppContext } from '../AppContext';
import { EMIT_EVENT, LISTEN_EVENT } from '../constants/sockets.constant';
import {
    listenEvent,
    removeListener,
    sendMessage,
} from '../services/socket.service';
import { profile } from '../redux/actions/UserActions';

const MessageItem = React.memo(({ message, handle, isOther }) => {
    const isUnread = !message?.status;
    return (
        <div
            onClick={handle}
            className="flex items-center py-3 w-full relative"
        >
            <Avatar
                src={`https://talkie.transtechvietnam.com/${
                    isOther ? message?.sender_avatar : message?.receiver_avatar
                }`}
                className="w-11 h-11 object-cover rounded-full mr-2"
                alt=""
            />
            <div>
                <p className="text-black dark:text-white">
                    <span className={isUnread ? 'font-semibold' : ''}>
                        {isOther
                            ? message?.sender_name
                            : message?.receiver_name}
                    </span>
                    <span className="text-gray-500 ml-2 text-sm">
                        {moment.unix(message?.created_at).fromNow(true)}
                    </span>
                </p>
                <p
                    className={
                        isUnread
                            ? 'font-semibold dark:text-white'
                            : 'text-gray-500'
                    }
                >
                    {!isOther && 'You: '} {message?.message}
                </p>
            </div>
            {isUnread && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-bluePrimary w-3 h-3" />
            )}
        </div>
    );
});

const MessageItemEmpty = () => (
    <div className="flex flex-col items-center justify-center mt-14">
        <h5 className="text-black dark:text-gray-300">No Direct Messages</h5>
        <span className="text-[16px] text-gray-500 text-center">
            You can start a private conversation with anyone that follows you
        </span>
    </div>
);

export default function Messages() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        listMessageRecent: messages_recent,
        loading: loading_messages_recent,
    } = useSelector((state) => state.listMessageRecent);
    const { userInfo } = useSelector((state) => state.userProfile);
    const { showDrawerNewDirect, toggleShowDrawerNewDirect } =
        useContext(AppContext);
    const { socket, isConnected } = useSelector((state) => state.socket);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMessages, setFilteredMessages] = useState([]);

    const handleReadMessage = useCallback(
        (message) => {
            if (isConnected && socket && socket.connected) {
                sendMessage(socket, EMIT_EVENT.MESSAGE_READ, {
                    messageId: [message.message_id],
                });
            }
            const recipientId =
                message?.friend_id_1 !== message?.friend_id_2
                    ? userInfo?.id === message?.friend_id_1
                        ? message?.friend_id_2
                        : message?.friend_id_1
                    : message?.friend_id_1;

            navigate(`/messages/t/${recipientId}`, {
                state: {
                    user: {
                        image:
                            message?.receiver_id === userInfo?.id
                                ? message?.sender_avatar
                                : message?.receiver_avatar,
                    },
                },
            });
        },
        [isConnected, socket, navigate, userInfo?.id, socket?.connected],
    );

    useEffect(() => {
        dispatch({ type: POST_LIST_RESET });
        dispatch(listMessageRecent());
    }, [dispatch]);

    const handleNewMessage = useCallback(
        (data) => {
            if (data) {
                const oldMessageRecent = filteredMessages.find(
                    (message) =>
                        message.friend_id_1 === data.sender_id ||
                        message.friend_id_2 === data.sender_id,
                );

                const newMessageRecent = {
                    ...oldMessageRecent,
                    message: data.message,
                    friend_id_1: data.sender_id,
                    receiver_id:
                        data.sender_id === oldMessageRecent.friend_id_1
                            ? oldMessageRecent.friend_id_2
                            : oldMessageRecent.friend_id_1,
                    receiver_avatar:
                        data.sender_id === oldMessageRecent.friend_id_1
                            ? oldMessageRecent.receiver_avatar
                            : oldMessageRecent.sender_avatar,
                    message_id: data.messageID,
                    created_at: Date.now() / 1000,
                    status: 0,
                };
                const newFilteredMessages = filteredMessages.filter(
                    (message) =>
                        message.friend_id_1 !== data.sender_id &&
                        message.friend_id_2 !== data.sender_id,
                );
                setFilteredMessages([newMessageRecent, ...newFilteredMessages]);
            }
        },
        [filteredMessages, setFilteredMessages],
    );

    useEffect(() => {
        const setupSocketListeners = () => {
            if (isConnected && socket?.connected && socket) {
                listenEvent(
                    socket,
                    LISTEN_EVENT.NEW_PRIVATE_MESSAGE,
                    handleNewMessage,
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
            }
        };

        if (isConnected && socket && socket?.connected) {
            setupSocketListeners();
        }

        return cleanupSocketListeners;
    }, [socket, isConnected, handleNewMessage]);

    useEffect(() => {
        if (!userInfo) dispatch(profile());
        dispatch(connectSocket());
        return () => dispatch(disconnectSocket());
    }, [dispatch]);

    useEffect(() => {
        if (messages_recent) {
            setFilteredMessages(
                messages_recent?.filter(
                    (message) =>
                        message?.sender_name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) &&
                        message?.friend_id_2 !== message?.friend_id_1,
                ),
            );
        }
    }, [messages_recent]);

    return (
        <div className="relative flex flex-col justify-between h-screen bg-white dark:bg-dark2Primary overflow-hidden">
            <div className="flex flex-col gap-8 items-center pt-12 px-5 dark:bg-darkPrimary border-b-[1px] border-gray-200 pb-6">
                <div className="w-full relative">
                    <h5 className="col-span-2 text-center text-black dark:text-white">
                        Direct Messages
                    </h5>
                    <button
                        onClick={toggleShowDrawerNewDirect}
                        className="col-span-1 absolute right-0 top-0 mr-5 flex justify-end"
                    >
                        <HiOutlineUserAdd
                            size="1.5rem"
                            className="text-black dark:text-white"
                        />
                    </button>
                </div>

                <div className="flex gap-3 bg-grayPrimary dark:bg-dark2Primary items-center w-full rounded-full px-6 py-3">
                    <IoSearch size="1.5rem" className="text-gray-500 m-0 p-0" />
                    <input
                        className="bg-inherit w-3/5 border-none outline-none text-[17px] text-black dark:text-white placeholder-gray-500"
                        placeholder="Search Conversations"
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="px-5 absolute left-0 top-[200px] w-full overflow-y-auto">
                <div
                    onClick={() =>
                        navigate(`/messages/t/${userInfo?.id}`, {
                            state: {
                                user: userInfo,
                            },
                        })
                    }
                    className="flex items-center gap-3 cursor-pointer"
                >
                    <img
                        src={icon}
                        className="w-11 h-11 object-cover rounded-full"
                        alt=""
                    />
                    <div>
                        <h5 className="text-black dark:text-gray-300">
                            Note to Self
                        </h5>
                        <span className="text-[16px] text-gray-500">
                            Send a message to yourself
                        </span>
                    </div>
                </div>
                {loading_messages_recent ? (
                    <div className="flex items-center justify-center fixed w-full left-0 mt-4">
                        <LoaderSkeletonPosts />
                    </div>
                ) : filteredMessages?.length > 0 ? (
                    filteredMessages.map((message, index) => (
                        <MessageItem
                            key={index}
                            message={message}
                            handle={() => handleReadMessage(message)}
                            isOther={message?.receiver_id === userInfo?.id}
                        />
                    ))
                ) : (
                    <MessageItemEmpty />
                )}
            </div>

            <DrawerNewDirect />

            <FooterChat title="messages" isSwiping={false} isPlay={false} />
        </div>
    );
}
