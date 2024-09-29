import React from 'react';
import FooterChat from '../components/FooterChat';
import { useNavigate } from 'react-router-dom';
import { FaAngleLeft } from 'react-icons/fa';
import { Avatar } from 'antd';
import MessageChatRoom from '../components/MessageChatRoom';

const ChatRoom = () => {
    const navigate = useNavigate();

    return (
        <div>
            <div className="overflow-auto scrollbar-none h-screen w-screen">
                <div className="fixed z-50 top-0 left-0 w-full h-[90px] bg-slatePrimary dark:bg-dark2Primary border-b-[1px] border-gray-200 dark:border-dark2Primary">
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
                                // src={
                                //     userInfo?.image && userInfo?.image !== '0'
                                //         ? `https://talkie.transtechvietnam.com/${userInfo.image}`
                                //         : DEFAULT_PROFILE
                                // }
                            />
                        </h5>
                    </div>
                </div>
                <div className="">
                    <div className="h-full dark:border-dark2Primary bg-slatePrimary pt-[100px] pb-[700px] px-4">
                        {/* <Avatar
                            src={
                                userInfo?.image && userInfo?.image !== '0'
                                    ? `https://talkie.transtechvietnam.com/${userInfo.image}`
                                    : DEFAULT_PROFILE
                            }
                        /> */}
                        {Array.from({ length: 10 }).map((_, index) => (
                            <MessageChatRoom
                                key={index}
                                position={index % 2 === 0 ? 'left' : 'right'}
                                message={{ id: 123 }}
                            />
                        ))}
                    </div>
                </div>
                <FooterChat title="chatting" isSwiping={false} isPlay={true} />
            </div>
        </div>
    );
};

export default ChatRoom;
