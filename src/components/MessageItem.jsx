import React, { useMemo, useRef, useState, useEffect } from 'react';
import moment from 'moment';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { HiMiniArrowUpTray } from 'react-icons/hi2';
import { Avatar } from 'antd';
import { FaChartLine } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { heart } from '../redux/actions/PostActions';
import { Link, useNavigate } from 'react-router-dom';
import LoaderSkeletonPosts from './LoaderSkeletonPosts';
import { addViewPost, sharePost } from '../redux/actions/UserActions';

function MessageItem({ position = 'right', message }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isHeart, setIsHeart] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [shareCount, setShareCount] = useState(0);
    const [isShare, setIsShare] = useState(false);

    const messageRef = useRef(null);

    useEffect(() => {
        if (message) {
            setIsHeart(!!message.heart);
            setLikeCount(message.number_heart ?? 0);
            setShareCount(message.number_share ?? 0);
            setIsShare(!!message.share);
        }
    }, [message]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.9,
                rootMargin: '-200px 0px -510px 0px',
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

    const handleHeart = () => {
        if (message?.id) {
            dispatch(heart(message.id));
            setLikeCount((prev) => prev + (isHeart ? -1 : 1));
            setIsHeart(!isHeart);
        }
    };

    const handleSharePost = () => {
        if (message?.id) {
            dispatch(sharePost(message.id));
            setShareCount((prev) => prev + (isShare ? -1 : 1));
            setIsShare(!isShare);
        }
    };

    const handleOnClickPost = () => {
        if (message?.id) {
            dispatch(addViewPost(message.id));
            navigate(postDetailsUrl);
        }
    };

    const postDetailsUrl = useMemo(() => {
        if (!message?.id) return '';
        const baseUrl = `/posts/details/${message.id}`;
        return message?.reply?.length > 0
            ? `${baseUrl}?userId=${message.reply[0].user_id}`
            : baseUrl;
    }, [message.id, message.reply]);

    if (!message) {
        return (
            <div>
                <LoaderSkeletonPosts />
            </div>
        );
    }

    return (
        <div ref={messageRef} className="w-full py-6">
            <div
                className={`w-full flex items-start ${
                    position === 'left' ? 'flex-row-reverse' : ''
                } `}
            >
                <Link
                    to={`/profile/${message.user_id}`}
                    className={`w-10 h-10 mr-2 ${
                        position === 'left' ? 'mr-0 ml-2' : ''
                    }`}
                >
                    <Avatar
                        className="w-full h-full"
                        src={message.avatar}
                        alt=""
                    />
                </Link>
                <div
                    className={`transition-all duration-300 flex-1 relative rounded-lg p-3 bg-white dark:bg-dark2Primary ${
                        isVisible ? 'shadow-2xl ' : ' shadow-md'
                    }`}
                >
                    <div onClick={handleOnClickPost}>
                        <div
                            className={`flex items-center gap-[5px] ${
                                position === 'left' ? ' justify-end' : ''
                            }`}
                        >
                            <h5 className="md:text-xl text-black dark:text-white">
                                {message.name}
                            </h5>
                            <span className="text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base">
                                {moment.unix(message.create_at).fromNow(true)}
                            </span>
                        </div>
                        <p
                            className={`${
                                position === 'left' ? 'text-right' : ''
                            }`}
                        >
                            {message.content}
                        </p>
                    </div>
                    <div
                        className={`absolute items-center bottom-[-22px] ${position}-0 border-[5px] border-slatePrimary dark:border-darkPrimary flex gap-4 bg-white dark:bg-dark2Primary rounded-3xl px-3 py-[3px]`}
                    >
                        <div
                            onClick={handleHeart}
                            className={`flex items-center text-gray-400`}
                        >
                            {isHeart ? <FaHeart color="red" /> : <FaRegHeart />}
                            <span className="ml-2 text-sm font-medium">
                                {likeCount}
                            </span>
                        </div>
                        <div
                            onClick={handleSharePost}
                            className={`flex items-center text-gray-400`}
                        >
                            <PiArrowsClockwiseBold
                                color={isShare ? 'green' : ''}
                            />
                            <span className="ml-2 text-sm font-medium">
                                {shareCount}
                            </span>
                        </div>
                        <div className={`flex items-center text-gray-400`}>
                            <FaChartLine />
                            <span className="ml-2 text-sm font-medium">
                                {message.number_view}
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
