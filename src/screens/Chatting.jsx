import React, { useContext, useEffect, useRef, useState } from 'react';
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
    // const [postsList, setPostsList] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { search } = useLocation();
    let redirect = search.split('=')[1] || 'for-you';

    const { userInfo } = useSelector((state) => state.userProfile);
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

    const modalHandle = () => {
        if (isAddChannel) toggleIsAddChannel();
        if (isRecord) toggleIsRecord();
    };

    useEffect(() => {
        const contents = contentsChattingRef.current;
        if (loading || !contents) return;

        let lastScrollTop = 0;
        const handleScroll = () => {
            const { scrollTop, clientHeight, scrollHeight } = contents;
            setIsSwiping(scrollTop > lastScrollTop);
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

            if (!hasMore) return;

            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
            if (isAtBottom) setPage((prevPage) => prevPage + 1);
        };

        contents.addEventListener('scroll', handleScroll);
        return () => contents.removeEventListener('scroll', handleScroll);
    }, [hasMore, loading]);

    useEffect(() => {
        if (pages && page !== 1) {
            dispatch(listPost(redirect, page));
            if (page === pages || page - 1 === pages) {
                setHasMore(false);
            }
        }
    }, [page, pages, redirect, dispatch]);

    useEffect(() => {
        const contents = contentsChattingRef.current;
        if (contents) contents.scrollTo({ top: 0 });

        setPage(1);
        setHasMore(true);
        // setPostsList([]);

        if (redirect === 'see-all') {
            navigate('/seeall');
        } else {
            dispatch(listPost(redirect, INITIAL_LIMIT, INITIAL_OFFSET));
        }
    }, [redirect, navigate, dispatch]);

    // useEffect(() => {
    //     if (postListData?.length > 0) {
    //         console.log('postListData', postListData);
    //         setPostsList((prevPostsList) => {
    //             // Lọc ra các bài đăng đã thay đổi hoặc mới
    //             const updatedPosts = postListData.filter((newPost) => {
    //                 const existingPost = prevPostsList.find(
    //                     (post) => post.id === newPost.id,
    //                 );
    //                 // Nếu không tìm thấy bài cũ hoặc nội dung bài đăng thay đổi
    //                 return (
    //                     !existingPost ||
    //                     JSON.stringify(existingPost) !== JSON.stringify(newPost)
    //                 );
    //             });

    //             // Nếu bài đăng tồn tại, cập nhật bài đó, nếu không thì thêm bài mới
    //             const mergedPosts = prevPostsList.map(
    //                 (post) =>
    //                     updatedPosts.find(
    //                         (updatedPost) => updatedPost.id === post.id,
    //                     ) || post,
    //             );

    //             // Thêm các bài mới vào danh sách nếu chúng không có trong danh sách cũ
    //             const newPosts = updatedPosts.filter(
    //                 (newPost) =>
    //                     !prevPostsList.some((post) => post.id === newPost.id),
    //             );

    //             return [...mergedPosts, ...newPosts];
    //         });
    //     }
    // }, [postListData]);

    useEffect(() => {
        dispatch(profile());
        dispatch(barMenu());
    }, [dispatch]);

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
                    {postListData?.length > 0 && (
                        <ListPostItems
                            postsList={postListData}
                            postRefs={postRefs}
                        />
                    )}

                    <div className="absolute bottom-[-450px] md:bottom-[-520px] left-0 w-full">
                        <LoaderSkeletonPosts />
                    </div>
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
