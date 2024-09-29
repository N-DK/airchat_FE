import React, {
    useContext,
    useEffect,
    useRef,
    useState,
    useCallback,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from 'antd';

import HeaderChat from '../components/HeaderChat';
import FooterChat from '../components/FooterChat';
import AddChannel from '../components/AddChannel';
import RecordModal from '../components/RecordModal';
import ScreenFull from '../components/ScreenFull';
import LoaderSkeletonPosts from '../components/LoaderSkeletonPosts';
import ListPostItems from '../components/ListPostItems';

import { AppContext } from '../AppContext';
import { usePingStates } from '../hooks/usePingStates';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { DEFAULT_PROFILE } from '../constants/image.constant';
import { barMenu, listPost } from '../redux/actions/PostActions';
import { profile } from '../redux/actions/UserActions';

const INITIAL_LIMIT = 100;
const INITIAL_OFFSET = 0;

export default function Chatting() {
    const contentsChattingRef = useRef(null);
    const postRefs = useRef([]);
    const [isSwiping, setIsSwiping] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { search } = useLocation();
    const redirect = search.split('=')[1] || 'for-you';

    const { userInfo } = useSelector((state) => state.userProfile);
    const { isSuccess: isSuccessFollow } = useSelector(
        (state) => state.userFollow,
    );
    const {
        posts: postListData,
        pages,
        loading,
    } = useSelector((state) => state.postList);

    const {
        isAddChannel,
        isRecord,
        toggleIsAddChannel,
        toggleIsRecord,
        isRunAuto,
        isRunSpeed,
        isFullScreen,
    } = useContext(AppContext);

    const { pingStates, setPingStates, checkPingStates, currentItemIndex } =
        usePingStates(postListData, postRefs);

    useAutoScroll(
        contentsChattingRef,
        postRefs,
        currentItemIndex,
        isRunAuto,
        isRunSpeed,
        checkPingStates,
        setPingStates,
        postListData,
    );

    const modalHandle = useCallback(() => {
        if (isAddChannel) toggleIsAddChannel();
        if (isRecord) toggleIsRecord();
    }, [isAddChannel, isRecord, toggleIsAddChannel, toggleIsRecord]);

    const handleScroll = useCallback(() => {
        const contents = contentsChattingRef.current;
        if (!contents || !hasMore) return;

        const { scrollTop, clientHeight, scrollHeight } = contents;
        setIsSwiping(scrollTop > contents.lastScrollTop);
        contents.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

        if (scrollTop + clientHeight >= scrollHeight - 1) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [hasMore]);

    useEffect(() => {
        const contents = contentsChattingRef.current;
        if (loading || !contents) return;

        contents.addEventListener('scroll', handleScroll);
        return () => contents.removeEventListener('scroll', handleScroll);
    }, [loading, handleScroll]);

    useEffect(() => {
        if (pages && page !== 1) {
            dispatch(
                listPost(redirect, INITIAL_LIMIT, (page - 1) * INITIAL_LIMIT),
            );
            if (page >= pages) {
                setHasMore(false);
            }
        }
    }, [page, pages, redirect, dispatch]);

    useEffect(() => {
        const contents = contentsChattingRef.current;
        if (contents) contents.scrollTo({ top: 0 });

        setPage(1);
        setHasMore(true);

        if (redirect === 'see-all') {
            navigate('/seeall');
        } else if (redirect.includes('group-channel')) {
            const channel_id = redirect.split('/')[1];
            dispatch(
                listPost(
                    redirect.split('/')[0],
                    INITIAL_LIMIT,
                    INITIAL_OFFSET,
                    channel_id,
                    1,
                ),
            );
        } else {
            dispatch(listPost(redirect, INITIAL_LIMIT, INITIAL_OFFSET));
        }
    }, [redirect, navigate, dispatch]);

    useEffect(() => {
        dispatch(profile());
        dispatch(barMenu());
    }, [dispatch]);

    useEffect(() => {
        if (isSuccessFollow) {
            dispatch(listPost(redirect, INITIAL_LIMIT, INITIAL_OFFSET));
        }
    }, [isSuccessFollow, dispatch, redirect]);

    if (!postListData) return null;

    return (
        <div className="relative flex flex-col justify-between h-screen overflow-hidden">
            <HeaderChat title={redirect} isSwiping={isSwiping} />

            <div
                ref={contentsChattingRef}
                className="absolute top-0 left-0 pb-[540px] h-screen w-screen overflow-auto scrollbar-none bg-slatePrimary dark:bg-darkPrimary"
            >
                <div className="border-b-[6px] border-gray-200 dark:border-dark2Primary flex items-center pb-4 md:pb-5 pt-[164px] md:pt-[170px] px-3 md:px-6 gap-3 md:gap-6">
                    <Avatar
                        src={
                            userInfo?.image && userInfo?.image !== '0'
                                ? `https://talkie.transtechvietnam.com/${userInfo.image}`
                                : DEFAULT_PROFILE
                        }
                        className="h-10 md:h-12 min-w-10 md:min-w-12 rounded-full object-cover"
                        alt="icon"
                    />
                    <div
                        onClick={toggleIsRecord}
                        className="bg-white dark:bg-dark2Primary shadow-xl rounded-2xl w-full p-3 md:p-5"
                    >
                        <h5 className="text-black dark:text-white">
                            {userInfo?.name}
                        </h5>
                        <button className="text-gray-400">
                            What's on your mind?
                        </button>
                    </div>
                </div>

                <div className="relative bg-gray-200">
                    {postListData.length > 0 && (
                        <ListPostItems postsList={postListData} />
                    )}
                    {loading && (
                        <div className="absolute bottom-[-450px] md:bottom-[-520px] left-0 w-full">
                            <LoaderSkeletonPosts />
                        </div>
                    )}
                </div>
            </div>

            <AddChannel />
            <RecordModal />
            {isFullScreen && <ScreenFull postsList={postListData} />}

            <div
                onClick={modalHandle}
                className={`z-40 absolute h-screen w-screen bg-black bg-opacity-10 transition-all duration-500 ${
                    isAddChannel || isRecord
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
            />

            <FooterChat title="chatting" isSwiping={isSwiping} isPlay={true} />
        </div>
    );
}
