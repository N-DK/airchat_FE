import { useParams } from 'react-router-dom';
import FooterChat from '../components/FooterChat';
import { useContext, useEffect, useRef, useState } from 'react';
import { TbUpload } from 'react-icons/tb';
import { FaChevronLeft } from 'react-icons/fa6';
import { RiAddLine } from 'react-icons/ri';
import { FaRegHeart } from 'react-icons/fa';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { HiMiniArrowUpTray } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { TbPinnedFilled } from 'react-icons/tb';
import { AppContext } from '../AppContext';
import RecordModal from '../components/RecordModal';
import { useDispatch, useSelector } from 'react-redux';
import { postsChannel } from '../redux/actions/ChannelActions';
import LoaderSkeletonPosts from './../components/LoaderSkeletonPosts';
import moment from 'moment';
import React from 'react';
import { Avatar } from 'antd';
export default function Details() {
    const { id } = useParams();
    const [isSwiping, setIsSwiping] = useState(false);
    const [isFavorites, setIsFavorites] = useState({});
    const [isChanges, setIsChanges] = useState({});
    const [isShares, setIsShares] = useState({});
    const [postsList, setPostList] = useState([]);
    const navigate = useNavigate();
    const [channel, setChannel] = useState({});
    const { isRecord, toggleIsRecord } = useContext(AppContext);
    const postRefs = useRef([]);
    const contentsChattingRef = useRef(null);
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const dispatch = useDispatch();
    const channelPosts = useSelector((state) => state.channelPosts);
    const { loading, posts } = channelPosts;

    const FavoriteHandle = (_id) => {
        setPostList((prevPostsList) =>
            prevPostsList.map((post) =>
                post._id === _id
                    ? {
                          ...post,
                          Favorites:
                              post.Favorites + (isFavorites[_id] ? -1 : 1),
                      }
                    : post,
            ),
        );
        setIsFavorites((prevState) => ({
            ...prevState,
            [_id]: !prevState[_id],
        }));
    };
    const changeHandle = (_id) => {
        setPostList((prevPostsList) =>
            prevPostsList.map((post) =>
                post._id === _id
                    ? {
                          ...post,
                          changes: post.changes + (isChanges[_id] ? -1 : 1),
                      }
                    : post,
            ),
        );
        setIsChanges((prevState) => ({
            ...prevState,
            [_id]: !prevState[_id],
        }));
    };
    const shareHandle = (_id) => {
        setPostList((prevPostsList) =>
            prevPostsList.map((post) =>
                post._id === _id
                    ? {
                          ...post,
                          shares: post.shares + (isShares[_id] ? -1 : 1),
                      }
                    : post,
            ),
        );
        setIsShares((prevState) => ({
            ...prevState,
            [_id]: !prevState[_id],
        }));
    };

    useEffect(() => {
        dispatch(postsChannel(id));
    }, [id]);

    useEffect(() => {
        setPostList(posts?.list);
        setChannel(posts?.channel);
    }, [posts]);

    useEffect(() => {
        const contents = contentsChattingRef.current;
        let lastScrollTop = 0;
        const handleScroll = () => {
            const currentScrollTop = contents.scrollTop;
            if (currentScrollTop > lastScrollTop) {
                setIsSwiping(true);
            } else {
                setIsSwiping(false);
            }
            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
        };
        contents.addEventListener('scroll', handleScroll);
        return () => {
            contents.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="relative flex flex-col justify-between h-screen overflow-hidden">
            {/* header */}
            <div
                className={`z-20 px-6 md:px-10 bg-white dark:bg-darkPrimary pb-[26px] ${
                    isSwiping ? 'translate-y-[-150px] opacity-0' : 'opacity-100'
                } transition-all duration-500`}
            >
                <div className="flex justify-between items-center relative pt-12">
                    <button className="">
                        <FaChevronLeft
                            className="text-lg md:text-[22px] text-black dark:text-white"
                            onClick={() => navigate(-1)}
                        />
                    </button>
                    <div className="flex items-center gap-3">
                        <Avatar
                            src={channel?.imgIcon}
                            className="w-8 h-8 rounded-md object-cover"
                            alt=""
                        />
                        <h5 className="text-black dark:text-white">
                            {channel?.name}
                        </h5>
                        <div className="flex items-center justify-center w-7 h-7 bg-gray-200 dark:bg-slate-600 rounded-md">
                            <TbPinnedFilled
                                size="1.3rem"
                                className="opacity-30"
                            />
                        </div>
                    </div>
                    <button className="">
                        <TbUpload className="text-xl md:text-[30px] text-black dark:text-white" />
                    </button>
                </div>
            </div>

            <div
                ref={contentsChattingRef}
                className="flex flex-col absolute top-0 pt-32 left-0 pb-[300px] h-screen w-screen overflow-auto scrollbar-none bg-slatePrimary dark:bg-darkPrimary"
            >
                <div className="flex items-center pb-4 md:pb-5 px-3 md:px-6 gap-3 md:gap-6 border-b-[6px] border-gray-200 dark:border-dark2Primary">
                    <div>
                        <Avatar
                            src={userInfo.avatar}
                            className="h-10 w-10 rounded-full object-cover"
                            alt="icon"
                        />
                    </div>
                    <div
                        onClick={() => toggleIsRecord()}
                        className="bg-white dark:bg-dark2Primary shadow-xl rounded-2xl w-full p-3 md:p-5"
                    >
                        <h5 className="text-black dark:text-white">
                            {userInfo.name}
                        </h5>
                        <button className="text-gray-400">
                            New post to followers...
                        </button>
                    </div>
                </div>

                {loading ? (
                    <LoaderSkeletonPosts />
                ) : (
                    postsList?.map((post, i) => (
                        <div
                            key={i}
                            ref={(el) => (postRefs.current[i] = el)}
                            className="border-b-[6px] py-6 md:py-10 border-gray-200 dark:border-dark2Primary"
                        >
                            <div className="flex px-3 md:px-6 gap-3 md:gap-6 bg-slatePrimary dark:bg-darkPrimary">
                                <div className="relative h-10 md:h-12 min-w-10 md:min-w-12">
                                    <img
                                        src={post?.avatar}
                                        className="absolute top-0 left-0 z-10 h-10 md:h-12 w-10 md:w-12 rounded-full object-cover"
                                        alt="icon"
                                    />
                                    <div className="absolute bottom-0 right-[-3px] z-10 bg-blue-500 border border-white rounded-full">
                                        <RiAddLine
                                            size="1.1rem"
                                            className="p-[2px] text-white"
                                        />
                                    </div>
                                    <div
                                        className={`absolute top-0 left-0 bg-red-300 h-10 md:h-12 w-10 md:w-12 rounded-full`}
                                    ></div>
                                </div>

                                <div className="w-full">
                                    <div className="relative bg-white dark:bg-dark2Primary rounded-2xl w-full px-4 pb-5 pt-3">
                                        <div
                                            onClick={() =>
                                                navigate(
                                                    `/posts/details/${post._id}`,
                                                )
                                            }
                                        >
                                            <div className="flex items-center gap-[5px]">
                                                <h5 className="md:text-xl text-black dark:text-white">
                                                    {post.name}
                                                </h5>
                                                <span className="text-gray-500 dark:text-gray-400 font-medium text-sm md:text-base">
                                                    {moment(post.time).fromNow(
                                                        true,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="w-full">
                                                <p className="text-left text-black dark:text-white line-clamp-5 md:text-lg">
                                                    {post.contents}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="absolute bottom-[-22px] right-0 border-[5px] border-slatePrimary dark:border-darkPrimary flex gap-4 bg-white dark:bg-dark2Primary rounded-3xl px-3 py-[3px]">
                                            <div
                                                className={`${
                                                    isFavorites[post._id]
                                                        ? 'opacity-100 text-red-600'
                                                        : 'opacity-40 dark:text-white'
                                                }  flex items-center gap-[6px]`}
                                            >
                                                <FaRegHeart
                                                    onClick={() =>
                                                        FavoriteHandle(post._id)
                                                    }
                                                />
                                                <span className="text-sm font-medium">
                                                    {post.Favorites}
                                                </span>
                                            </div>
                                            <div
                                                className={`${
                                                    isChanges[post._id]
                                                        ? 'opacity-100 text-green-600'
                                                        : 'opacity-40 dark:text-white'
                                                }  flex items-center gap-[6px]`}
                                            >
                                                <PiArrowsClockwiseBold
                                                    onClick={() =>
                                                        changeHandle(post._id)
                                                    }
                                                />
                                                <span className="text-sm font-medium">
                                                    {post.changes}
                                                </span>
                                            </div>
                                            <div
                                                className={`${
                                                    isShares[post._id]
                                                        ? 'opacity-100 text-black'
                                                        : 'opacity-40 dark:text-white'
                                                } ml-6 flex items-center gap-4`}
                                            >
                                                <span className="text-sm font-medium">
                                                    {post.shares}
                                                </span>
                                                <HiMiniArrowUpTray
                                                    onClick={() =>
                                                        shareHandle(post._id)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative mt-9 pb-12">
                                        {post?.usersComment
                                            .slice(0, 3)
                                            .map((img, index) => (
                                                <img
                                                    key={index}
                                                    src={img.avatar}
                                                    className="absolute top-0 h-[31px] w-[31px] object-cover rounded-full border-[3px] border-white"
                                                    style={{
                                                        left: `${index * 19}px`,
                                                    }}
                                                    alt=""
                                                />
                                            ))}
                                        <span
                                            className={`absolute top-0 ${
                                                post.usersComment.length >= 3
                                                    ? 'left-[78px]'
                                                    : post.usersComment
                                                          .length == 2
                                                    ? 'left-[60px]'
                                                    : post.usersComment
                                                          .length == 1 &&
                                                      'left-[40px]'
                                            } text-[16px] text-zinc-400`}
                                        >
                                            {post.usersComment.length} people
                                            talking
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* modal */}
            <RecordModal />

            <div
                onClick={() => toggleIsRecord()}
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
