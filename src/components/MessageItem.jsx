import React, { useMemo, useState } from 'react';
import moment from 'moment';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { HiMiniArrowUpTray } from 'react-icons/hi2';
import { Avatar } from 'antd';
import { FaChartLine } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { heart } from '../redux/actions/PostActions';
import { Link, useNavigate } from 'react-router-dom';

function MessageItem({ position = 'right', message }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isHeart, setIsHeart] = useState(!!message?.heart);
    const [likeCount, setLikeCount] = useState(message?.number_heart ?? 0);

    const handleHeart = () => {
        dispatch(heart(message?.id));
        setLikeCount((prev) => prev + (isHeart ? -1 : 1));
        setIsHeart(!isHeart);
    };

    const postDetailsUrl = useMemo(() => {
        const baseUrl = `/posts/details/${message.id}`;
        return message?.reply?.length > 0
            ? `${baseUrl}?userId=${message.reply[0].user_id}`
            : baseUrl;
    }, [message.id, message.reply]);

    return (
        <div className="w-full py-6">
            <div
                className={`w-full  flex items-start  ${
                    position === 'left' ? 'flex-row-reverse' : ''
                }`}
            >
                <Link
                    to={`/profile/${message?.user_id}`}
                    className={`w-10 h-10 mr-2 ${
                        position === 'left' ? 'mr-0 ml-2' : ''
                    }`}
                >
                    <Avatar
                        className="w-full h-full"
                        src={message?.avatar}
                        alt=""
                    />
                </Link>
                <div className="flex-1 relative shadow-md rounded-lg bg-white p-3">
                    <div onClick={() => navigate(postDetailsUrl)}>
                        <div
                            className={`flex items-center gap-[5px] ${
                                position === 'left' ? ' justify-end' : ''
                            }`}
                        >
                            <h5 className="md:text-xl text-black dark:text-white">
                                {message?.name}
                            </h5>
                            <span className="text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base">
                                {moment.unix(message?.create_at).fromNow(true)}
                            </span>
                        </div>
                        <p
                            className={`${
                                position === 'left' ? 'text-right' : ''
                            }`}
                        >
                            {message?.content}
                        </p>
                    </div>
                    <div
                        className={`absolute items-center bottom-[-22px] ${position}-0 border-[5px] border-slatePrimary dark:border-darkPrimary flex gap-4 bg-white dark:bg-dark2Primary rounded-3xl px-3 py-[3px]`}
                    >
                        <div
                            onClick={handleHeart}
                            className={`flex items-center  text-gray-400`}
                        >
                            {isHeart ? <FaHeart color="red" /> : <FaRegHeart />}
                            <span className="ml-2 text-sm font-medium">
                                {likeCount}
                            </span>
                        </div>
                        <div className={`flex items-center  text-gray-400`}>
                            <PiArrowsClockwiseBold />
                            <span className="ml-2 text-sm font-medium">
                                {message?.number_view}
                            </span>
                        </div>
                        <div className={`flex items-center  text-gray-400`}>
                            <FaChartLine />
                            <span className="ml-2 text-sm font-medium">
                                {message?.number_share}
                            </span>
                        </div>
                        <HiMiniArrowUpTray />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MessageItem;
