import React, {
    useState,
    useMemo,
    useEffect,
    useRef,
    useCallback,
    useContext,
} from 'react';
import { Avatar } from 'antd';
import { RiAddLine, RiDeleteBin6Line } from 'react-icons/ri';
import { FaChartLine, FaRegStar } from 'react-icons/fa';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { HiMiniArrowUpTray } from 'react-icons/hi2';
import { Link, useNavigate } from 'react-router-dom';
import { usePingStates } from '../hooks/usePingStates';
import { useDispatch, useSelector } from 'react-redux';
import {
    bookMark,
    deletePost,
    heart,
    setPostActive,
    unReportPost,
} from '../redux/actions/PostActions';
import MessageItem from './MessageItem';
import { addViewPost, follow, sharePost } from '../redux/actions/UserActions';
import CustomContextMenu from './CustomContextMenu';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa6';
import { setObjectActive } from '../redux/actions/SurfActions';
import { debounce } from 'lodash';
import LinkPreviewComponent from './LinkPreviewComponent';
import { POST_SUBMIT_RESET } from '../redux/constants/PostConstants';
import { AppContext } from '../AppContext';
import Webcam from 'react-webcam';
import { DEFAULT_PROFILE } from '../constants/image.constant';
import HiddenPostComponent from './HiddenPostComponent';
import { LANGUAGE } from '../constants/language.constant';
import moment from 'moment/moment';
import 'moment/locale/vi';
import ModalDelete from './ModalDelete';
import PostHosting from './PostHosting';
import { Howl, Howler } from 'howler';
import SpeakingAnimation from './SpeakingAnimation';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const BASE_URL = 'https://talkie.transtechvietnam.com/';

function PostItem({
    item,
    contentsChattingRef,
    setList,
    isTurnOnCamera,
    bonusHeight = 0,
    bonusKey = '',
}) {
    const navigate = useNavigate();
    const { pingStates } = usePingStates();
    const dispatch = useDispatch();
    const [likeCount, setLikeCount] = useState(item?.number_heart ?? 0);
    const [isHeart, setIsHeart] = useState(!!item?.heart);
    const [isBookMark, setIsBookMark] = useState(!!item?.bookmark);
    const [shareCount, setShareCount] = useState(item?.number_share ?? 0);
    const [isShare, setIsShare] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { userInfo } = useSelector((state) => state.userProfile);
    const { success: unReportPostSuccess } = useSelector(
        (state) => state.unReportPost,
    );
    // const { success: deletePostSuccess } = useSelector(
    //     (state) => state.userDeletePost,
    // );
    const { success: reportSuccess } = useSelector((state) => state.reportPost);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [targetElement, setTargetElement] = useState(null);
    const [data, setData] = useState(item);
    const [initialLoad, setInitialLoad] = useState(true);
    const [initialLoadBookMark, setInitialLoadBookMark] = useState(true);
    const [replyIndexCurrent, setReplyIndexCurrent] = useState(0);
    const [detailsPostReply, setDetailsPostReply] = useState([]);
    const [rect, setRect] = useState(null);
    const { success: isSuccessDeletePost, post_id: postIdDelete } = useSelector(
        (state) => state.userDeletePost,
    );

    const {
        isRecord,
        toggleIsRecord,
        isRunAuto,
        recordOption,
        newMessageFromFooter,
    } = useContext(AppContext);

    const { success: newPost } = useSelector((state) => state.postSubmit);
    const { post } = useSelector((state) => state.setPostActive);
    const { language } = useSelector((state) => state.userLanguage);

    const divRef = useRef(null);
    const videoRef = useRef(null);
    const pressTimer = useRef();

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

    const convertObjectURL = (selectedFile) => {
        return selectedFile ? URL.createObjectURL(selectedFile) : null;
    };

    const handleUndo = useCallback(() => {
        dispatch(unReportPost(data?.id));
        setData((prev) => ({
            ...prev,
            report: !prev.report,
        }));
    }, [data]);

    useEffect(() => {
        if (item) {
            setData(item);
        }
    }, [item]);

    useEffect(() => {
        if (unReportPostSuccess) {
        }
    }, [unReportPostSuccess]);

    useEffect(() => {
        if (reportSuccess) {
            closeContextMenu();
        }
    }, [reportSuccess]);

    useEffect(() => {
        if (item) {
            setDetailsPostReply(item?.reply || []);
        }
    }, [item]);

    useEffect(() => {
        if (newPost) {
            if (newPost?.reply_post && newPost?.reply_post === item?.id) {
                setList((prev) => {
                    const newPosts = prev?.map((post) => {
                        if (post?.id === newPost?.reply_post) {
                            const updatedReplies = post?.reply?.map((reply) => {
                                if (reply.user_id === newPost.user_id) {
                                    return {
                                        ...newPost,
                                        img: convertObjectURL(newPost?.img),
                                    };
                                }
                                return reply;
                            });

                            const hasExistingReply = updatedReplies.some(
                                (reply) => reply.user_id === newPost.user_id,
                            );

                            if (!hasExistingReply) {
                                updatedReplies.push({
                                    ...newPost,
                                    img: convertObjectURL(newPost?.img),
                                });
                            }

                            return {
                                ...post,
                                reply: updatedReplies,
                            };
                        }
                        return post;
                    });
                    return newPosts;
                });
            } else if (newPost?.id && !newPost?.reply_post) {
                setList((prev) => {
                    if (!prev.some((post) => post?.id === newPost?.id)) {
                        const newPosts = [
                            { ...newPost, img: convertObjectURL(newPost?.img) },
                            ...prev,
                        ];
                        return newPosts;
                    }

                    return prev;
                });
            }
        }
    }, [newPost, setList]);

    useEffect(() => {
        if (isSuccessDeletePost) {
            setList((prev) => {
                const newPosts = prev?.filter(
                    (post) => post?.id !== postIdDelete,
                );

                return newPosts.map((post) => ({
                    ...post,
                    reply: post?.reply?.filter(
                        (reply) => reply.id !== postIdDelete,
                    ),
                }));
            });
        }
    }, [isSuccessDeletePost, postIdDelete]);

    const postDetailsUrl = useMemo(() => {
        const baseUrl = `/posts/details/${data?.id}`;
        return baseUrl;
    }, [data?.id, data?.reply]);

    useEffect(() => {
        if (setList) {
            setList((prev) => {
                return prev.map((item) => {
                    return item?.id === data?.id ? data : item;
                });
            });
        }

        setLikeCount(data?.number_heart ?? 0);
        setIsHeart(!!data?.heart);
        setShareCount(data?.number_share ?? 0);
        setIsShare(!!data?.share);
        setIsBookMark(!!data?.bookmark);
    }, [data, setList]);

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
        };
    }, [data?.report]);

    useEffect(() => {
        if (!isHeart) setInitialLoad(false);
    }, [isHeart]);

    useEffect(() => {
        if (!isBookMark) setInitialLoadBookMark(false);
    }, [isBookMark]);

    useEffect(() => {
        setRect(targetElement?.getBoundingClientRect());
    }, [targetElement]);

    useEffect(() => {
        if (
            isVisible &&
            (data?.video && data?.video != '0'
                ? videoRef?.current
                : data?.audio) &&
            document.getElementById(`post-item${bonusKey}-${data?.id}`)
        ) {
            if (navigator.vibrate) {
                navigator.vibrate(100);
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
                        `post-item${bonusKey}-${data?.id}`,
                    ),
                    parent: contentsChattingRef?.current,
                    video: videoRef?.current,
                    bonus: bonusHeight,
                }),
            );
        }
    }, [
        contentsChattingRef,
        videoRef,
        isVisible,
        data?.id,
        // isRunAuto,
        bonusHeight,
    ]);

    const handleLike = useCallback(() => {
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
    }, [dispatch, data?.id, isHeart]);

    const handleSharePost = useCallback(() => {
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
    }, [dispatch, data?.id, isShare]);

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

    const handleOnClickPost = useCallback(() => {
        dispatch(addViewPost(data?.id));
        navigate(postDetailsUrl);
    }, [dispatch, data?.id, navigate, postDetailsUrl]);

    const handleFollow = useCallback(() => {
        dispatch(follow(data?.user_id));
    }, [dispatch, data?.user_id]);

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

    return (
        <div className="flex border-b-[6px] border-gray-200 dark:border-dark2Primary py-6 md:py-10 px-3 md:px-6 gap-3 md:gap-6 bg-slatePrimary dark:bg-darkPrimary">
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
                        {userInfo?.id !== data?.user_id && (
                            <div
                                ref={divRef}
                                className={`appear-animation duration-300 relative h-10 md:h-12 min-w-10 md:min-w-12 ${
                                    isVisible && isRunAuto && data?.video
                                        ? 'h-16 w-16'
                                        : ''
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
                                                isRunAuto
                                                    ? 'w-full h-full'
                                                    : 'w-0 h-0'
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
                        )}
                        <div className="flex-1">
                            {userInfo?.id === data?.user_id ? (
                                <PostHosting
                                    item={data}
                                    contentsChattingRef={contentsChattingRef}
                                    setIsVisibleChatting={setIsVisible}
                                    handleTouchStartPost={handleTouchStart}
                                    handleTouchEndPost={handleTouchEnd}
                                    handleLike={handleLike}
                                    handleSharePost={handleSharePost}
                                    handleBookMark={handleBookMark}
                                    bonusHeight={bonusHeight}
                                    bonusKey={bonusKey}
                                />
                            ) : (
                                <div
                                    className={`relative transition-all bg-white dark:bg-dark2Primary duration-300 rounded-2xl w-full px-4 pb-5 pt-3 ${
                                        userInfo?.id === data?.user_id
                                            ? 'bg-blue-100 dark:bg-blue-900'
                                            : ''
                                    } ${
                                        isVisible
                                            ? 'shadow-2xl scale-[1.02]'
                                            : 'shadow-md'
                                    }`}
                                >
                                    {userInfo?.id === data?.user_id && (
                                        <div
                                            className={`absolute top-[-16px] right-0 border-[5px] border-slatePrimary dark:border-darkPrimary flex items-center gap-4 bg-bluePrimary dark:bg-dark2Primary rounded-3xl px-3 py-[3px]`}
                                        >
                                            <FaRegStar className="text-white" />
                                            {isBookMark ? (
                                                <FaBookmark
                                                    className="text-purple-700 text-[0.9rem]"
                                                    onClick={handleBookMark}
                                                />
                                            ) : (
                                                <FaRegBookmark
                                                    className="text-white text-[0.9rem]"
                                                    onClick={handleBookMark}
                                                />
                                            )}
                                            <RiDeleteBin6Line
                                                onClick={() => {
                                                    setIsOpen(true);
                                                }}
                                                className="text-white"
                                            />
                                        </div>
                                    )}
                                    <div
                                        id={`post-item${bonusKey}-${data?.id}`}
                                        onTouchStart={() =>
                                            handleTouchStart(
                                                `post-item${bonusKey}-${data?.id}`,
                                            )
                                        }
                                        onTouchEnd={handleTouchEnd}
                                        onClick={() =>
                                            !contextMenuVisible &&
                                            handleOnClickPost()
                                        }
                                    >
                                        <div className="flex items-center gap-[5px]">
                                            <h5 className="line-clamp-1 md:text-xl text-black dark:text-white">
                                                {data?.name}
                                            </h5>
                                            {data?.name_channel && (
                                                <span className="text-bluePrimary">
                                                    {LANGUAGE[language].IN}
                                                </span>
                                            )}
                                            <span className="line-clamp-1 text-bluePrimary font-medium">
                                                {data?.name_channel}
                                            </span>
                                            <span className="whitespace-nowrap text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base">
                                                {moment
                                                    .unix(data?.create_at)
                                                    .locale(
                                                        language.split('-')[0],
                                                    )
                                                    .fromNow(true)}
                                            </span>
                                        </div>
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
                                        <p className="text-left line-clamp-5 md:text-lg text-black dark:text-white">
                                            {data?.content}
                                        </p>
                                        {data?.img && (
                                            <figure className="max-w-full relative my-2">
                                                {/* <Avatar
                                                    src={`https://talkie.transtechvietnam.com/${data?.img}`}
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

                                    <div className="absolute bottom-[-22px] items-center right-0 border-[5px] border-slatePrimary dark:border-darkPrimary flex gap-4 bg-white dark:bg-dark2Primary rounded-3xl px-3 py-[3px]">
                                        <div
                                            className={`flex items-center text-gray-400`}
                                        >
                                            <button
                                                onClick={handleLike}
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
                                                    color={`${
                                                        isShare ? 'green' : ''
                                                    }`}
                                                />
                                            }
                                            count={shareCount}
                                        />
                                        {/* {isBookMark && (
                                            <ActionButton
                                                onClick={handleBookMark}
                                                icon={
                                                    <FaBookmark className="text-purple-700 text-[0.9rem]" />
                                                }
                                            />
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
                                        <ActionButton
                                            icon={<FaChartLine />}
                                            count={data?.number_view}
                                        />
                                        <ActionButton
                                            onClick={() =>
                                                handleSharePostDetail(data?.id)
                                            }
                                            icon={<HiMiniArrowUpTray />}
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-3 md:gap-6">
                                {userInfo?.id === data?.user_id && (
                                    <div
                                        className={`appear-animation duration-300 relative h-10 md:h-12 min-w-10 md:min-w-12`}
                                    ></div>
                                )}
                                <div className="flex items-center mt-5">
                                    {item?.reply?.map((reply, index) => (
                                        <Avatar
                                            onClick={() =>
                                                setReplyIndexCurrent(index)
                                            }
                                            key={index}
                                            src={`${BASE_URL}${reply?.avatar}`}
                                            className={`${
                                                replyIndexCurrent === index
                                                    ? 'border-2 border-blue-400'
                                                    : ''
                                            } mr-2`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 mb-2">
                                {isTurnOnCamera && post?.id === data.id ? (
                                    <div className="flex items-start justify-end mt-6">
                                        <div
                                            className={`transition-all duration-300 flex-1 relative rounded-xl p-3 pb-4 bg-white dark:bg-dark2Primary `}
                                        >
                                            <div>
                                                <div
                                                    className={`flex items-center gap-[5px] justify-end`}
                                                >
                                                    <h5 className="md:text-xl text-black dark:text-white">
                                                        {userInfo?.name}
                                                    </h5>
                                                    <span className="text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base">
                                                        now
                                                    </span>
                                                </div>
                                                <p
                                                    className={`text-right dark:text-white min-h-[24px]`}
                                                >
                                                    {newMessageFromFooter}
                                                </p>
                                            </div>
                                            <div
                                                className={`absolute items-center bottom-[-22px] left-0 border-[5px] border-slatePrimary dark:border-darkPrimary flex gap-4 bg-white dark:bg-dark2Primary rounded-3xl px-3 py-[3px]`}
                                            >
                                                <div
                                                    className={`flex items-center text-gray-400`}
                                                >
                                                    <button
                                                        className={`btn heart flex items-center justify-center text-white text-xl w-10 h-10 text-primary-color rounded-full`}
                                                    ></button>
                                                    <span className="ml-2 text-sm font-medium">
                                                        0
                                                    </span>
                                                </div>

                                                <div
                                                    className={`flex items-center text-gray-400`}
                                                >
                                                    <PiArrowsClockwiseBold />
                                                    <span className="ml-2 text-sm font-medium">
                                                        0
                                                    </span>
                                                </div>

                                                <div
                                                    className={`flex items-center text-gray-400`}
                                                >
                                                    <FaChartLine />
                                                    <span className="ml-2 text-sm font-medium">
                                                        0
                                                    </span>
                                                </div>
                                                <HiMiniArrowUpTray />
                                            </div>
                                        </div>
                                        <figure
                                            className={`${
                                                recordOption === 'video'
                                                    ? 'w-16 h-16'
                                                    : 'w-10 h-10'
                                            } rounded-full ml-2 relative`}
                                        >
                                            {recordOption === 'video' ? (
                                                <Webcam
                                                    videoConstraints={{
                                                        facingMode: 'user',
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        borderRadius: '50%',
                                                        zIndex: 1,
                                                        position: 'relative',
                                                    }}
                                                />
                                            ) : (
                                                <Avatar
                                                    src={
                                                        userInfo?.image &&
                                                        userInfo?.image !== '0'
                                                            ? `${BASE_URL}${userInfo?.image}`
                                                            : DEFAULT_PROFILE
                                                    }
                                                    className="w-full h-full object-cover z-[1]"
                                                    alt="icon"
                                                />
                                            )}
                                            <div
                                                className={`md:h-12 ${
                                                    recordOption === 'video'
                                                        ? 'w-16 h-16'
                                                        : 'w-10 h-10'
                                                }  md:w-12 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2`}
                                            >
                                                <SpeakingAnimation />
                                            </div>
                                        </figure>
                                    </div>
                                ) : (
                                    detailsPostReply.length > 0 && (
                                        <div className="flex gap-3 md:gap-6">
                                            {userInfo?.id === data?.user_id && (
                                                <div
                                                    className={`appear-animation duration-300 relative h-10 md:h-12 min-w-10 md:min-w-12`}
                                                ></div>
                                            )}
                                            <MessageItem
                                                position="left"
                                                message={
                                                    detailsPostReply[
                                                        replyIndexCurrent
                                                    ]
                                                }
                                                setDetailsPostReply={
                                                    setDetailsPostReply
                                                }
                                                contentsChattingRef={
                                                    contentsChattingRef
                                                }
                                                setListProfile={setList}
                                            />
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        <CustomContextMenu
                            rect={rect}
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
                        />
                        <ModalDelete
                            title="TITLE_DELETE_POST"
                            subTitle="SUBTITLE_DELETE_POST"
                            isOpen={isOpen}
                            setIsOpen={setIsOpen}
                            handle={() => dispatch(deletePost(data?.id))}
                        />
                    </>
                )}
            </>
        </div>
    );
}

export default React.memo(PostItem);
