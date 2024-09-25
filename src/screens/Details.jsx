import React, { useContext, useEffect, useRef, useState } from 'react';
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
import { detailsPost, heart } from '../redux/actions/PostActions';
import FooterChat from '../components/FooterChat';
import RecordModal from '../components/RecordModal';
import LoaderSkeletonPosts from '../components/LoaderSkeletonPosts';
import MessageItem from '../components/MessageItem';
import icon1 from '../assets/Untitled-2.png';

export default function Details() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { isRecord, toggleIsRecord } = useContext(AppContext);

    const [isSwiping, setIsSwiping] = useState(false);
    const [detailsPostReply, setDetailsPostReply] = useState([]);
    const [indexCommentPresent, setIndexCommentPresent] = useState(0);
    const [isHeart, setIsHeart] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const contentsChattingRef = useRef(null);
    const postRefs = useRef([]);

    const { post, loading } = useSelector((state) => state.postDetails);

    const userId = new URLSearchParams(location.search).get('userId') || null;

    useEffect(() => {
        dispatch(detailsPost(id, userId));
    }, [dispatch, id, userId]);

    useEffect(() => {
        if (post) {
            setDetailsPostReply(post.reply || []);
            setLikeCount(post?.number_heart ?? 0);
            setIsHeart(!!post?.heart);
        }
    }, [post]);

    // useEffect(() => {
    //     const contents = contentsChattingRef.current;
    //     let lastScrollTop = 0;

    //     const handleScroll = () => {
    //         const currentScrollTop = contents.scrollTop;
    //         setIsSwiping(currentScrollTop > lastScrollTop);
    //         lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    //     };

    //     contents.addEventListener('scroll', handleScroll);
    //     return () => contents.removeEventListener('scroll', handleScroll);
    // }, []);

    const handleHeart = () => {
        dispatch(heart(post?.id));
        setLikeCount((prev) => prev + (isHeart ? -1 : 1));
        setIsHeart(!isHeart);
    };

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
                    in {post?.name_channel ?? 'Just Chatting'}
                </p>
            </div>
        </div>
    );

    const renderPostContent = () => (
        <div
            ref={(el) => (postRefs.current[0] = el)}
            className="flex mt-[120px] py-6 md:py-10 px-3 md:px-6 gap-3 md:gap-6 bg-slatePrimary dark:bg-darkPrimary border border-bottom"
        >
            <div className="relative h-10 md:h-12 min-w-10 md:min-w-12">
                <Avatar
                    src={`https://talkie.transtechvietnam.com/${post?.avatar}`}
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
                    <div className="flex items-center gap-[5px]">
                        <h5 className="md:text-xl text-black dark:text-white">
                            {post.name}
                        </h5>
                        <span className="text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base">
                            {moment.unix(post.create_at).fromNow(true)}
                        </span>
                    </div>
                    <p className="md:text-lg text-black dark:text-white">
                        {post.content}
                    </p>
                    <div className="absolute items-center bottom-[-22px] right-0 border-[5px] border-slatePrimary dark:border-darkPrimary flex gap-4 bg-white dark:bg-dark2Primary rounded-3xl px-3 py-[3px]">
                        {[
                            {
                                icon: isHeart ? (
                                    <FaHeart className="text-red-500" />
                                ) : (
                                    <FaRegHeart />
                                ),
                                count: likeCount,
                            },
                            {
                                icon: <PiArrowsClockwiseBold />,
                                count: post?.number_view,
                            },
                            {
                                icon: <FaChartLine />,
                                count: post?.number_share,
                            },
                        ].map((item, index) => (
                            <div
                                onClick={index === 0 ? handleHeart : undefined}
                                key={index}
                                className="flex items-center text-gray-400"
                            >
                                {item.icon}
                                <span className="ml-2 text-sm font-medium">
                                    {item.count}
                                </span>
                            </div>
                        ))}
                        <HiMiniArrowUpTray />
                    </div>
                </div>

                {post?.reply?.length > 0 && (
                    <div className="relative mt-9 pb-12">
                        {post?.reply?.map((img, index) => (
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
                                        detailsPostReply[indexCommentPresent]
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
    );
}
