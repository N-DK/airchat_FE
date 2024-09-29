import React, { useState, useMemo, useEffect, useRef } from 'react';
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
import useClosestToTop from '../hooks/useClosestToTop';
import {
    addViewPost,
    follow,
    profile,
    sharePost,
} from '../redux/actions/UserActions';
import LoadingSpinner from './LoadingSpinner';

const BASE_URL = 'https://talkie.transtechvietnam.com/';

// postRefs, contentsChattingRef
function PostItem({ item }) {
    const navigate = useNavigate();
    const { pingStates } = usePingStates();
    const dispatch = useDispatch();
    const [likeCount, setLikeCount] = useState(item?.number_heart ?? 0);
    const [isHeart, setIsHeart] = useState(!!item?.heart);

    const [shareCount, setShareCount] = useState(item?.number_share ?? 0);
    const [isShare, setIsShare] = useState(false);

    const divRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);
    const { userInfo } = useSelector((state) => state.userProfile);

    // const userFollow = useSelector((state) => state.userFollow);

    useEffect(() => {
        if (!userInfo) dispatch(profile());
    }, [dispatch]);

    useEffect(() => {
        setLikeCount(item?.number_heart ?? 0);
        setIsHeart(!!item?.heart);
        setShareCount(item?.number_share ?? 0);
        setIsShare(false);
    }, [item]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.85,
                rootMargin: '-200px 0px -510px 0px',
            },
        );

        if (divRef?.current) {
            observer.observe(divRef?.current);
        }

        return () => {
            if (divRef?.current) {
                observer.unobserve(divRef?.current);
            }
        };
    }, []);

    const handleLike = () => {
        dispatch(heart(item.id));
        setLikeCount((prev) => prev + (isHeart ? -1 : 1));
        setIsHeart(!isHeart);
    };

    const handleSharePost = () => {
        dispatch(sharePost(item.id));
        setShareCount((prev) => prev + (isShare ? -1 : 1));
        setIsShare(!isShare);
    };

    const handleOnClickPost = () => {
        dispatch(addViewPost(item.id));
        navigate(postDetailsUrl);
    };

    const handleFollow = () => {
        dispatch(follow(item.user_id));
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
                <div
                    onClick={handleFollow}
                    className={`absolute bottom-0 right-[-3px] z-20 bg-blue-500 rounded-full ${
                        (item.dafollow === null || item.dafollow <= 0) &&
                        userInfo?.id !== item?.user_id
                            ? 'border border-white'
                            : ''
                    }`}
                >
                    {(item.dafollow === null || item.dafollow <= 0) &&
                        userInfo?.id !== item?.user_id && (
                            <RiAddLine
                                size="1.1rem"
                                className="p-[2px] text-white"
                            />
                        )}
                </div>
                <div
                    className={`absolute top-0 left-0 bg-red-300 h-10 md:h-12 w-10 md:w-12 rounded-full ${
                        pingStates[item.id] ? 'animate-ping' : ''
                    }`}
                ></div>
            </div>

            <div className="w-full">
                <div
                    ref={divRef}
                    className={` relative transition-all duration-300  rounded-2xl w-full px-4 pb-5 pt-3 ${
                        isVisible
                            ? 'shadow-2xl'
                            : 'bg-white dark:bg-dark2Primary'
                    } ${userInfo?.id === item?.user_id ? 'bg-blue-500' : ''}`}
                >
                    <div onClick={handleOnClickPost}>
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
                            onClick={handleSharePost}
                            icon={
                                <PiArrowsClockwiseBold
                                    color={`${isShare ? 'green' : ''}`}
                                />
                            }
                            count={shareCount}
                        />
                        <ActionButton
                            icon={<FaChartLine />}
                            count={item.number_view}
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
                    {item?.reply?.length > 0 && (
                        <span className="ml-2">
                            {item?.reply?.length} people talking
                        </span>
                    )}
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
