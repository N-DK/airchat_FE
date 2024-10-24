import { Avatar } from 'antd';
import moment from 'moment';
import React, {
    useRef,
    useState,
    useEffect,
    useMemo,
    useCallback,
} from 'react';
import { FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
    listenEvent,
    removeListener,
    sendMessage,
} from '../services/socket.service';
import { EMIT_EVENT, LISTEN_EVENT } from '../constants/sockets.constant';
import ModalDelete from './ModalDelete';
import { setObjectActive } from '../redux/actions/SurfActions';
import { debounce } from 'lodash';

const MessageChatRoom = ({
    position = 'right',
    message,
    setMessages,
    refContainer,
}) => {
    // console.log(message);
    const dispatch = useDispatch();
    const [isVisible, setIsVisible] = useState(false);
    const [statusLike, setStatusLike] = useState(message?.number_heart > 0);
    const [isOpen, setIsOpen] = useState(false);
    const messageRef = useRef(null);
    const { socket, isConnected } = useSelector((state) => state.socket);
    const [initialLoad, setInitialLoad] = useState(true);

    const handleLike = useCallback(() => {
        if (message?.id) {
            sendMessage(socket, EMIT_EVENT.MESSAGE_REACTION, {
                mess_id: message.id,
            });
        }
    }, [socket, message?.id]);

    const handleDeleteMessage = useCallback(() => {
        if (message?.id) {
            sendMessage(socket, EMIT_EVENT.DELETE_MESSAGE, {
                mess_id: message.id,
            });
        }
    }, [socket, message?.id]);

    useEffect(() => {
        setStatusLike(message?.number_heart > 0);
    }, [message?.number_heart]);

    useEffect(() => {
        if (socket && isConnected && socket?.connected) {
            const handleReactionNotification = (data) => {
                if (message?.id == data?.mess_id) {
                    setStatusLike(data?.status);
                }
                setMessages((prev) => {
                    return prev?.map((message) => {
                        if (message?.id == data?.mess_id) {
                            return { ...message, number_heart: data?.n_heart };
                        }
                        return message;
                    });
                });
            };

            listenEvent(
                socket,
                LISTEN_EVENT.MESSAGE_REACTION_NOTIFICATION,
                handleReactionNotification,
            );

            return () => {
                if (socket && socket?.connected) {
                    removeListener(
                        socket,
                        LISTEN_EVENT.MESSAGE_REACTION_NOTIFICATION,
                        handleReactionNotification,
                    );
                }
            };
        }
    }, [socket, isConnected]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            debounce(([entry]) => {
                setIsVisible(entry.isIntersecting);
            }, 200),
            {
                threshold: [0.25],
                rootMargin: `-${Math.max(
                    window.innerHeight * 0.15,
                    100,
                )}px 0px -${Math.max(window.innerHeight * 0.77, 400)}px 0px`,
            },
        );

        if (messageRef.current) {
            observer.observe(messageRef.current);
        }

        return () => {
            if (messageRef.current) {
                observer.unobserve(messageRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!statusLike) setInitialLoad(false);
    }, [statusLike]);

    const messageClasses = useMemo(() => {
        return {
            container: `flex items-start ${
                position === 'right'
                    ? 'justify-start'
                    : 'justify-start flex-row-reverse'
            }`,
            avatar: `${
                position === 'right' ? 'mr-3' : 'ml-3'
            } w-[40px] flex-shrink-0`,
            content: `relative ${
                position === 'right' ? 'mr-10' : 'ml-10'
            } max-w-full w-auto min-w-[130px]`,
            message: `${
                position === 'right' ? 'text-left' : 'text-right'
            } bg-white dark:bg-darkPrimary rounded-lg p-3 transition-all duration-300 ${
                isVisible ? 'shadow-xl scale-[1.1]' : 'shadow-sm'
            } break-words`,
            actions: `absolute items-center bottom-[-22px] ${position}-0 border-[5px] border-slatePrimary dark:border-darkPrimary flex gap-4 bg-white dark:bg-dark2Primary rounded-3xl px-3 py-[3px]`,
        };
    }, [position, isVisible]);

    useEffect(() => {
        if (isVisible) {
            if (navigator.vibrate) {
                navigator.vibrate(100); // Rung 200ms
            } else {
                console.log('Thiết bị không hỗ trợ rung.');
            }
            dispatch(
                setObjectActive({
                    post: message,
                    audio: (() => {
                        let audioSrc = null;

                        if (message?.audio && message?.audio != 0) {
                            if (message.audio.startsWith('blob:')) {
                                audioSrc = message.audio;
                            } else if (message.audio.startsWith('http')) {
                                audioSrc = message.audio;
                            } else {
                                audioSrc = `https://talkie.transtechvietnam.com${message.audio}`;
                            }
                            return new Audio(audioSrc); // Trả về đối tượng Audio
                        }

                        return null; // Trả về null nếu không có audio
                    })(),
                    element: document.getElementById(`message-${message?.id}`),
                    parent: refContainer?.current,
                    bonus: -70,
                }),
            );
        }
    }, [isVisible, refContainer?.current]);

    return (
        <>
            <div
                id={`message-${message?.id}`}
                ref={messageRef}
                className="mb-10 appear-animation"
            >
                <div className={messageClasses.container}>
                    <div className={messageClasses.avatar}>
                        <Avatar
                            size={40}
                            src={`https://talkie.transtechvietnam.com/${message?.sender_avt}`}
                        />
                    </div>
                    <div className="">
                        <div className={messageClasses.content}>
                            <div className={messageClasses.message}>
                                <h5 className="text-sm font-semibold dark:text-white">
                                    {message?.sender_name}
                                    <span className="text-xs text-gray-500 ml-2">
                                        {moment
                                            .unix(message?.created_at)
                                            .fromNow(true)}
                                    </span>
                                </h5>
                                <p className="text-sm whitespace-normal text-wrap dark:text-white">
                                    {message?.message ?? 'Lorem ipsum dolor'}
                                </p>
                                {message?.image && (
                                    <figure className="max-w-full relative my-2">
                                        <Avatar
                                            src={`${
                                                message?.image.includes('blob')
                                                    ? message?.image
                                                    : `https://talkie.transtechvietnam.com/${message?.image}`
                                            } `}
                                            className="min-h-40 h-full w-full object-cover rounded-xl"
                                        />
                                    </figure>
                                )}
                            </div>
                            <div className={messageClasses.actions}>
                                <div
                                    className={`flex items-center text-gray-400`}
                                >
                                    <button
                                        onClick={handleLike}
                                        className={`btn heart ${
                                            statusLike
                                                ? initialLoad
                                                    ? 'initial-active'
                                                    : 'active'
                                                : ''
                                        } flex items-center justify-center text-white text-xl w-10 h-10 text-primary-color rounded-full`}
                                    ></button>
                                    <span className="ml-1.5 text-sm font-medium">
                                        {message?.number_heart ?? 0}
                                    </span>
                                </div>
                                {position === 'left' && (
                                    <div
                                        onClick={() => setIsOpen(true)}
                                        className="flex items-center text-gray-400"
                                    >
                                        <FaTrash />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ModalDelete
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                handle={handleDeleteMessage}
                title="TITLE_DELETE_MESSAGE"
                subTitle="SUBTITLE_DELETE_MESSAGE"
            />
        </>
    );
};

export default React.memo(MessageChatRoom);
