import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment/moment';
import { Avatar } from 'antd';
import { FaChevronLeft, FaChartLine } from 'react-icons/fa';
import { TbUpload } from 'react-icons/tb';
import { RiAddLine, RiDeleteBin6Line } from 'react-icons/ri';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { HiMiniArrowUpTray } from 'react-icons/hi2';
import { debounce, isArray, set } from 'lodash';

import { AppContext } from '../AppContext';
import {
    bookMark,
    deletePost,
    getReplyAll,
    heart,
    setPostActive,
    unReportPost,
} from '../redux/actions/PostActions';
import FooterChat from '../components/FooterChat';
import RecordModal from '../components/RecordModal';
import LoaderSkeletonPosts from '../components/LoaderSkeletonPosts';
import MessageItem from '../components/MessageItem';
import icon1 from '../assets/Untitled-2.png';
import {
    follow,
    profile,
    setLink,
    sharePost,
} from '../redux/actions/UserActions';
import CustomContextMenu from '../components/CustomContextMenu';
import { FaBookmark, FaRegBookmark, FaRegStar } from 'react-icons/fa6';
import LinkPreviewComponent from '../components/LinkPreviewComponent';
import { setObjectActive } from '../redux/actions/SurfActions';
import {
    POST_REPLY_ALL_RESET,
    POST_SUBMIT_RESET,
} from '../redux/constants/PostConstants';
import { BsEmojiFrown } from 'react-icons/bs';
import HiddenPostComponent from '../components/HiddenPostComponent';
import { LANGUAGE } from '../constants/language.constant';
import ModalDelete from '../components/ModalDelete';
import PostHosting from '../components/PostHosting';
import ScreenFull from '../components/ScreenFull';
import { Howl } from 'howler';
import { USER_FOLLOW_RESET } from '../redux/constants/UserConstants';
import SpeakingAnimation from '../components/SpeakingAnimation';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { detailChannel } from '../redux/actions/ChannelActions';
import { CHANNEL_DETAIL_SUCCESS } from '../redux/constants/ChannelConstants';

const BASE_URL = 'https://talkie.transtechvietnam.com/';

const LoaderSkeletonAvatar = ({ className = '' }) => {
    return (
        <div
            className={`bg-gray-300 animate-pulse ${className}`}
            style={{
                borderRadius: '50%',
                width: '36px',
                height: '36px',
            }}
        ></div>
    );
};

const TextSkeleton = ({
    width = '30%',
    height = '0.75rem',
    className = '',
}) => {
    return (
        <div
            className={`bg-gray-300 animate-pulse ${className} mx-auto mt-1`}
            style={{ width, height, borderRadius: '4px' }}
        ></div>
    );
};

const MessageRecursive = ({
    detailsPostReply,
    setDetailsPostReply,
    contentsChattingRef,
    index,
}) => {
    const message = detailsPostReply[index];

    return (
        <div className="pb-5 pt-3 px-3">
            <MessageItem
                position="left"
                message={message}
                setDetailsPostReply={setDetailsPostReply}
                contentsChattingRef={contentsChattingRef}
            />

            {message.reply?.length > 0 && (
                <div className="pl-5">
                    {message.reply.map((_, subIndex) => (
                        <MessageRecursive
                            key={subIndex}
                            detailsPostReply={message.reply}
                            setDetailsPostReply={setDetailsPostReply}
                            contentsChattingRef={contentsChattingRef}
                            index={subIndex}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function Details() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const {
        isRecord,
        toggleIsRecord,
        isRunAuto,
        isFullScreen,
        toggleIsRunAuto,
    } = useContext(AppContext);

    const [isSwiping, setIsSwiping] = useState(false);
    const [detailsPostReply, setDetailsPostReply] = useState([]);
    const [indexCommentPresent, setIndexCommentPresent] = useState(0);
    const [isHeart, setIsHeart] = useState(true);
    const [likeCount, setLikeCount] = useState(0);
    const [isShare, setIsShare] = useState(false);
    const [shareCount, setShareCount] = useState(0);
    const [isBookMark, setIsBookMark] = useState(false);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [data, setData] = useState();
    const [targetElement, setTargetElement] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);
    const [initialLoadBookMark, setInitialLoadBookMark] = useState(true);
    const [rect, setRect] = useState(null);
    const [isEmptyData, setIsEmptyData] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [channel, setChannel] = useState(null);

    const contentsChattingRef = useRef(null);
    const pressTimer = useRef();
    const divRef = useRef(null);
    const videoRef = useRef(null);

    const postRefs = useRef([]);

    const { replyAlls: post, loading } = useSelector(
        (state) => state.postReplyAll,
    );
    const { userInfo } = useSelector((state) => state.userProfile);
    const { success: newPost } = useSelector((state) => state.postSubmit);
    const { success: reportSuccess } = useSelector((state) => state.reportPost);
    const { language } = useSelector((state) => state.userLanguage);
    const { success: isSuccessDeletePost, post_id: postIdDelete } = useSelector(
        (state) => state.userDeletePost,
    );
    const { isSuccess: isSuccessFollow, stranger_id } = useSelector(
        (state) => state.userFollow,
    );
    const { channel: channelDetail, loading: loadingDetailChannel } =
        useSelector((state) => state.channelDetail);
    const { link } = useSelector((state) => state.userLink);

    useEffect(() => {
        if (link) dispatch(setLink(null));
    }, []);

    useEffect(() => {
        if (channelDetail) {
            setChannel(channelDetail);
            dispatch({ type: CHANNEL_DETAIL_SUCCESS, payload: null });
        }
    }, [channelDetail]);

    useEffect(() => {
        if (isArray(post)) {
            setIsEmptyData(true);
        } else if (post) {
            setData(post);
            setIsEmptyData(false);
            dispatch({ type: POST_REPLY_ALL_RESET });
        }
    }, [post]);

    useEffect(() => {
        setDetailsPostReply(data?.reply || []);
    }, [data?.reply]);

    useEffect(() => {
        if (data?.channel_id === 0) {
            setChannel({
                name: 'Just Chatting',
                photo: '',
            });
        }
        if (data?.channel_id) dispatch(detailChannel(data?.channel_id));
    }, [data?.channel_id]);

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
        // if (!post) dispatch(detailsPost(id, userId));
        dispatch(getReplyAll(id));
    }, [dispatch, id]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            debounce(([entry]) => {
                setIsVisible(entry.isIntersecting);
            }, 200),
            {
                threshold: [0.1],
                rootMargin: `-${window.innerHeight * 0.1}px 0px -${Math.max(
                    window.innerHeight * 0.75,
                    400,
                )}px 0px`,
            },
        );

        if (divRef?.current) {
            observer.observe(divRef.current);
        }

        return () => {
            if (divRef?.current) {
                observer.unobserve(divRef.current);
            }
            observer.disconnect();
        };
    }, [data?.report]);

    useEffect(() => {
        if (data) {
            setLikeCount(data?.number_heart ?? 0);
            setIsHeart(!!data?.heart);
            setShareCount(data?.number_share ?? 0);
            setIsShare(!!data?.share);
            setIsBookMark(!!data?.bookmark);
        }
    }, [data]);

    useEffect(() => {
        if (reportSuccess) {
            closeContextMenu();
        }
    }, [reportSuccess]);

    useEffect(() => {
        if (
            isVisible &&
            document.getElementById(`post-item-details-${data?.id}`) &&
            (data?.video && data?.video != '0'
                ? videoRef?.current
                : data?.audio)
        ) {
            if (navigator.vibrate) {
                navigator.vibrate(100); // Rung 200ms
            } else {
                console.log('Thiết bị không hỗ trợ rung.');
            }
            dispatch(setPostActive(data));
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
                        `post-item-details-${data?.id}`,
                    ),
                    parent: contentsChattingRef?.current,
                    video: videoRef.current,
                    bonus: 70,
                }),
            );
        }
    }, [isVisible, contentsChattingRef, videoRef, data]);

    useEffect(() => {
        if (data && !isHeart) setInitialLoad(false);
    }, [isHeart, data]);

    useEffect(() => {
        if (!isBookMark) setInitialLoadBookMark(false);
    }, [isBookMark]);

    useEffect(() => {
        if (isSuccessDeletePost) {
            setData((prev) => {
                if (prev?.id === postIdDelete) {
                    return {};
                }

                const newReply = prev?.reply?.filter(
                    (post) => post?.id !== postIdDelete,
                );

                return {
                    ...prev,
                    reply: newReply,
                };
            });
        }
    }, [isSuccessDeletePost, postIdDelete]);

    useEffect(() => {
        if (newPost?.reply_post && newPost?.reply_post === data?.id) {
            setData((post) => {
                if (post.id === newPost.reply_post) {
                    return {
                        ...post,
                        reply: [
                            {
                                ...newPost,
                                img: convertObjectURL(newPost?.img),
                            },
                            ...post.reply,
                        ],
                    };
                }
                return post;
            });
        }
    }, [newPost, dispatch]);

    useEffect(() => {
        setRect(targetElement?.getBoundingClientRect());
    }, [targetElement]);

    const handleSharePostDetail = useCallback((id) => {
        if (navigator.share) {
            navigator
                .share({
                    title: 'Chia sẻ bài viết',
                    text: 'Hãy xem bài viết này!',
                    url: `/share?link=/posts/details/${id}`,
                })
                .then(() => console.log('Chia sẻ thành công!'))
                .catch((error) =>
                    console.error('Chia sẻ không thành công:', error),
                );
        } else {
            window.open(urlToShare, '_blank');
        }
    }, []);

    const convertObjectURL = (selectedFile) => {
        return selectedFile ? URL.createObjectURL(selectedFile) : null;
    };

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
        dispatch(heart(data?.id));
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
    };

    const handleSharePost = () => {
        dispatch(sharePost(data?.id));
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
    };

    const handleFollow = useCallback(() => {
        dispatch(follow(data?.user_id));
    }, [dispatch, data?.user_id]);

    const handleBookMark = () => {
        dispatch(bookMark(data?.id));
        setIsBookMark((prev) => {
            setData((prev) => ({
                ...prev,
                bookmark: !isBookMark,
            }));
            return !prev;
        });
    };

    const handleUndo = useCallback(() => {
        dispatch(unReportPost(data?.id));
        setData((prev) => ({
            ...prev,
            report: !prev.report,
        }));
    }, [data]);

    useEffect(() => {
        if (!userInfo) dispatch(profile());
    }, [userInfo]);

    const ActionButton = useCallback(
        ({ onClick, icon, count }) => (
            <div onClick={onClick} className="flex items-center text-gray-400">
                {icon}
                {count >= 0 && (
                    <span className="text-sm font-medium ml-2">{count}</span>
                )}
            </div>
        ),
        [],
    );

    const renderHeader = () => (
        <div
            className={`z-50 px-6 md:px-10 bg-white dark:bg-darkPrimary pb-[10px] ${
                isSwiping ? 'translate-y-[-150px] opacity-0' : 'opacity-100'
            } transition-all duration-500`}
        >
            <div className="flex justify-between items-center relative pt-12">
                <button
                    onClick={() => {
                        navigate(-1);
                    }}
                >
                    <FaChevronLeft className="text-lg md:text-[22px] text-black dark:text-white" />
                </button>
                {loadingDetailChannel || !channel ? (
                    <LoaderSkeletonAvatar />
                ) : (
                    <Link
                        to={`/channel/${data?.channel_id}`}
                        state={{ channelData: channel }}
                    >
                        <Avatar
                            src={
                                channel?.photo
                                    ? `${BASE_URL}${channel?.photo}`
                                    : icon1
                            }
                            className="w-9 h-9 appear-animation duration-300"
                            alt=""
                        />
                    </Link>
                )}
                <button onClick={() => handleSharePostDetail(id)}>
                    <TbUpload className="text-xl md:text-[30px] text-black dark:text-white" />
                </button>
            </div>
            {loadingDetailChannel || !channel ? (
                <TextSkeleton />
            ) : (
                <div className="flex justify-center mt-1 appear-animation duration-300">
                    <p className="text-gray-500 text-ssm">
                        {LANGUAGE[language].IN}{' '}
                        {channel?.name ?? 'Just Chatting'}
                    </p>
                </div>
            )}
        </div>
    );

    const renderPostContent = () => (
        <div className="flex  mt-[120px] py-6 pb-10 md:py-10 px-3 md:px-6 gap-3 md:gap-6 bg-slatePrimary dark:bg-darkPrimary border-b border-b-gray-300 dark:border-b-dark2Primary">
            {userInfo?.id !== data?.user_id && (
                <div
                    ref={divRef}
                    className={`relative appear-animation duration-300 h-10 md:h-12 min-w-10 md:min-w-12  ${
                        isVisible && isRunAuto && data?.video ? 'h-16 w-16' : ''
                    } `}
                >
                    <Link
                        to={
                            data?.user_id === userInfo?.id
                                ? '/profile/posts'
                                : `/profile/${data?.user_id}/posts`
                        }
                    >
                        {data?.video && isVisible ? (
                            <div
                                className={`${
                                    isRunAuto ? 'w-full h-full' : 'w-0 h-0'
                                } duration-300 transition-all`}
                            >
                                <video
                                    ref={videoRef}
                                    className="absolute h-full w-full top-0 left-0 z-10 md:h-12 md:w-12 rounded-full object-cover"
                                    src={`https://talkie.transtechvietnam.com/${data.video}`}
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
                            (data?.dafollow === null || data?.dafollow <= 0) &&
                            userInfo?.id !== data?.user_id
                                ? 'border border-white'
                                : ''
                        }`}
                    >
                        {(data?.dafollow === null || data?.dafollow <= 0) &&
                            userInfo?.id !== data?.user_id && (
                                <RiAddLine
                                    size="1.1rem"
                                    className="p-[2px] text-white"
                                />
                            )}
                    </div>
                    <div
                        className={`md:h-12 ${
                            isVisible && isRunAuto && data?.video
                                ? 'h-16 w-16'
                                : 'w-10 h-10'
                        }  md:w-12 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2`}
                    >
                        {isVisible && isRunAuto && <SpeakingAnimation />}
                    </div>
                </div>
            )}
            <div className="flex-1">
                {userInfo?.id !== data?.user_id ? (
                    <div
                        className={`relative appear-animation duration-300 bg-white dark:bg-dark2Primary rounded-2xl w-full px-4 pb-5 pt-3 transition-all  ${
                            isVisible ? 'shadow-2xl scale-[1.02]' : 'shadow-md'
                        }`}
                    >
                        <div
                            id={`post-item-details-${data?.id}`}
                            onTouchStart={() =>
                                handleTouchStart(
                                    `post-item-details-${data?.id}`,
                                )
                            }
                            onTouchEnd={handleTouchEnd}
                        >
                            <div className="flex items-center gap-[5px]">
                                <h5 className="md:text-xl text-black dark:text-white">
                                    {data?.name}
                                </h5>
                                <span className="text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base">
                                    {moment
                                        .unix(data?.create_at)
                                        .locale(language.split('-')[0])
                                        .fromNow(true)}
                                </span>
                            </div>
                            <p className="md:text-lg text-black dark:text-white">
                                {data?.content}
                            </p>
                            {data?.tag_user_detail && (
                                <div className="flex flex-wrap">
                                    {data?.tag_user_detail?.map((tag, i) => (
                                        <span
                                            className={`font-semibold dark:text-white mr-2`}
                                            key={i}
                                        >
                                            {tag?.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                            {data?.img && (
                                <figure className="max-w-full relative my-2">
                                    <LazyLoadImage
                                        className="min-h-40 h-full w-full object-cover rounded-xl"
                                        alt={''}
                                        effect="blur"
                                        wrapperProps={{
                                            style: {
                                                transitionDelay: '1s',
                                            },
                                        }}
                                        src={`https://talkie.transtechvietnam.com/${data?.img}`}
                                    />
                                </figure>
                            )}
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
                        <div className="absolute items-center bottom-[-22px] right-0 border-[5px] border-slatePrimary dark:border-darkPrimary flex gap-4 bg-white dark:bg-dark2Primary rounded-3xl px-3 py-[3px]">
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
                            <ActionButton
                                onClick={handleSharePost}
                                icon={
                                    <PiArrowsClockwiseBold
                                        color={`${isShare ? 'green' : ''}`}
                                    />
                                }
                                count={shareCount}
                            />
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
                            <ActionButton
                                icon={<FaChartLine />}
                                count={data?.number_view}
                            />
                            <ActionButton
                                onClick={() => handleSharePostDetail(data?.id)}
                                icon={<HiMiniArrowUpTray />}
                            />
                        </div>
                    </div>
                ) : (
                    <PostHosting
                        item={data}
                        contentsChattingRef={contentsChattingRef}
                        setIsVisibleChatting={setIsVisible}
                        handleTouchStartPost={handleTouchStart}
                        handleTouchEndPost={handleTouchEnd}
                        handleLike={handleHeart}
                        handleSharePost={handleSharePost}
                        handleBookMark={handleBookMark}
                    />
                )}

                {data?.reply?.length > 0 && (
                    <div className="flex gap-3 md:gap-6">
                        {userInfo?.id === data?.user_id && (
                            <div
                                className={`appear-animation duration-300 relative h-10 md:h-12 min-w-10 md:min-w-12`}
                            ></div>
                        )}
                        <div className="relative mt-9 w-full pb-12 overflow-auto scrollbar-none">
                            {data?.reply?.map((img, index) => (
                                <Avatar
                                    key={index}
                                    onClick={() =>
                                        setIndexCommentPresent(index)
                                    }
                                    src={`https://talkie.transtechvietnam.com/${img.avatar}`}
                                    className={`absolute top-0 h-[45px] w-[45px] object-cover  border-[3px]  ${
                                        indexCommentPresent === index
                                            ? 'border-bluePrimary'
                                            : ''
                                    }`}
                                    style={{ left: `${index * 48}px` }}
                                    alt=""
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <div className="relative flex flex-col justify-between h-screen overflow-hidden dark:bg-dark2Primary">
                {renderHeader()}
                <div
                    ref={contentsChattingRef}
                    className="absolute top-0 left-0 pb-[630px] max-h-screen h-full w-screen overflow-auto scrollbar-none bg-slatePrimary dark:bg-darkPrimary"
                >
                    {loading ? (
                        <div className="mt-[120px]">
                            <LoaderSkeletonPosts />
                        </div>
                    ) : data ? (
                        <>
                            {data?.report ? (
                                <HiddenPostComponent
                                    contentsChattingRef={contentsChattingRef}
                                    data={data}
                                    userInfo={userInfo}
                                    handleUndo={handleUndo}
                                    className="mt-[120px] py-6 pb-10 md:py-10 px-3 md:px-6 gap-3 md:gap-6 bg-slatePrimary dark:bg-darkPrimary"
                                />
                            ) : (
                                <>
                                    {renderPostContent()}
                                    {detailsPostReply?.length > 0 && (
                                        <MessageRecursive
                                            detailsPostReply={detailsPostReply}
                                            setDetailsPostReply={
                                                setDetailsPostReply
                                            }
                                            contentsChattingRef={
                                                contentsChattingRef
                                            }
                                            index={indexCommentPresent}
                                        />
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        isEmptyData && (
                            <div className="flex appear-animation duration-300 h-screen py-6 pb-10 md:py-10 px-3 md:px-6 gap-3 md:gap-6 bg-slatePrimary dark:bg-darkPrimary">
                                <div className="flex flex-col items-center justify-center h-full w-full">
                                    <BsEmojiFrown
                                        size={54}
                                        className="text-gray-500 dark:text-gray-400 mb-3"
                                    />
                                    <p className="text-center dark:text-gray-400 text-xl">
                                        {LANGUAGE[language].NOT_FOUND_POST}
                                    </p>
                                </div>
                            </div>
                        )
                    )}
                </div>
                <RecordModal />
                {isFullScreen && <ScreenFull postsList={[data]} />}
                <div
                    onClick={toggleIsRecord}
                    className={`z-40 absolute h-screen w-screen bg-black bg-opacity-10 transition-all duration-500 ${
                        isRecord
                            ? 'opacity-100 pointer-events-auto'
                            : 'opacity-0 pointer-events-none'
                    }`}
                ></div>
                <FooterChat title="home" isSwiping={isSwiping} isPlay={true} />
            </div>
            <CustomContextMenu
                isVisible={contextMenuVisible}
                onClose={closeContextMenu}
                targetElement={targetElement}
                data={data}
                isHeart={isHeart}
                isShare={isShare}
                isBookMark={isBookMark}
                setData={setData}
                likeCount={likeCount}
                shareCount={shareCount}
                rect={rect}
            />
            <ModalDelete
                title="TITLE_DELETE_POST"
                subTitle="SUBTITLE_DELETE_POST"
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                handle={() => dispatch(deletePost(data?.id))}
            />
        </>
    );
}
