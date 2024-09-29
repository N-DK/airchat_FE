import { Avatar } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import { FaRegHeart, FaTrash } from 'react-icons/fa';

const MessageChatRoom = ({ position = 'right', message }) => {
    const [isVisible, setIsVisible] = useState(false);
    const messageRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.5,
                rootMargin: '-90px 0px -710px 0px',
            },
        );

        if (messageRef?.current) {
            observer.observe(messageRef?.current);
        }

        return () => {
            if (messageRef?.current) {
                observer.unobserve(messageRef?.current);
            }
        };
    }, []);

    return (
        <div ref={messageRef} className="mb-10">
            <div
                className={`flex items-start ${
                    position === 'right'
                        ? 'justify-start'
                        : 'justify-start flex-row-reverse'
                }`}
            >
                <div
                    className={`${
                        position === 'right' ? 'mr-3' : 'ml-3'
                    } w-[40px] flex-shrink-0`}
                >
                    <Avatar size={40} src={message?.avatar} />
                </div>
                <div className="">
                    <div
                        className={`relative ${
                            position === 'right' ? 'mr-10' : 'ml-10'
                        } max-w-full w-auto`}
                    >
                        <div
                            className={`${
                                position === 'right'
                                    ? 'text-left'
                                    : 'text-right'
                            } bg-white dark:bg-dark2Primary rounded-lg p-3 transition-all duration-300 ${
                                isVisible
                                    ? 'shadow-xl scale-[1.01]'
                                    : 'shadow-sm'
                            } break-words`}
                        >
                            <h5 className="text-sm font-semibold">
                                {message?.name}
                                <span className={`text-xs text-gray-500 ml-2`}>
                                    {message?.time}
                                </span>
                            </h5>
                            <p className="text-sm whitespace-normal text-wrap">
                                {message?.content ??
                                    'Lorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit ametLorem ipsum dolor sit amet'}
                            </p>
                        </div>
                        <div
                            className={`absolute items-center bottom-[-22px] ${position}-0 border-[5px] border-slatePrimary dark:border-darkPrimary flex gap-4 bg-white dark:bg-dark2Primary rounded-3xl px-3 py-[3px]`}
                        >
                            <div className={`flex items-center text-gray-400`}>
                                <FaRegHeart />
                                <span className="ml-2 text-sm font-medium">
                                    {message?.likeCount}
                                </span>
                            </div>
                            <div className={`flex items-center text-gray-400`}>
                                <FaTrash />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessageChatRoom;
