import React, { useState, useMemo } from 'react';
import moment from 'moment';
import { Avatar } from 'antd';
import { RiAddLine } from 'react-icons/ri';
import { FaHeart, FaRegHeart, FaChartLine } from 'react-icons/fa';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { HiMiniArrowUpTray } from 'react-icons/hi2';
import { Link, useNavigate } from 'react-router-dom';
import { usePingStates } from '../hooks/usePingStates';
import { useDispatch, useSelector } from 'react-redux';
import { heart } from '../redux/actions/PostActions';
import MessageItem from './MessageItem';
import LoadingSpinner from './LoadingSpinner';

const BASE_URL = 'https://talkie.transtechvietnam.com/';

function PostItem({ item, postRefs }) {
    const navigate = useNavigate();
    const { pingStates } = usePingStates();
    const dispatch = useDispatch();
    const [likeCount, setLikeCount] = useState(item?.number_heart ?? 0);
    const [isHeart, setIsHeart] = useState(!!item?.heart);

    const handleLike = () => {
        dispatch(heart(item.id));
        setLikeCount((prev) => prev + (isHeart ? -1 : 1));
        setIsHeart(!isHeart);
    };

    const postDetailsUrl = useMemo(() => {
        const baseUrl = `/posts/details/${item.id}`;
        return item?.reply?.length > 0
            ? `${baseUrl}?userId=${item.reply[0].user_id}`
            : baseUrl;
    }, [item.id, item.reply]);

    return (
        <div className="flex border-b-[6px] border-gray-200 dark:border-dark2Primary py-6 md:py-10 px-3 md:px-6 gap-3 md:gap-6 bg-slatePrimary dark:bg-darkPrimary">
            <div className="relative h-10 md:h-12 min-w-10 md:min-w-12">
                <Link to={`/profile/${item.user_id}`}>
                    <Avatar
                        src={`${BASE_URL}${item.avatar}`}
                        className="absolute top-0 left-0 z-10 h-10 md:h-12 w-10 md:w-12 rounded-full object-cover"
                        alt="icon"
                    />
                </Link>
                <div className="absolute bottom-0 right-[-3px] z-20 bg-blue-500 border border-white rounded-full">
                    <RiAddLine size="1.1rem" className="p-[2px] text-white" />
                </div>
                <div
                    className={`absolute top-0 left-0 bg-red-300 h-10 md:h-12 w-10 md:w-12 rounded-full ${
                        pingStates[item.id] ? 'animate-ping' : ''
                    }`}
                ></div>
            </div>

            <div className="w-full">
                <div className="relative bg-white dark:bg-dark2Primary rounded-2xl w-full px-4 pb-5 pt-3">
                    <div onClick={() => navigate(postDetailsUrl)}>
                        <div className="flex items-center gap-[5px]">
                            <h5 className="line-clamp-1 md:text-xl text-black dark:text-white">
                                {item.name}
                            </h5>
                            {item.name_channel && (
                                <span className="text-bluePrimary">in</span>
                            )}
                            <span className="line-clamp-1 text-bluePrimary font-medium">
                                {item.name_channel}
                            </span>
                            <span className="whitespace-nowrap text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base">
                                {moment.unix(item.create_at).fromNow(true)}
                            </span>
                        </div>
                        <p className="text-left line-clamp-5 md:text-lg text-black dark:text-white">
                            {item.content}
                        </p>
                    </div>

                    <div className="absolute bottom-[-22px] items-center right-0 border-[5px] border-slatePrimary dark:border-darkPrimary flex gap-4 bg-white dark:bg-dark2Primary rounded-3xl px-3 py-[3px]">
                        <ActionButton
                            onClick={handleLike}
                            icon={
                                isHeart ? (
                                    <FaHeart color="red" />
                                ) : (
                                    <FaRegHeart />
                                )
                            }
                            count={likeCount}
                        />
                        <ActionButton
                            icon={<PiArrowsClockwiseBold />}
                            count={item.number_view}
                        />
                        <ActionButton
                            icon={<FaChartLine />}
                            count={item.number_share}
                        />
                        <HiMiniArrowUpTray />
                    </div>
                </div>
                <div className="flex items-center mt-5">
                    <Avatar.Group>
                        {item?.reply?.map((reply, index) => (
                            <Avatar
                                key={index}
                                src={`${BASE_URL}${reply.avatar}`}
                            />
                        ))}
                    </Avatar.Group>
                    <span className="ml-2">
                        {item?.reply?.length ?? 0} people talking
                    </span>
                </div>
                <div className="flex-1 mb-2">
                    {item?.reply?.map((reply, index) => (
                        <MessageItem
                            key={index}
                            position={index % 2 === 0 ? 'left' : 'right'}
                            message={reply}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

const ActionButton = ({ onClick, icon, count }) => (
    <div onClick={onClick} className="flex items-center text-gray-400">
        {icon}
        <span className="text-sm font-medium ml-2">{count}</span>
    </div>
);

export default PostItem;
