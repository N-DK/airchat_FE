import React, {
    useMemo,
    useRef,
    useState,
    useEffect,
    useContext,
    useCallback,
} from 'react';
import moment from 'moment';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { HiMiniArrowUpTray } from 'react-icons/hi2';
import { Avatar } from 'antd';
import { FaBookmark, FaChartLine } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import {
    bookMark,
    heart,
    setPostActive,
    unReportPost,
} from '../redux/actions/PostActions';
import { Link, useNavigate } from 'react-router-dom';
import LoaderSkeletonPosts from './LoaderSkeletonPosts';
import {
    addViewPost,
    follow,
    profile,
    sharePost,
} from '../redux/actions/UserActions';
import CustomContextMenu from './CustomContextMenu';
import { setObjectActive } from '../redux/actions/SurfActions';
import { debounce } from 'lodash';
import LinkPreviewComponent from './LinkPreviewComponent';
import { AppContext } from '../AppContext';
import { RiAddLine } from 'react-icons/ri';
import { IoEyeOffSharp } from 'react-icons/io5';

const BASE_URL = 'https://talkie.transtechvietnam.com/';

function MessageItem({
    position = 'right',
    message,
    setDetailsPostReply,
    contentsChattingRef,
}) {
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
    const [rect, setRect] = useState(null);
    const pressTimer = useRef();
    const messageRef = useRef(null);
    const videoRef = useRef(null);

    const [targetElement, setTargetElement] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);
    const { userInfo } = useSelector((state) => state.userProfile);

    const { isRunAuto } = useContext(AppContext);

    useEffect(() => {
        if (message) setData(message);
    }, [message]);

    useEffect(() => {
        if (data) {
            if (setDetailsPostReply) {
                setDetailsPostReply((prev) =>
                    prev.map((item) => {
                        return item?.id === data?.id ? data : item;
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
            debounce(([entry]) => {
                setIsVisible(entry.isIntersecting);
            }, 200),
            {
                // threshold: 0.3,
                // rootMargin: '-100px 0px -610px 0px', //rootMargin: '-200px 0px -510px 0px',
                threshold: [0.3], // đa dạng giá trị threshold cho nhiều tình huống
                rootMargin: `-${Math.max(
                    window.innerHeight * 0.1,
                    100,
                )}px 0px -${Math.max(window.innerHeight * 0.75, 400)}px 0px`,
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

    useEffect(() => {
        if (!userInfo) dispatch(profile());
    }, [dispatch]);

    const handleTouchStart = (e) => {
        pressTimer.current = setTimeout(() => {
            setTargetElement(
                document.getElementById(`post-item-reply-${data.id}`),
            );
            setRect(targetElement?.getBoundingClientRect());
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

    const handleFollow = useCallback(() => {
        dispatch(follow(data?.user_id));
    }, [dispatch, data?.user_id]);

    const handleOnClickPost = () => {
        if (data?.id) {
            dispatch(addViewPost(data.id));
            navigate(postDetailsUrl);
        }
    };

    const handleUndo = useCallback(() => {
        dispatch(unReportPost(data?.id));
        setData((prev) => ({
            ...prev,
            report: !prev.report,
        }));
    }, [data]);

    const closeContextMenu = () => setContextMenuVisible(false);

    const postDetailsUrl = useMemo(() => {
        if (!data?.id) return '';
        const baseUrl = `/posts/details/${data.id}`;
        return baseUrl;
    }, [data?.id, data?.reply]);

    useEffect(() => {
        if (isVisible) {
            if (window.location.pathname.includes('/posts/details')) {
                dispatch(setPostActive(data));
            }
            dispatch(
                setObjectActive({
                    post: data,
                    audio: data?.audio
                        ? new Audio(
                              `https://talkie.transtechvietnam.com/${data?.audio}`,
                          )
                        : null,
                    element: document.getElementById(
                        `post-item-reply-${data?.id}`,
                    ),
                    parent: contentsChattingRef?.current,
                    video: videoRef.current,
                }),
            );
        }
    }, [isVisible, contentsChattingRef, videoRef]);

    useEffect(() => {
        setRect(targetElement?.getBoundingClientRect());
    }, [targetElement]);

    if (!message) {
        return (
            <div>
                <LoaderSkeletonPosts />
            </div>
        );
    }

    return (
        <div ref={messageRef} className="w-full py-6">
            <>
                {data?.report ? (
                    <div className="w-full">
                        <p className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                            <IoEyeOffSharp className="mr-2 text-bluePrimary" />
                            Hidden
                        </p>
                        <div className="flex items-center dark:text-white mt-1 pb-2 border-b dark:border-dark2Primary">
                            <p className="flex-1">
                                Hiding posts helps TALKIE personalize your Feed.
                            </p>
                            <button
                                onClick={handleUndo}
                                className="w-20 ml-1 py-2 px-3 rounded-lg bg-gray-300 dark:bg-dark2Primary"
                            >
                                Undo
                            </button>
                        </div>
                        <div className="flex items-center mt-2">
                            <Link
                                to={
                                    data?.user_id === userInfo?.id
                                        ? '/profile'
                                        : `/profile/${data?.user_id}`
                                }
                            >
                                <Avatar
                                    src={`${BASE_URL}${data?.avatar}`}
                                    alt="avatar"
                                    className="mr-2"
                                />
                            </Link>
                            <p className="dark:text-white">
                                Snooze{' '}
                                <span className="font-medium">
                                    {data?.name}
                                </span>{' '}
                                for 30 days
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div
                            className={`w-full flex items-start ${
                                position === 'left' ? 'flex-row-reverse' : ''
                            } `}
                        >
                            <div
                                className={`relative h-10 md:h-12 min-w-10 md:min-w-12 ${
                                    isVisible && isRunAuto && data?.video
                                        ? 'h-16 w-16'
                                        : ''
                                } ${
                                    position === 'left' ? 'mr-0 ml-2' : 'mr-2'
                                }`}
                            >
                                <Link
                                    to={
                                        data?.user_id === userInfo?.id
                                            ? '/profile'
                                            : `/profile/${data?.user_id}`
                                    }
                                >
                                    {data?.video && isVisible && isRunAuto ? (
                                        <div className="w-full h-full">
                                            <video
                                                ref={videoRef}
                                                className="absolute h-full w-full top-0 left-0 z-10 md:h-12 md:w-12 rounded-full object-cover"
                                                src={`https://talkie.transtechvietnam.com/${data?.video}`}
                                            />
                                        </div>
                                    ) : (
                                        <Avatar
                                            src={`${BASE_URL}${data?.avatar}`}
                                            className="absolute top-0 left-0 z-10 h-10 md:h-12 w-10 md:w-12 rounded-full object-cover"
                                            alt="icon"
                                        />
                                    )}
                                </Link>
                                <div
                                    onClick={handleFollow}
                                    className={`absolute bottom-0 right-[-3px] z-20 bg-blue-500 rounded-full ${
                                        (data?.dafollow === null ||
                                            data?.dafollow <= 0) &&
                                        userInfo?.id !== data?.user_id
                                            ? 'border border-white'
                                            : ''
                                    }`}
                                >
                                    {(data?.dafollow === null ||
                                        data?.dafollow <= 0) &&
                                        userInfo?.id !== data?.user_id && (
                                            <RiAddLine
                                                size="1.1rem"
                                                className="p-[2px] text-white"
                                            />
                                        )}
                                </div>
                                <div
                                    className={`absolute top-0 left-0 bg-red-300  md:h-12 ${
                                        isVisible && isRunAuto && data?.video
                                            ? 'h-16 w-16'
                                            : 'w-10 h-10'
                                    }  md:w-12 rounded-full ${
                                        isVisible && isRunAuto
                                            ? 'animate-ping'
                                            : ''
                                    }`}
                                ></div>
                            </div>
                            <div
                                className={`transition-all duration-300 flex-1 relative rounded-xl p-3 pb-4 bg-white dark:bg-dark2Primary ${
                                    isVisible
                                        ? 'shadow-2xl scale-[1.02]'
                                        : ' shadow-md'
                                }`}
                            >
                                <div
                                    id={`post-item-reply-${data.id}`}
                                    onTouchStart={handleTouchStart}
                                    onTouchEnd={handleTouchEnd}
                                    onClick={() =>
                                        !contextMenuVisible &&
                                        handleOnClickPost()
                                    }
                                >
                                    <div
                                        className={`flex items-center gap-[5px] ${
                                            position === 'left'
                                                ? ' justify-end'
                                                : ''
                                        }`}
                                    >
                                        <h5 className="md:text-xl text-black dark:text-white">
                                            {data.name}
                                        </h5>
                                        <span className="text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base">
                                            {moment
                                                .unix(data.create_at)
                                                .fromNow(true)}
                                        </span>
                                    </div>
                                    <p
                                        className={`${
                                            position === 'left'
                                                ? 'text-right'
                                                : ''
                                        } dark:text-white`}
                                    >
                                        {data.content}
                                    </p>
                                    {data?.tag_user_detail && (
                                        <div className="flex flex-wrap">
                                            {data?.tag_user_detail?.map(
                                                (tag, i) => (
                                                    <span
                                                        className={`font-semibold dark:text-white mr-2`}
                                                        key={i}
                                                    >
                                                        {tag?.name}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    )}
                                    {data?.img && (
                                        <figure className="max-w-full relative my-2">
                                            <Avatar
                                                src={`${
                                                    data?.img.includes('blob')
                                                        ? data?.img
                                                        : `https://talkie.transtechvietnam.com/${data?.img}`
                                                } `}
                                                className="min-h-40 h-full w-full object-cover rounded-xl"
                                            />
                                        </figure>
                                    )}
                                    {/* {data?.video && (
                            <video
                                ref={videoRef}
                                controls
                                className="w-full mt-2 rounded-xl"
                                src={`https://talkie.transtechvietnam.com/${data.video}`}
                            />
                        )} */}
                                    {data?.url && (
                                        <div>
                                            <LinkPreviewComponent
                                                url={data.url}
                                                post_id={data.id}
                                                // setData={setData}
                                                dataUrl={data.url}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div
                                    className={`absolute items-center bottom-[-22px] ${position}-0 border-[5px] border-slatePrimary dark:border-darkPrimary flex gap-4 bg-white dark:bg-dark2Primary rounded-3xl px-3 py-[3px]`}
                                >
                                    <div
                                        className={`flex items-center text-gray-400`}
                                    >
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
                                    <div
                                        className={`flex items-center text-gray-400`}
                                    >
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
                            rect={rect}
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
                    </>
                )}
            </>
        </div>
    );
}

export default MessageItem;
