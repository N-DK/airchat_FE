import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Avatar } from 'antd';
import {
    FaChevronLeft,
    FaRegHeart,
    FaChartLine,
    FaHeart,
} from 'react-icons/fa';
import { TbUpload } from 'react-icons/tb';
import { RiAddLine } from 'react-icons/ri';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { HiMiniArrowUpTray } from 'react-icons/hi2';

import { AppContext } from '../AppContext';
import { bookMark, detailsPost, heart } from '../redux/actions/PostActions';
import FooterChat from '../components/FooterChat';
import RecordModal from '../components/RecordModal';
import LoaderSkeletonPosts from '../components/LoaderSkeletonPosts';
import MessageItem from '../components/MessageItem';
import icon1 from '../assets/Untitled-2.png';
import { sharePost } from '../redux/actions/UserActions';
import CustomContextMenu from '../components/CustomContextMenu';
import { FaBookmark } from 'react-icons/fa6';

export default function Details() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { isRecord, toggleIsRecord } = useContext(AppContext);

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
    const pressTimer = useRef();
    const [initialLoad, setInitialLoad] = useState(true);

    const contentsChattingRef = useRef(null);
    const postRefs = useRef([]);

    const { post, loading } = useSelector((state) => state.postDetails);

    const userId = new URLSearchParams(location.search).get('userId') || null;

    useEffect(() => {
        if (post) {
            setData(post);
            setDetailsPostReply(post?.reply || []);
        }
    }, [post]);

    useEffect(() => {
        dispatch(detailsPost(id, userId));
    }, [dispatch, id, userId]);

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
        if (data && !isHeart) setInitialLoad(false);
    }, [isHeart, data]);

    const handleTouchStart = (e) => {
        pressTimer.current = setTimeout(() => {
            setTargetElement(
                document.getElementById(`post-item-reply-${data?.id}`),
            );
            setContextMenuVisible(true);
        }, 500);
    };

    const handleTouchEnd = () => {
        clearTimeout(pressTimer.current);
    };

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

    const handleBookMark = () => {
        dispatch(bookMark(data?.id));
        setIsBookMark((prev) => {
            setData((prev) => ({
                ...prev,
                bookmark: !prev,
            }));
            return !prev;
        });
    };

    const closeContextMenu = () => setContextMenuVisible(false);

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
            className={`z-20 px-6 md:px-10 bg-white dark:bg-darkPrimary pb-[10px] ${
                isSwiping ? 'translate-y-[-150px] opacity-0' : 'opacity-100'
            } transition-all duration-500`}
        >
            <div className="flex justify-between items-center relative pt-12">
                <button onClick={() => navigate(-1)}>
                    <FaChevronLeft className="text-lg md:text-[22px] text-black dark:text-white" />
                </button>
                <img src={icon1} className="w-9" alt="" />
                <button>
                    <TbUpload className="text-xl md:text-[30px] text-black dark:text-white" />
                </button>
            </div>
            <div className="flex justify-center mt-1">
                <p className="text-gray-500 text-sm">
                    in {data?.name_channel ?? 'Just Chatting'}
                </p>
            </div>
        </div>
    );

    const renderPostContent = () => (
        <div
            ref={(el) => (postRefs.current[0] = el)}
            className="flex mt-[120px] py-6 pb-10 md:py-10 px-3 md:px-6 gap-3 md:gap-6 bg-slatePrimary dark:bg-darkPrimary border-b border-b-slatePrimary dark:border-b-dark2Primary"
        >
            <div className="relative h-10 md:h-12 min-w-10 md:min-w-12">
                <Avatar
                    src={`https://talkie.transtechvietnam.com/${data?.avatar}`}
                    className="absolute top-0 left-0 z-10 h-10 md:h-12 w-10 md:w-12 rounded-full object-cover"
                    alt="icon"
                />
                <div className="absolute bottom-0 right-[-3px] z-10 bg-blue-500 border border-white rounded-full">
                    <RiAddLine size="1.1rem" className="p-[2px] text-white" />
                </div>
                <div className="absolute top-0 left-0 bg-red-300 h-10 md:h-12 w-10 md:w-12 rounded-full"></div>
            </div>

            <div className="w-full">
                <div className="relative bg-white dark:bg-dark2Primary rounded-2xl w-full px-4 pb-5 pt-3">
                    <div
                        id={`post-item-reply-${data?.id}`}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div className="flex items-center gap-[5px]">
                            <h5 className="md:text-xl text-black dark:text-white">
                                {data?.name}
                            </h5>
                            <span className="text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base">
                                {moment.unix(data?.create_at).fromNow(true)}
                            </span>
                        </div>
                        <p className="md:text-lg text-black dark:text-white">
                            {data?.content}
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

                {data?.reply?.length > 0 && (
                    <div className="relative mt-9 pb-12">
                        {data?.reply?.map((img, index) => (
                            <Avatar
                                key={index}
                                onClick={() => setIndexCommentPresent(index)}
                                src={`https://talkie.transtechvietnam.com/${img.avatar}`}
                                className={`absolute top-0 h-[45px] w-[45px] object-cover rounded-full border-[3px] p-[3px] ${
                                    indexCommentPresent === index
                                        ? 'border-bluePrimary'
                                        : ''
                                }`}
                                style={{ left: `${index * 48}px` }}
                                alt=""
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <div className="relative flex flex-col justify-between h-screen overflow-hidden">
                {renderHeader()}

                <div
                    ref={contentsChattingRef}
                    className="absolute top-0 left-0 pb-[540px] max-h-screen w-screen overflow-auto scrollbar-none bg-slatePrimary dark:bg-darkPrimary"
                >
                    {loading ? (
                        <div className="mt-[120px]">
                            <LoaderSkeletonPosts />
                        </div>
                    ) : (
                        <>
                            {renderPostContent()}
                            {detailsPostReply?.length > 0 && (
                                <div className="pb-5 pt-3 px-3">
                                    <MessageItem
                                        position="left"
                                        message={
                                            detailsPostReply[
                                                indexCommentPresent
                                            ]
                                        }
                                        setDetailsPostReply={
                                            setDetailsPostReply
                                        }
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>

                <RecordModal />

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
            />
        </>
    );
}
