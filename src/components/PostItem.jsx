import React, {
    useState,
    useMemo,
    useEffect,
    useRef,
    useCallback,
} from 'react';
import moment from 'moment';
import { Avatar } from 'antd';
import { RiAddLine } from 'react-icons/ri';
import { FaHeart, FaRegHeart, FaChartLine } from 'react-icons/fa';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { HiMiniArrowUpTray } from 'react-icons/hi2';
import { Link, useNavigate } from 'react-router-dom';
import { usePingStates } from '../hooks/usePingStates';
import { useDispatch, useSelector } from 'react-redux';
import { bookMark, heart, setPostActive } from '../redux/actions/PostActions';
import MessageItem from './MessageItem';
import { addViewPost, follow, sharePost } from '../redux/actions/UserActions';
import CustomContextMenu from './CustomContextMenu';
import { FaBookmark } from 'react-icons/fa6';
import { setObjectActive } from '../redux/actions/SurfActions';
import { debounce } from 'lodash';
import LinkPreviewComponent from './LinkPreviewComponent';

const BASE_URL = 'https://talkie.transtechvietnam.com/';

function PostItem({ item, contentsChattingRef, setList }) {
    const navigate = useNavigate();
    const { pingStates } = usePingStates();
    const dispatch = useDispatch();
    const [likeCount, setLikeCount] = useState(item?.number_heart ?? 0);
    const [isHeart, setIsHeart] = useState(!!item?.heart);
    const [isBookMark, setIsBookMark] = useState(!!item?.bookmark);
    const [shareCount, setShareCount] = useState(item?.number_share ?? 0);
    const [isShare, setIsShare] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const { userInfo } = useSelector((state) => state.userProfile);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [targetElement, setTargetElement] = useState(null);
    const [data, setData] = useState(item);
    const [initialLoad, setInitialLoad] = useState(true);
    const [replyIndexCurrent, setReplyIndexCurrent] = useState(0);
    const [detailsPostReply, setDetailsPostReply] = useState([]);

    const divRef = useRef(null);
    const pressTimer = useRef();

    const handleTouchStart = useCallback(() => {
        pressTimer.current = setTimeout(() => {
            setTargetElement(document.getElementById(`post-item-${data?.id}`));
            setContextMenuVisible(true);
        }, 500);
    }, [data?.id]);

    const handleTouchEnd = useCallback(() => {
        clearTimeout(pressTimer.current);
    }, []);

    const closeContextMenu = useCallback(
        () => setContextMenuVisible(false),
        [],
    );

    useEffect(() => {
        if (item) {
            setDetailsPostReply(item?.reply || []);
        }
    }, [item]);

    const postDetailsUrl = useMemo(() => {
        const baseUrl = `/posts/details/${data?.id}`;
        return data?.reply?.length > 0
            ? `${baseUrl}?userId=${data?.reply[0].user_id}`
            : baseUrl;
    }, [data?.id, data?.reply]);

    useEffect(() => {
        setLikeCount(data?.number_heart ?? 0);
        setIsHeart(!!data?.heart);
        setShareCount(data?.number_share ?? 0);
        setIsShare(!!data?.share);
        setIsBookMark(!!data?.bookmark);
    }, [data]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            debounce(([entry]) => {
                setIsVisible(entry.isIntersecting);
            }, 200),
            {
                threshold: 0.5,
                rootMargin: '-200px 0px -510px 0px',
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
    }, []);

    useEffect(() => {
        if (!isHeart) setInitialLoad(false);
    }, [isHeart]);

    useEffect(() => {
        if (isVisible) {
            dispatch(setPostActive(data));
            dispatch(
                setObjectActive({
                    post: data,
                    audio: data?.audio
                        ? new Audio(
                              `https://talkie.transtechvietnam.com/${data?.audio}`,
                          )
                        : null,
                    element: document.getElementById(`post-item-${data?.id}`),
                    parent: contentsChattingRef?.current,
                }),
            );
        }
    }, [isVisible, contentsChattingRef]);

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
                bookmark: !prev,
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
            <div className="relative h-10 md:h-12 min-w-10 md:min-w-12">
                <Link to={`/profile/${data?.user_id}`}>
                    <Avatar
                        src={`${BASE_URL}${data?.avatar}`}
                        className="absolute top-0 left-0 z-10 h-10 md:h-12 w-10 md:w-12 rounded-full object-cover"
                        alt="icon"
                    />
                </Link>
                <div
                    onClick={handleFollow}
                    className={`absolute bottom-0 right-[-3px] z-20 bg-blue-500 rounded-full ${
                        (data?.dafollow === null || data?.dafollow <= 0) &&
                        userInfo?.id !== item?.user_id
                            ? 'border border-white'
                            : ''
                    }`}
                >
                    {(data?.dafollow === null || data?.dafollow <= 0) &&
                        userInfo?.id !== item?.user_id && (
                            <RiAddLine
                                size="1.1rem"
                                className="p-[2px] text-white"
                            />
                        )}
                </div>
                <div
                    className={`absolute top-0 left-0 bg-red-300 h-10 md:h-12 w-10 md:w-12 rounded-full ${
                        pingStates[data?.id] ? 'animate-ping' : ''
                    }`}
                ></div>
            </div>

            <div className="w-full">
                <div
                    ref={divRef}
                    className={`relative transition-all bg-white dark:bg-dark2Primary duration-300 rounded-2xl w-full px-4 pb-5 pt-3 ${
                        userInfo?.id === data?.user_id
                            ? 'bg-blue-100 dark:bg-blue-900'
                            : ''
                    } ${isVisible ? 'shadow-2xl scale-[1.02]' : 'shadow-md'}`}
                >
                    <div
                        id={`post-item-${data?.id}`}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onClick={() =>
                            !contextMenuVisible && handleOnClickPost()
                        }
                    >
                        <div className="flex items-center gap-[5px]">
                            <h5 className="line-clamp-1 md:text-xl text-black dark:text-white">
                                {data?.name}
                            </h5>
                            {data?.name_channel && (
                                <span className="text-bluePrimary">in</span>
                            )}
                            <span className="line-clamp-1 text-bluePrimary font-medium">
                                {data?.name_channel}
                            </span>
                            <span className="whitespace-nowrap text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base">
                                {moment.unix(data?.create_at).fromNow(true)}
                            </span>
                        </div>
                        <p className="text-left line-clamp-5 md:text-lg text-black dark:text-white">
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
                                <Avatar
                                    src={`https://talkie.transtechvietnam.com/${data?.img}`}
                                    className="min-h-40 h-full w-full object-cover rounded-xl"
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
                        <div className={`flex items-center text-gray-400`}>
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
                                    color={`${isShare ? 'green' : ''}`}
                                />
                            }
                            count={shareCount}
                        />
                        {isBookMark && (
                            <ActionButton
                                onClick={handleBookMark}
                                icon={
                                    <FaBookmark className="text-purple-700 text-[0.9rem]" />
                                }
                            />
                        )}
                        <ActionButton
                            icon={<FaChartLine />}
                            count={data?.number_view}
                        />
                        <HiMiniArrowUpTray />
                    </div>
                </div>
                <div className="flex items-center mt-5">
                    {item?.reply?.map((reply, index) => (
                        <Avatar
                            onClick={() => setReplyIndexCurrent(index)}
                            key={index}
                            src={`${BASE_URL}${reply.avatar}`}
                            className={`${
                                replyIndexCurrent === index
                                    ? 'border-2 border-blue-400'
                                    : ''
                            } mr-2`}
                        />
                    ))}
                </div>
                <div className="flex-1 mb-2">
                    {/* {item?.reply?.map(
                        (reply, index) =>
                            index === replyIndexCurrent && (
                                <MessageItem
                                    key={index}
                                    position={'left'}
                                    message={reply}
                                />
                            ),
                    )} */}
                    {detailsPostReply.length > 0 && (
                        <MessageItem
                            position="left"
                            message={detailsPostReply[replyIndexCurrent]}
                            setDetailsPostReply={setDetailsPostReply}
                        />
                    )}
                </div>
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
            />
        </div>
    );
}

export default React.memo(PostItem);
