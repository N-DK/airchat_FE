import React, {
    useEffect,
    useState,
    useCallback,
    useMemo,
    useRef,
    useContext,
} from 'react';
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
import { LANGUAGE } from '../constants/language.constant';
import { AppContext } from '../AppContext';
import ScreenFull from '../components/ScreenFull';

const ChatRoom = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { id } = useParams();
    const { state } = useLocation();
    const { detailMessage: initMessages, loading: loadingMessage } =
        useSelector((state) => state.detailMessage);
    const { userInfo } = useSelector((state) => state.userProfile);
    const { socket, isConnected } = useSelector((state) => state.socket);
    const [isTurnOnCamera, setIsTurnOnCamera] = useState(false);
    const [messages, setMessages] = useState(initMessages);
    const refContainer = useRef(null);
    const { language } = useSelector((state) => state.userLanguage);
    const { isFullScreen, newMessageFromFooter } = useContext(AppContext);

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

            sendMessage(socket, EMIT_EVENT.MESSAGE_READ, {
                messageId: [message?.messageID],
            });

            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    ...messages[getMessageIndex(message)],
                    sender_name: message.sender,
                    message: message.message,
                    id: message.messageID,
                    image: message.temp_image,
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

    const convertBase64ToBlob = (base64, mimeType) => {
        const base64Data = base64.slice(base64.indexOf('base64,') + 7);

        const byteCharacters = atob(base64Data);

        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: mimeType });
    };

    const convertObjectURL = (selectedFile) => {
        return selectedFile ? URL.createObjectURL(selectedFile) : null;
    };

    const sendNewMessage = useCallback(
        (message, base64, file) => {
            const media = base64.includes('video')
                ? { video: base64 }
                : { audio: base64 };

            const newMessage = message;

            if (socket?.connected) {
                console.log('payload', {
                    sender: userInfo?.name,
                    receiver: id,
                    message: newMessage,
                    image: file,
                    ...media,
                });
                let messageId = null;
                sendMessage(socket, EMIT_EVENT.PRIVATE_MESSAGE, {
                    sender: userInfo?.name,
                    receiver: id,
                    message: newMessage,
                    image: file,
                    ...media,
                });
                if (userInfo?.id != id) {
                    setMessages((prev) => {
                        const blob = convertBase64ToBlob(
                            base64,
                            base64.includes('video')
                                ? 'video/mp4'
                                : 'audio/mp3',
                        );

                        const urlMedia = convertObjectURL(blob);
                        messageId = prev?.[prev.length - 1]?.id + 1;
                        return [
                            ...prev,
                            {
                                ...prev?.[
                                    getMessageIndex({ sender: userInfo?.name })
                                ],
                                id: messageId,
                                sender_id: userInfo?.id,
                                sender_name: userInfo?.name,
                                message: newMessage,
                                number_heart: 0,
                                created_at: Date.now() / 1000,
                                sender_avt: userInfo?.image,
                                audio: !base64.includes('video')
                                    ? urlMedia
                                    : null,
                                image: file,
                                video: base64.includes('video')
                                    ? urlMedia
                                    : null,
                            },
                        ];
                    });
                    sendMessage(socket, EMIT_EVENT.MESSAGE_READ, {
                        messageId: [messageId],
                    });
                }
            }
        },
        [socket, userInfo, id, messages, getMessageIndex],
    );

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
        if (id) {
            dispatch(detailMessage(id));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (refContainer.current && messages?.length > 0) {
            refContainer.current.scrollTop =
                refContainer.current.scrollHeight - 1000;
        }
    }, [refContainer, messages]);

    const renderMessages = useMemo(() => {
        if (loadingMessage) return <LoadingSpinner />;
        if (messages?.length > 0) {
            return (
                <div className="appear-animation">
                    {messages.map((message, index) => (
                        <MessageChatRoom
                            key={index}
                            position={
                                message?.sender_name === userInfo?.name
                                    ? 'left'
                                    : 'right'
                            }
                            message={message}
                            setMessages={setMessages}
                            refContainer={refContainer}
                        />
                    ))}
                    {isTurnOnCamera && (
                        <MessageChatRoom
                            position={'left'}
                            message={{
                                sender_name: userInfo?.name,
                                message: newMessageFromFooter,
                                sender_avt: userInfo?.image,
                                created_at: Date.now() / 1000,
                                isTurnOnCamera: true,
                            }}
                        />
                    )}
                </div>
            );
        } else if (!loadingMessage && messages?.length === 0) {
            return (
                <div className="rounded-lg dark:bg-darkPrimary bg-slatePrimary flex items-center justify-end h-[70px] py-3">
                    <div className="flex items-center px-3">
                        <div className="mr-2 bg-slatePrimary dark:bg-darkPrimary">
                            <p className="dark:text-white text-end text-lg">
                                {userInfo?.name}
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                                {LANGUAGE[language].RECORD_TO_CHAT}
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
        }
    }, [
        loadingMessage,
        messages,
        userInfo,
        initMessages,
        isTurnOnCamera,
        newMessageFromFooter,
    ]);

    return (
        <div className="relative flex flex-col justify-between h-screen  overflow-hidden">
            <div
                ref={refContainer}
                className="overflow-auto scrollbar-none h-screen w-screen pb-[640px] dark:bg-dark2Primary"
            >
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
                <div className="">
                    <div className="dark:border-dark2Primary dark:bg-dark2Primary pt-[100px] px-4">
                        {renderMessages}
                    </div>
                </div>
            </div>
            <RecordModal handle={sendNewMessage} />
            {isFullScreen && <ScreenFull postsList={messages} />}
            <FooterChat
                title="messages"
                isPlay={true}
                handleSend={sendNewMessage}
                setIsTurnOnCamera={setIsTurnOnCamera}
                isInChatRoom={true}
            />
            {/* <button
                onClick={() => {
                    console.log('alo');
                    sendNewMessage(
                        'ALO',
                        'blob:http://localhost:5173/5cfc239d-ebed-4737-9d18-7ea47a5cfe90',
                    );
                }}
                className="absolute top-[70%] left-4 bg-slate-600"
            >
                SEND MESSAGE
            </button> */}
        </div>
    );
};

export default ChatRoom;
