import React, {
    useMemo,
    useRef,
    useState,
    useEffect,
    useContext,
    useCallback,
} from 'react';
import moment from 'moment/moment';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { HiMiniArrowUpTray } from 'react-icons/hi2';
import { Avatar } from 'antd';
import { FaBookmark, FaChartLine, FaRegStar } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import {
    bookMark,
    deletePost,
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
import { RiAddLine, RiDeleteBin6Line } from 'react-icons/ri';
import { IoEyeOffSharp } from 'react-icons/io5';
import HiddenPostComponent from './HiddenPostComponent';
import { FaRegBookmark } from 'react-icons/fa';
import ModalDelete from './ModalDelete';
import PostHosting from './PostHosting';
import { Howl } from 'howler';
import { USER_FOLLOW_RESET } from '../redux/constants/UserConstants';
import SpeakingAnimation from './SpeakingAnimation';
import { LazyLoadImage } from 'react-lazy-load-image-component';
const BASE_URL = 'https://talkie.transtechvietnam.com/';

function MessageItem({
    position = 'right',
    message,
    setDetailsPostReply,
    contentsChattingRef,
}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
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
    const [initialLoadBookMark, setInitialLoadBookMark] = useState(true);

    const { userInfo } = useSelector((state) => state.userProfile);
    const { success: reportSuccess } = useSelector((state) => state.reportPost);
    const { language } = useSelector((state) => state.userLanguage);
    const { isSuccess: isSuccessFollow, stranger_id } = useSelector(
        (state) => state.userFollow,
    );

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
                threshold: [0.1], // đa dạng giá trị threshold cho nhiều tình huống
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
    }, [data?.report]);

    useEffect(() => {
        if (!isHeart) setInitialLoad(false);
    }, [isHeart]);

    useEffect(() => {
        if (!isBookMark) setInitialLoadBookMark(false);
    }, [isBookMark]);

    useEffect(() => {
        if (!userInfo) dispatch(profile());
    }, [dispatch]);

    useEffect(() => {
        if (isSuccessFollow) {
            setData((prev) => {
                if (prev?.user_id === stranger_id) {
                    return {
                        ...prev,
                        dafollow: !!prev?.dafollow ? 0 : 1,
                    };
                }

                return prev;
            });
            dispatch({ type: USER_FOLLOW_RESET });
        }
    }, [isSuccessFollow, stranger_id]);

    useEffect(() => {
        if (reportSuccess) {
            closeContextMenu();
        }
    }, [reportSuccess]);

    const handleTouchStart = useCallback(
        (id) => {
            pressTimer.current = setTimeout(() => {
                const element = document.getElementById(id);

                if (element) {
                    const hiddenElement = element.querySelector('#hidden');
                    if (hiddenElement) {
                        hiddenElement.style.display = 'none';
                    }

                    setTargetElement(element);
                    setRect(element.getBoundingClientRect());
                    setContextMenuVisible(true);
                }
            }, 1000);
        },
        [targetElement],
    );

    const handleTouchEnd = useCallback(() => {
        clearTimeout(pressTimer.current);
    }, []);

    const closeContextMenu = useCallback(() => {
        setContextMenuVisible(false);
        const hiddenElement = targetElement?.querySelector('#hidden');
        if (hiddenElement) {
            hiddenElement.style.display = 'flex';
        }
    }, [targetElement]);

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

    // const handleBookMark = () => {
    //     if (data?.id) {
    //         dispatch(bookMark(data.id));
    //         setIsBookMark((prev) => !prev);
    //     }
    // };

    const handleBookMark = useCallback(() => {
        dispatch(bookMark(data?.id));
        setIsBookMark((prev) => {
            setData((prev) => ({
                ...prev,
                bookmark: !isBookMark,
            }));
            return !prev;
        });
    }, [dispatch, data?.id, isBookMark]);

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

    const postDetailsUrl = useMemo(() => {
        if (!data?.id) return '';
        const baseUrl = `/posts/details/${data.id}`;
        return baseUrl;
    }, [data?.id, data?.reply]);

    useEffect(() => {
        if (
            isVisible &&
            document.getElementById(`post-item-reply-${data?.id}`) &&
            (data?.video && data?.video != '0'
                ? videoRef?.current
                : data?.audio)
        ) {
            if (navigator.vibrate) {
                navigator.vibrate(100); // Rung 200ms
            } else {
                console.log('Thiết bị không hỗ trợ rung.');
            }
            if (window.location.pathname.includes('/posts/details')) {
                dispatch(setPostActive(data));
            }
            dispatch(
                setObjectActive({
                    post: data,
                    audio: data?.audio
                        ? new Howl({
                              src: [
                                  `https://talkie.transtechvietnam.com/${data?.audio}`,
                              ],
                              html5: true,
                          })
                        : null,
                    element: document.getElementById(
                        `post-item-reply-${data?.id}`,
                    ),
                    parent: contentsChattingRef?.current,
                    video: videoRef.current,
                }),
            );
        }
    }, [isVisible, contentsChattingRef, videoRef, data, isRunAuto]);

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
                    <HiddenPostComponent
                        data={data}
                        userInfo={userInfo}
                        handleUndo={handleUndo}
                        contentsChattingRef={contentsChattingRef}
                    />
                ) : (
                    <>
                        <div
                            className={`w-full flex items-start ${
                                position === 'left' ? 'flex-row-reverse' : ''
                            } `}
                        >
                            <div
                                className={`relative appear-animation duration-300 h-10 md:h-12 min-w-10 md:min-w-12 ${
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
                                            ? '/profile/posts'
                                            : `/profile/${data?.user_id}/posts`
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
                                {/* <div
                                    className={`absolute top-0 left-0 bg-red-300  md:h-12 ${
                                        isVisible && isRunAuto && data?.video
                                            ? 'h-16 w-16'
                                            : 'w-10 h-10'
                                    }  md:w-12 rounded-full ${
                                        isVisible && isRunAuto
                                            ? 'animate-ping'
                                            : ''
                                    }`}
                                ></div> */}
                                <div
                                    className={`md:h-12 ${
                                        isVisible && isRunAuto && data?.video
                                            ? 'h-16 w-16'
                                            : 'w-10 h-10'
                                    }  md:w-12 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2`}
                                >
                                    {isVisible && isRunAuto && (
                                        <SpeakingAnimation />
                                    )}
                                </div>
                            </div>
                            {userInfo?.id === data?.user_id ? (
                                <PostHosting
                                    item={data}
                                    contentsChattingRef={contentsChattingRef}
                                    setIsVisibleChatting={setIsVisible}
                                    position={position}
                                    handleTouchStartPost={handleTouchStart}
                                    handleTouchEndPost={handleTouchEnd}
                                    handleLike={handleHeart}
                                    handleSharePost={handleSharePost}
                                    handleBookMark={handleBookMark}
                                    videoRef={videoRef}
                                />
                            ) : (
                                <div
                                    className={`transition-all duration-300 flex-1 relative rounded-xl p-3 pb-4 bg-white dark:bg-dark2Primary ${
                                        isVisible
                                            ? 'shadow-2xl scale-[1.02]'
                                            : ' shadow-md'
                                    }`}
                                >
                                    <div
                                        id={`post-item-reply-${data.id}`}
                                        onTouchStart={() =>
                                            handleTouchStart(
                                                `post-item-reply-${data.id}`,
                                            )
                                        }
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
                                                    .locale(
                                                        language.split('-')[0],
                                                    )
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
                                                {/* <Avatar
                                                    src={`${
                                                        data?.img.includes(
                                                            'blob',
                                                        )
                                                            ? data?.img
                                                            : `https://talkie.transtechvietnam.com/${data?.img}`
                                                    } `}
                                                    className="min-h-40 h-full w-full object-cover rounded-xl"
                                                /> */}
                                                <LazyLoadImage
                                                    className="min-h-40 h-full w-full object-cover rounded-xl"
                                                    alt={''}
                                                    effect="blur"
                                                    wrapperProps={{
                                                        style: {
                                                            transitionDelay:
                                                                '1s',
                                                        },
                                                    }}
                                                    src={`${
                                                        data?.img.includes(
                                                            'blob',
                                                        )
                                                            ? data?.img
                                                            : `https://talkie.transtechvietnam.com/${data?.img}`
                                                    } `}
                                                />
                                            </figure>
                                        )}
                                        {data?.url && (
                                            <div>
                                                <LinkPreviewComponent
                                                    url={data.url}
                                                    post_id={data.id}
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
                                        {/* {isBookMark && (
                                            <div
                                                onClick={handleBookMark}
                                                className={`flex items-center text-gray-400`}
                                            >
                                                <FaBookmark className="text-purple-700 text-[0.9rem]" />
                                            </div>
                                        )} */}

                                        {isBookMark && (
                                            <label
                                                className={`ui-bookmark  ${
                                                    isBookMark
                                                        ? initialLoadBookMark
                                                            ? 'init-active'
                                                            : 'active'
                                                        : ''
                                                }`}
                                                onClick={handleBookMark}
                                            >
                                                <div className="bookmark">
                                                    <svg viewBox="0 0 32 32">
                                                        <g>
                                                            <path d="M27 4v27a1 1 0 0 1-1.625.781L16 24.281l-9.375 7.5A1 1 0 0 1 5 31V4a4 4 0 0 1 4-4h14a4 4 0 0 1 4 4z"></path>
                                                        </g>
                                                    </svg>
                                                </div>
                                            </label>
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
                            )}
                        </div>
                        <ModalDelete
                            title="TITLE_DELETE_POST"
                            subTitle="SUBTITLE_DELETE_POST"
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            handle={() => dispatch(deletePost(data?.id))}
                        />
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
