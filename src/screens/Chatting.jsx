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
import { barMenu, listPost, setPostActive } from '../redux/actions/PostActions';
import { profile, saveFCMToken } from '../redux/actions/UserActions';

import { CHANNEL_ADD_RESET } from '../redux/constants/ChannelConstants';
import Webcam from 'react-webcam';
import { debounce } from 'lodash';
import { setObjectActive } from '../redux/actions/SurfActions';
import { LANGUAGE } from '../constants/language.constant';
import { POST_LIST_RESET } from '../redux/constants/PostConstants';

const INITIAL_LIMIT = 10;
const INITIAL_OFFSET = 0;

const NotifyPinChannel = ({ message, show }) => (
    <div
        className={`bg-white absolute left-1/2 transform -translate-x-1/2 w-auto z-50 dark:bg-dark2Primary shadow-2xl rounded-2xl p-3 md:p-5 transition-all duration-500 ${
            show
                ? 'translate-y-0 mt-3 opacity-100'
                : '-translate-y-full opacity-0'
        }`}
    >
        <h6 className="text-black dark:text-white">{message}</h6>
    </div>
);

export default function Chatting() {
    const { search } = useLocation();
    const postRefs = useRef([]);
    const [isSwiping, setIsSwiping] = useState(false);
    const [showNotify, setShowNotify] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState('');
    const [isTurnOnCamera, setIsTurnOnCamera] = useState(false);
    const [isTurnOnCameraReply, setIsTurnOnCameraReply] = useState(false);
    const [postListData, setPostListData] = useState(null);
    const [isBottom, setIsBottom] = useState(false);
    const [limit, setLimit] = useState(INITIAL_LIMIT);
    const [offset, setOffset] = useState(INITIAL_OFFSET);
    const [hasMore, setHasMore] = useState(false);
    const [isEndPost, setIsEndPost] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const redirect = search.split('=')[1] || 'for-you';

    const { post } = useSelector((state) => state.setPostActive);
    const { userInfo } = useSelector((state) => state.userProfile);
    const { channel, error } = useSelector((state) => state.channelAdd);
    const { posts, loading, results } = useSelector((state) => state.postList);
    const { data: dataFCMToken } = useSelector(
        (state) => state.userSaveFCMToken,
    );

    const getFirebaseRef = useRef(null);
    const saveFirebaseTokenRef = useRef(null);
    const contentsChattingRef = useRef(null);
    const divRef = useRef(null);

    const {
        isAddChannel,
        isRecord,
        toggleIsAddChannel,
        toggleIsRecord,
        isRunAuto,
        isRunSpeed,
        isFullScreen,
        newMessageFromFooter,
        language,
    } = useContext(AppContext);

    const { pingStates, setPingStates, checkPingStates, currentItemIndex } =
        usePingStates(postListData ?? [], postRefs);

    useAutoScroll(
        contentsChattingRef,
        postRefs,
        currentItemIndex,
        isRunAuto,
        isRunSpeed,
        checkPingStates,
        setPingStates,
        postListData ?? [],
    );

    const modalHandle = useCallback(() => {
        if (isAddChannel) toggleIsAddChannel();
        if (isRecord) toggleIsRecord();
    }, [isAddChannel, isRecord, toggleIsAddChannel, toggleIsRecord]);

    const handleAction = useCallback(
        (type, channel_id) => {
            const intType = type === 'trending' ? 1 : 0;
            handleResetLimit();
            setIsEndPost(false);
            setHasMore(false);
            dispatch(
                listPost(
                    redirect.split('/')[0],
                    INITIAL_LIMIT,
                    INITIAL_OFFSET,
                    channel_id,
                    intType,
                ),
            );
        },
        [redirect],
    );

    const handleScroll = useCallback(() => {
        const contents = contentsChattingRef?.current;
        if (!contents) return;

        const { scrollTop: scTop, clientHeight, scrollHeight } = contents;
        setIsSwiping(scTop > contents.lastScrollTop);
        contents.lastScrollTop = scTop <= 0 ? 0 : scTop;

        const scrollTop =
            contents.scrollTop || contents.documentElement?.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight =
            contents.scrollHeight || contents.documentElement?.scrollHeight;

        if (scrollTop + windowHeight >= documentHeight - 600) {
            setIsBottom(true);
        } else {
            setIsBottom(false);
        }
    }, [contentsChattingRef]);

    const handleResetLimit = useCallback(() => {
        setLimit(INITIAL_LIMIT);
        setOffset(INITIAL_OFFSET);
    }, [redirect, contentsChattingRef]);

    useEffect(() => {
        if (redirect) {
            handleResetLimit();
            setPostListData(null);
            setIsEndPost(false);
            setHasMore(false);
            contentsChattingRef?.current?.scrollTo({ top: 0 });
        }
    }, [redirect, handleResetLimit, contentsChattingRef]);

    useEffect(() => {
        const contents = contentsChattingRef?.current;
        if (loading || !contents) return;

        contents.addEventListener('scroll', handleScroll);
        return () => {
            contents.removeEventListener('scroll', handleScroll);
        };
    }, [loading, contentsChattingRef]);

    useEffect(() => {
        if (isBottom && !isEndPost) {
            setOffset((prev) => prev + INITIAL_LIMIT);
            setHasMore(true);
        } else {
            setHasMore(false);
        }
    }, [isBottom, isEndPost]);

    useEffect(() => {
        if (posts && results === 1 && posts?.length > 0) {
            if (hasMore) {
                setPostListData((prev) => {
                    const prevData = prev ?? [];
                    return [...prevData, ...posts];
                });
            } else {
                setPostListData(posts);
            }
            dispatch({ type: POST_LIST_RESET });
        }
    }, [posts, dispatch, hasMore, results]);

    useEffect(() => {
        if (results === 1 && posts?.length === 0 && postListData) {
            setIsEndPost(true);
        }
    }, [results, posts, postListData]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            debounce(([entry]) => {
                setIsVisible(entry.isIntersecting);
            }, 200),
            {
                threshold: [0.3],
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
    }, [isVisible, contentsChattingRef, redirect]);

    useEffect(() => {
        if (redirect === 'see-all') {
            navigate('/seeall');
        } else if (redirect?.includes('group-channel')) {
            const channel_id = redirect?.split('/')[1];
            dispatch(
                listPost(redirect?.split('/')[0], limit, offset, channel_id, 1),
            );
        } else if (redirect !== 'see-all') {
            dispatch(listPost(redirect, limit, offset));
        }
    }, [redirect, navigate, dispatch, limit, offset]);

    useEffect(() => {
        if (!userInfo) dispatch(profile());
        dispatch(barMenu());
    }, [dispatch]);

    useEffect(() => {
        if (channel) {
            if (isAddChannel && channel?.results) toggleIsAddChannel();
            if (channel?.results) {
                setNotifyMessage(LANGUAGE[language].CHANNEL_ADDED);
            } else {
                setNotifyMessage(LANGUAGE[language].EXIST_CHANNEL);
            }
            setShowNotify(true);
            setTimeout(() => setShowNotify(false), 1200);
            dispatch({ type: CHANNEL_ADD_RESET });
        }
    }, [channel]);

    useEffect(() => {
        if (
            getFirebaseRef?.current &&
            saveFirebaseTokenRef?.current &&
            !dataFCMToken
        ) {
            getFirebaseRef?.current?.click();
            setTimeout(() => {
                saveFirebaseTokenRef?.current?.click();
            }, 1000);
        }
    }, [getFirebaseRef, saveFirebaseTokenRef, dataFCMToken]);

    return (
        <div className="relative flex flex-col justify-between h-screen overflow-hidden">
            <HeaderChat
                title={redirect}
                isSwiping={isSwiping}
                handleAction={handleAction}
            />

            <div
                ref={contentsChattingRef}
                className="absolute top-0 left-0 pb-[600px] h-screen w-screen overflow-auto scrollbar-none bg-slatePrimary dark:bg-darkPrimary"
            >
                <div
                    ref={divRef}
                    className="border-b-[6px] border-gray-200 dark:border-dark2Primary flex items-center pb-4 md:pb-5 pt-[164px] md:pt-[170px] px-3 md:px-6 gap-3 md:gap-6"
                >
                    <figure>
                        <div
                            className={`h-10 md:h-12 w-10 md:w-12 ${
                                isTurnOnCamera ? 'scale-[1.5]' : 'scale-[1]'
                            } rounded-full overflow-hidden transition-all  duration-300 ${
                                isVisible ? 'bg-red-500' : ''
                            }`}
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
                                        userInfo?.image &&
                                        userInfo?.image !== '0'
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
                                placeholder={
                                    LANGUAGE[language].WHAT_ON_YOUR_MIND
                                }
                                style={{ minHeight: '20px' }}
                                cols="30"
                                rows="1"
                            ></textarea>
                        </button>
                    </div>
                </div>

                <div className="relative bg-gray-200">
                    <ListPostItems
                        postsList={postListData ?? []}
                        contentsChattingRef={contentsChattingRef}
                        isTurnOnCamera={isTurnOnCameraReply}
                        setPostList={setPostListData}
                    />
                    {loading && (
                        <div className="absolute bottom-[-450px] md:bottom-[-520px] left-0 w-full">
                            <LoaderSkeletonPosts />
                        </div>
                    )}
                </div>
                <a
                    ref={getFirebaseRef}
                    className="hidden"
                    href="getfirebaseplayerid://"
                >
                    getfirebaseplayerid://
                </a>
                <button
                    ref={saveFirebaseTokenRef}
                    onClick={async () => {
                        if (typeof firebaseplayerid !== 'undefined') {
                            dispatch(saveFCMToken(firebaseplayerid));
                            localStorage.setItem(
                                'FCMToken',
                                firebaseplayerid
                                    ? JSON.stringify(firebaseplayerid)
                                    : null,
                            );
                        }
                    }}
                    className="hidden"
                >
                    Bước 2 nhấn vào đây để lấy token
                </button>
            </div>

            <AddChannel />
            <RecordModal />
            {isFullScreen && <ScreenFull postsList={postListData ?? []} />}

            <div
                onClick={modalHandle}
                className={`z-40 absolute h-screen w-screen bg-black bg-opacity-10 transition-all duration-500 ${
                    isAddChannel || isRecord
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                }`}
            />

            <FooterChat
                title="chatting"
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
