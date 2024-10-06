import React, { useMemo, useRef, useState, useEffect } from 'react';
import moment from 'moment';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { HiMiniArrowUpTray } from 'react-icons/hi2';
import { Avatar } from 'antd';
import { FaBookmark, FaChartLine } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { bookMark, heart } from '../redux/actions/PostActions';
import { Link, useNavigate } from 'react-router-dom';
import LoaderSkeletonPosts from './LoaderSkeletonPosts';
import { addViewPost, sharePost } from '../redux/actions/UserActions';
import CustomContextMenu from './CustomContextMenu';

function MessageItem({ position = 'right', message, setDetailsPostReply }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isHeart, setIsHeart] = useState(true);
    const [likeCount, setLikeCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [shareCount, setShareCount] = useState(0);
    const [isShare, setIsShare] = useState(false);
    const [isBookMark, setIsBookMark] = useState(false);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [data, setData] = useState(message);
    const pressTimer = useRef();
    const messageRef = useRef(null);
    const [targetElement, setTargetElement] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        if (message) setData(message);
    }, [message]);

    useEffect(() => {
        if (data) {
            if (setDetailsPostReply) {
                setDetailsPostReply((prev) =>
                    prev.map((item) => {
                        return item.id === data.id ? data : item;
                    }),
                );
            }
            setIsHeart(!!data?.heart);
            setLikeCount(data?.number_heart ?? 0);
            setShareCount(data?.number_share ?? 0);
            setIsShare(!!data?.share);
            setIsBookMark(!!data?.bookmark);
        }
    }, [data]);

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

    useEffect(() => {
        if (!isHeart) setInitialLoad(false);
    }, [isHeart]);

    const handleTouchStart = (e) => {
        pressTimer.current = setTimeout(() => {
            setTargetElement(
                document.getElementById(`post-item-reply-${data.id}`),
            );
            setContextMenuVisible(true);
        }, 500);
    };

    const handleTouchEnd = () => {
        clearTimeout(pressTimer.current);
    };

    const handleHeart = () => {
        if (data?.id) {
            dispatch(heart(data.id));
            setLikeCount((prev) => {
                const newLikeCount = prev + (isHeart ? -1 : 1);
                setData((prev) => ({
                    ...prev,
                    number_heart: newLikeCount,
                    heart: !isHeart,
                }));
                return newLikeCount;
            });
            setIsHeart((prev) => !prev);
        }
    };

    const handleSharePost = () => {
        if (data?.id) {
            dispatch(sharePost(data.id));
            setShareCount((prev) => {
                const newShareCount = prev + (isShare ? -1 : 1);

                setData((prev) => ({
                    ...prev,
                    number_share: newShareCount,
                    share: !isShare,
                }));

                return newShareCount;
            });
            setIsShare((prev) => !prev);
        }
    };

    const handleBookMark = () => {
        if (data?.id) {
            dispatch(bookMark(data.id));
            setIsBookMark((prev) => !prev);
        }
    };

    const handleOnClickPost = () => {
        if (data?.id) {
            dispatch(addViewPost(data.id));
            navigate(postDetailsUrl);
        }
    };

    const closeContextMenu = () => setContextMenuVisible(false);

    const postDetailsUrl = useMemo(() => {
        if (!data?.id) return '';
        const baseUrl = `/posts/details/${data.id}`;
        return data?.reply?.length > 0
            ? `${baseUrl}?userId=${data.reply[0].user_id}`
            : baseUrl;
    }, [data.id, data.reply]);

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
                    to={`/profile/${data.user_id}`}
                    className={`w-10 h-10 mr-2 ${
                        position === 'left' ? 'mr-0 ml-2' : ''
                    }`}
                >
                    <Avatar
                        className="w-full h-full"
                        src={`https://talkie.transtechvietnam.com/${data?.img}`}
                        alt={data?.name}
                    />
                </Link>
                <div
                    className={`transition-all duration-300 flex-1 relative rounded-xl p-3 pb-4 bg-white dark:bg-dark2Primary ${
                        isVisible ? 'shadow-2xl ' : ' shadow-md'
                    }`}
                >
                    <div
                        id={`post-item-reply-${data.id}`}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onClick={() =>
                            !contextMenuVisible && handleOnClickPost()
                        }
                    >
                        <div
                            className={`flex items-center gap-[5px] ${
                                position === 'left' ? ' justify-end' : ''
                            }`}
                        >
                            <h5 className="md:text-xl text-black dark:text-white">
                                {data.name}
                            </h5>
                            <span className="text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base">
                                {moment.unix(data.create_at).fromNow(true)}
                            </span>
                        </div>
                        <p
                            className={`${
                                position === 'left' ? 'text-right' : ''
                            } dark:text-white`}
                        >
                            {data.content}
                        </p>
                        {data?.img && (
                            <figure className="max-w-full relative my-2">
                                <Avatar
                                    src={`https://talkie.transtechvietnam.com/${data?.img}`}
                                    className="min-h-40 h-full w-full object-cover rounded-xl"
                                />
                            </figure>
                        )}
                    </div>
                    <div
                        className={`absolute items-center bottom-[-22px] ${position}-0 border-[5px] border-slatePrimary dark:border-darkPrimary flex gap-4 bg-white dark:bg-dark2Primary rounded-3xl px-3 py-[3px]`}
                    >
                        <div className={`flex items-center text-gray-400`}>
                            <button
                                onClick={handleHeart}
                                className={`btn heart ${
                                    isHeart
                                        ? initialLoad
                                            ? 'initial-active'
                                            : 'active'
                                        : ''
                                } flex items-center justify-center text-white text-xl w-10 h-10 text-primary-color rounded-full`}
                            ></button>
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
                        {isBookMark && (
                            <div
                                onClick={handleBookMark}
                                className={`flex items-center text-gray-400`}
                            >
                                <FaBookmark className="text-purple-700 text-[0.9rem]" />
                            </div>
                        )}
                        <div className={`flex items-center text-gray-400`}>
                            <FaChartLine />
                            <span className="ml-2 text-sm font-medium">
                                {data.number_view}
                            </span>
                        </div>
                        <HiMiniArrowUpTray />
                    </div>
                </div>
            </div>
            <CustomContextMenu
                isVisible={contextMenuVisible}
                onClose={closeContextMenu}
                targetElement={targetElement}
                data={data}
                setData={setData}
                isHeart={isHeart}
                isShare={isShare}
                isBookMark={isBookMark}
                likeCount={likeCount}
                shareCount={shareCount}
            />
        </div>
    );
}

export default MessageItem;
