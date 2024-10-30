import React, {
    useContext,
    useEffect,
    useRef,
    useState,
    useCallback,
} from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from 'antd';
import { FaChevronLeft } from 'react-icons/fa6';
import { TbUpload, TbPinnedFilled } from 'react-icons/tb';
import { AppContext } from '../AppContext';
import { pinChannel, postsChannel } from '../redux/actions/ChannelActions';
import { barMenu, setPostActive } from '../redux/actions/PostActions';
import FooterChat from '../components/FooterChat';
import RecordModal from '../components/RecordModal';
import LoaderSkeletonPosts from '../components/LoaderSkeletonPosts';
import ListPostItems from '../components/ListPostItems';
import { FaEllipsisH } from 'react-icons/fa';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import EditChannel from '../components/EditChannel';
import { profile } from '../redux/actions/UserActions';
import Webcam from 'react-webcam';
import { DEFAULT_PROFILE } from '../constants/image.constant';
import { LANGUAGE } from '../constants/language.constant';
import { setObjectActive } from '../redux/actions/SurfActions';
import { debounce } from 'lodash';
import ScreenFull from '../components/ScreenFull';
import { CHANNEL_POSTS_RESET } from '../redux/constants/ChannelConstants';

const DOMAIN = 'https://talkie.transtechvietnam.com/';

const INITIAL_LIMIT = 2;
const INITIAL_OFFSET = 0;

const NotifyPinChannel = ({ message, show }) => (
    <div
        className={`bg-white absolute left-1/2 transform -translate-x-1/2 w-auto z-50 dark:bg-dark2Primary shadow-2xl rounded-2xl p-3 md:p-5 transition-all duration-500 ${
            show ? 'translate-y-0 mt-3' : '-translate-y-full'
        }`}
    >
        <h6 className="text-black dark:text-white">{message}</h6>
    </div>
);

export default function PostsChannel() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { state } = useLocation();
    const dispatch = useDispatch();
    const {
        isRecord,
        toggleIsRecord,
        newMessageFromFooter,
        toggleIsEditChannel,
        isFullScreen,
    } = useContext(AppContext);

    const [isSwiping, setIsSwiping] = useState(false);
    const [postsList, setPostList] = useState([]);
    const [owner, setOwner] = useState(null);
    const [isPinChannel, setIsPinChannel] = useState(false);
    const [showNotify, setShowNotify] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState('');
    const [isTurnOnCamera, setIsTurnOnCamera] = useState(false);
    const [isTurnOnCameraReply, setIsTurnOnCameraReply] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [limit, setLimit] = useState(INITIAL_LIMIT);
    const [offset, setOffset] = useState(INITIAL_OFFSET);
    const [isBottom, setIsBottom] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [isEndPost, setIsEndPost] = useState(false);

    const divRef = useRef(null);
    const contentsChattingRef = useRef(null);

    const { userInfo } = useSelector((state) => state.userProfile);
    const { post } = useSelector((state) => state.setPostActive);

    const {
        loading,
        posts,
        owner: ownerChannel,
        results,
    } = useSelector((state) => state.channelPosts);
    const { menus } = useSelector((state) => state.menuBar);
    const { channel } = useSelector((state) => state.channelPin);
    const { isSuccess: isSuccessFollow } = useSelector(
        (state) => state.userFollow,
    );
    const { language } = useSelector((state) => state.userLanguage);

    const handleScroll = useCallback(() => {
        const scrollTop =
            contentsChattingRef?.current?.scrollTop ||
            contentsChattingRef?.current?.documentElement?.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight =
            contentsChattingRef?.current?.scrollHeight ||
            contentsChattingRef?.current?.documentElement?.scrollHeight;

        if (scrollTop + windowHeight >= documentHeight - 300) {
            setIsBottom(true);
        } else {
            setIsBottom(false);
        }
    }, [contentsChattingRef]);

    const handlePinChannel = useCallback(() => {
        dispatch(pinChannel(id));
        setShowNotify(true);
        setNotifyMessage(
            isPinChannel
                ? LANGUAGE[language].CHANNEL_UNPINNED
                : LANGUAGE[language].CHANNEL_PINNED,
        );
        setTimeout(() => setShowNotify(false), 1200);
    }, [dispatch, id, isPinChannel, language]);

    useEffect(() => {
        if (channel) dispatch(barMenu());
    }, [dispatch, channel]);

    useEffect(() => {
        if (!userInfo) dispatch(profile());
    }, [dispatch]);

    useEffect(() => {
        if (menus && state?.channelData) {
            const isPinned = menus.some(
                (item) =>
                    item.name === state.channelData.name ||
                    item.name === state.channelData?.name_channel,
            );
            setIsPinChannel(isPinned);
        }
    }, [menus, state?.channelData]);

    useEffect(() => {
        dispatch(postsChannel(id, limit, offset));
    }, [dispatch, id, limit, offset]);

    useEffect(() => {
        if (results === 1 && posts?.length === 0) {
            setIsEndPost(true);
        }
    }, [results, posts]);

    useEffect(() => {
        if (posts && (ownerChannel || id === '0') && results === 1) {
            if (hasMore) {
                setPostList((prev) => [...prev, ...posts]);
            } else {
                setPostList(posts);
            }
            setOwner(ownerChannel);
            dispatch({ type: CHANNEL_POSTS_RESET });
        }
    }, [posts, ownerChannel, id, results, hasMore]);

    useEffect(() => {
        if (isBottom && !isEndPost) {
            setOffset((prev) => prev + INITIAL_LIMIT);
            setHasMore(true);
        } else {
            setHasMore(false);
        }
    }, [isBottom, isEndPost]);

    useEffect(() => {
        contentsChattingRef?.current?.addEventListener('scroll', handleScroll);
        return () => {
            contentsChattingRef?.current?.removeEventListener(
                'scroll',
                handleScroll,
            );
        };
    }, [contentsChattingRef]);

    useEffect(() => {
        const contents = contentsChattingRef.current;
        let lastScrollTop = 0;

        const handleScroll = () => {
            const currentScrollTop = contents.scrollTop;
            setIsSwiping(currentScrollTop > lastScrollTop);
            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
        };

        contents.addEventListener('scroll', handleScroll);
        return () => contents.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            debounce(([entry]) => {
                setIsVisible(entry.isIntersecting);
            }, 200),
            {
                // threshold: 0.45,
                // rootMargin: '-100px 0px -610px 0px',
                threshold: [0.3], // đa dạng giá trị threshold cho nhiều tình huống
                rootMargin: `-${Math.max(
                    window.innerHeight * 0.1,
                    100,
                )}px 0px -${Math.max(window.innerHeight * 0.75, 400)}px 0px`,
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
        if (isVisible) {
            // if (navigator.vibrate) {
            //     navigator.vibrate(100); // Rung 200ms
            // } else {
            //     console.log('Thiết bị không hỗ trợ rung.');
            // }
            dispatch(setPostActive(null));
            dispatch(
                setObjectActive({
                    post: null,
                    audio: null,
                    element: divRef.current,
                    parent: contentsChattingRef?.current,
                    video: null,
                    bonus: -70,
                }),
            );
        }
    }, [isVisible, contentsChattingRef]);

    useEffect(() => {
        if (isSuccessFollow) {
            dispatch(postsChannel(id));
        }
    }, [dispatch, id, isSuccessFollow]);

    const Dropdown = () => {
        return (
            <Menu as="div" className="relative inline-block text-left z-50">
                <MenuButton className="relative ml-4">
                    <HiOutlineDotsHorizontal className="text-xl dark:text-white md:text-[30px]" />
                </MenuButton>

                <MenuItems
                    transition
                    className="z-[999px] absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-300 divide-y dark:border-none divide-gray-200 rounded-md shadow-lg outline-none dark:bg-dark2Primary"
                >
                    <div className="py-1">
                        <MenuItem>
                            {({ active }) => (
                                <button
                                    onClick={() => toggleIsEditChannel()}
                                    className={`flex justify-between w-full px-4 py-2 text-sm dark:text-white`}
                                >
                                    {LANGUAGE[language].EDIT_CHANNEL}
                                </button>
                            )}
                        </MenuItem>
                    </div>
                </MenuItems>
            </Menu>
        );
    };

    const renderHeader = () => (
        <div
            className={`z-20 px-6 md:px-10 bg-white dark:bg-darkPrimary pb-[26px] ${
                isSwiping ? 'translate-y-[-150px] opacity-0' : 'opacity-100'
            } transition-all duration-500`}
        >
            <div className="flex justify-center items-center relative pt-12">
                <button
                    className="absolute left-0"
                    onClick={() => navigate(-1)}
                >
                    <FaChevronLeft className="text-lg md:text-[22px] text-black dark:text-white" />
                </button>
                <div className="flex items-center gap-3">
                    <Avatar
                        src={`${DOMAIN}${
                            state?.channelData?.photo ?? state?.channelData?.img
                        }`}
                        className="w-8 h-8 rounded-md object-cover"
                        alt=""
                    />
                    <h5 className="text-black dark:text-white">
                        {state?.channelData?.name}
                    </h5>
                    <div
                        onClick={handlePinChannel}
                        className="flex items-center justify-center w-7 h-7 bg-gray-200 dark:bg-slate-600 rounded-md"
                    >
                        <TbPinnedFilled
                            size="1.3rem"
                            className="opacity-30"
                            color={isPinChannel ? 'blue' : ''}
                        />
                    </div>
                </div>
                <div className="absolute right-0">
                    <button>
                        <TbUpload className="text-xl md:text-[30px] text-black dark:text-white" />
                    </button>
                    {owner && userInfo && owner === userInfo?.id && (
                        <Dropdown />
                    )}
                </div>
            </div>
        </div>
    );

    const renderContent = () => (
        <div
            ref={contentsChattingRef}
            className="flex  flex-col absolute top-0 pt-32 left-0 pb-[600px] h-screen w-screen overflow-auto scrollbar-none bg-slatePrimary dark:bg-darkPrimary"
        >
            <div
                ref={divRef}
                className="border-b-[6px]  border-gray-200 dark:border-dark2Primary flex items-center pb-4 md:pb-5 px-3 md:px-6 gap-3 md:gap-6"
            >
                <figure>
                    <div
                        className={`h-10 md:h-12 w-10 md:w-12 ${
                            isTurnOnCamera ? 'scale-[1.5]' : 'scale-[1]'
                        } rounded-full overflow-hidden transition-all  duration-300`}
                    >
                        {isTurnOnCamera ? (
                            <Webcam
                                videoConstraints={{
                                    facingMode: 'user',
                                }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        ) : (
                            <Avatar
                                src={
                                    userInfo?.image && userInfo?.image !== '0'
                                        ? `https://talkie.transtechvietnam.com/${userInfo.image}`
                                        : DEFAULT_PROFILE
                                }
                                className="w-full h-full object-cover"
                                alt="icon"
                            />
                        )}
                    </div>
                </figure>
                <div
                    onClick={toggleIsRecord}
                    className="bg-white flex-1 dark:bg-dark2Primary shadow-xl rounded-2xl w-full p-3 md:p-5"
                >
                    <h5 className="text-black dark:text-white">
                        {userInfo?.name}
                    </h5>
                    <button className="text-gray-400 w-full">
                        <textarea
                            value={
                                !isRecord && !post
                                    ? newMessageFromFooter ||
                                      LANGUAGE[language].WHAT_ON_YOUR_MIND
                                    : LANGUAGE[language].WHAT_ON_YOUR_MIND
                            }
                            readOnly={true}
                            className="w-full bg-inherit dark:text-white placeholder-white outline-none resize-none"
                            placeholder={LANGUAGE[language].WHAT_ON_YOUR_MIND}
                            style={{ minHeight: '20px' }}
                            cols="30"
                            rows="1"
                        ></textarea>
                    </button>
                </div>
            </div>

            <div className="relative bg-gray-200">
                <ListPostItems
                    postsList={postsList}
                    isTurnOnCamera={isTurnOnCameraReply}
                    contentsChattingRef={contentsChattingRef}
                />
                {loading && (
                    <div className="absolute bottom-[-450px] md:bottom-[-520px] left-0 w-full">
                        <LoaderSkeletonPosts />
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="relative flex flex-col justify-between h-screen overflow-hidden">
            {renderHeader()}
            {renderContent()}
            <EditChannel data={{ ...state?.channelData, id }} />
            <RecordModal />
            {isFullScreen && <ScreenFull postsList={postsList} />}
            <div
                onClick={toggleIsRecord}
                className={`z-40 absolute h-screen w-screen bg-black bg-opacity-10 transition-all duration-500 ${
                    isRecord
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
            />
            <FooterChat
                title="home"
                isSwiping={isSwiping}
                isPlay={true}
                setIsTurnOnCamera={
                    post ? setIsTurnOnCameraReply : setIsTurnOnCamera
                }
            />
            <NotifyPinChannel message={notifyMessage} show={showNotify} />
        </div>
    );
}
