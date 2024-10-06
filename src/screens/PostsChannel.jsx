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
import { barMenu } from '../redux/actions/PostActions';
import FooterChat from '../components/FooterChat';
import RecordModal from '../components/RecordModal';
import LoaderSkeletonPosts from '../components/LoaderSkeletonPosts';
import ListPostItems from '../components/ListPostItems';
import { FaEllipsisH } from 'react-icons/fa';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import EditChannel from '../components/EditChannel';
import { profile } from '../redux/actions/UserActions';

const DOMAIN = 'https://talkie.transtechvietnam.com/';

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
    const { isRecord, toggleIsRecord } = useContext(AppContext);
    const { isEditChannel, toggleIsEditChannel } = useContext(AppContext);

    const [isSwiping, setIsSwiping] = useState(false);
    const [postsList, setPostList] = useState([]);
    const [isPinChannel, setIsPinChannel] = useState(false);
    const [showNotify, setShowNotify] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState('');

    const contentsChattingRef = useRef(null);

    const { userInfo } = useSelector((state) => state.userProfile);
    const { loading, posts, owner } = useSelector(
        (state) => state.channelPosts,
    );
    const { menus } = useSelector((state) => state.menuBar);
    const { channel } = useSelector((state) => state.channelPin);
    const { isSuccess: isSuccessFollow } = useSelector(
        (state) => state.userFollow,
    );

    const handlePinChannel = useCallback(() => {
        dispatch(pinChannel(id));
        setShowNotify(true);
        setNotifyMessage(isPinChannel ? 'Channel unpinned' : 'Channel pinned');
        setTimeout(() => setShowNotify(false), 1200);
    }, [dispatch, id, isPinChannel]);

    useEffect(() => {
        dispatch(barMenu());
    }, [dispatch, channel]);

    useEffect(() => {
        if (!userInfo) dispatch(profile());
    }, [dispatch]);

    useEffect(() => {
        if (menus && state?.channelData) {
            const isPinned = menus.some(
                (item) => item.name === state.channelData.name,
            );
            setIsPinChannel(isPinned);
        }
    }, [menus, state?.channelData]);

    useEffect(() => {
        dispatch(postsChannel(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (posts) {
            setPostList(posts);
        }
    }, [posts]);

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
                                    Edit channel
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
                        src={`${DOMAIN}${state?.channelData?.photo}`}
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
            className="flex flex-col absolute top-0 pt-32 left-0 pb-[300px] h-screen w-screen overflow-auto scrollbar-none bg-slatePrimary dark:bg-darkPrimary"
        >
            <div className="flex items-center pb-4 md:pb-5 px-3 md:px-6 gap-3 md:gap-6 border-b-[6px] border-gray-200 dark:border-dark2Primary">
                <Avatar
                    src={`${DOMAIN}${userInfo?.image}`}
                    className="h-10 w-10 rounded-full object-cover"
                    alt="icon"
                />
                <div
                    onClick={toggleIsRecord}
                    className="bg-white flex-1 dark:bg-dark2Primary shadow-xl rounded-2xl w-full p-3 md:p-5"
                >
                    <h5 className="text-black dark:text-white">
                        {userInfo?.name}
                    </h5>
                    <button className="text-gray-400">
                        New post to followers...
                    </button>
                </div>
            </div>

            {loading ? (
                <LoaderSkeletonPosts />
            ) : (
                <ListPostItems postsList={postsList} />
            )}
        </div>
    );

    return (
        <div className="relative flex flex-col justify-between h-screen overflow-hidden">
            {renderHeader()}
            {renderContent()}
            <EditChannel data={{ ...state?.channelData, id }} />
            <RecordModal />
            <div
                onClick={toggleIsRecord}
                className={`z-40 absolute h-screen w-screen bg-black bg-opacity-10 transition-all duration-500 ${
                    isRecord
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
            />
            <FooterChat title="home" isSwiping={isSwiping} isPlay={true} />
            <NotifyPinChannel message={notifyMessage} show={showNotify} />
        </div>
    );
}
