import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from 'antd';
import moment from 'moment/moment';
import {
    FaRegStar,
    FaBookmark,
    FaRegBookmark,
    FaRegHeart,
    FaHeart,
    FaChartLine,
} from 'react-icons/fa';
import { PiArrowsClockwiseBold, PiSpinnerBold } from 'react-icons/pi';
import { RiDeleteBin6Line, RiSearch2Line } from 'react-icons/ri';
import {
    bookMark,
    deletePhoto,
    deletePost,
    setPostActive,
    updatePost,
    uploadImage,
} from '../redux/actions/PostActions';
import { LuImagePlus } from 'react-icons/lu';
import LoadingSpinner from './LoadingSpinner';
import CustomContextMenuDeletePhoto from './CustomContextMenuDeletePhoto';
import { IoMdLink } from 'react-icons/io';
import { GoMention } from 'react-icons/go';
import useDebounce from '../hooks/useDebounce';
import { searchUser } from '../redux/actions/MessageAction';
import { SEARCH_USER_SUCCESS } from '../redux/constants/MessageConstants';
import LinkPreviewComponent from './LinkPreviewComponent';
import ModalDelete from './ModalDelete';
import { HiMiniArrowUpTray } from 'react-icons/hi2';
import { debounce } from 'lodash';
import { setObjectActive } from '../redux/actions/SurfActions';
import { addViewPost } from '../redux/actions/UserActions';
import { Howl, Howler } from 'howler';
import { AppContext } from '../AppContext';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const MentionsItem = ({ user, handle, isMentions }) => {
    return (
        <div
            onClick={handle}
            className={`flex items-center p-2 py-1 rounded-lg  mr-2 ${
                isMentions
                    ? 'dark:bg-blue-500 bg-[#adb8c1]'
                    : 'dark:bg-darkPrimary bg-white'
            }`}
        >
            <figure className="mr-1 w-5 h-5 flex items-center justify-center">
                <Avatar
                    src={`https://talkie.transtechvietnam.com/${user?.image}`}
                    alt="avatar"
                    className=" w-full h-full"
                />
            </figure>
            <p
                className={`${
                    isMentions ? 'text-white' : 'dark:text-white'
                } text-sm`}
            >
                {user?.name}
            </p>
        </div>
    );
};

const PostActions = ({ item, position, handleLike }) => {
    const [isHeart, setIsHeart] = useState(!!item.heart);
    const [likeCount, setLikeCount] = useState(item?.number_heart || 0);
    const [data, setData] = useState(item);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        setIsHeart(!!data.heart);
        setLikeCount(data?.number_heart || 0);
    }, [data]);

    useEffect(() => {
        if (item) setData(item);
    }, [item]);

    const dispatch = useDispatch();

    const handleAction = (action, id, callback) => {
        dispatch(action(id));
        callback();
    };

    useEffect(() => {
        if (!isHeart) setInitialLoad(false);
    }, [isHeart]);
    return (
        <div
            className={`absolute items-center bottom-[-22px] ${
                position === 'right' ? 'right-0' : 'left-0'
            } border-[5px] border-grayPrimary dark:border-darkPrimary flex gap-4 bg-slatePrimary dark:bg-dark2Primary rounded-3xl px-3 py-[3px]`}
        >
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
                <span className="ml-2 text-sm font-medium">{likeCount}</span>
            </div>
            {/* <div className="flex items-center dark:text-white">
                <PiArrowsClockwiseBold />
                <span className="ml-2 text-sm font-medium">
                    {item.number_share}
                </span>
            </div> */}
            <div className="flex items-center dark:text-white">
                <FaChartLine />
                <span className="ml-2 text-sm font-medium">
                    {item.number_view}
                </span>
            </div>
            <HiMiniArrowUpTray className="dark:text-white" />
        </div>
    );
};

const PostHeader = ({ item, position }) => {
    const { language } = useSelector((state) => state.userLanguage);

    return (
        <div
            className={`flex items-center gap-[5px] ${
                position === 'left' ? 'justify-end' : 'justify-start'
            }`}
        >
            <h5 className="line-clamp-1 md:text-xl dark:text-white">
                {item.name}
            </h5>
            {item.name_channel && <span className="text-gray-300">in</span>}
            <span className="line-clamp-1 text-gray-300 font-medium">
                {item.name_channel}
            </span>
            <span className="whitespace-nowrap text-gray-300 dark:text-gray-400 font-medium text-sm md:text-base">
                {moment
                    .unix(item.create_at)
                    .locale(language.split('-')[0])
                    .fromNow(true)}
            </span>
        </div>
    );
};

function PostHosting({
    item,
    contentsChattingRef,
    setIsVisibleChatting,
    position = 'right',
    handleTouchStartPost,
    handleTouchEndPost,
    handleLike,
    handleSharePost,
    handleBookMark,
    videoRef,
    bonusHeight = 0,
    bonusKey = '',
}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState('');
    const [result, setResult] = useState([]);
    const [tagsUser, setTagsUser] = useState(item?.tag_user_detail ?? []);
    const [data, setData] = useState(item);
    const [url, setUrl] = useState('');
    const debouncedSearch = useDebounce(searchText, 500);
    const debouncedTagsUser = useDebounce(tagsUser, 200);
    const isFirstRender = useRef(true);
    const [isShowSearch, setIsShowSearch] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDeletePhoto, setIsOpenDeletePhoto] = useState(false);
    const [isOpenLink, setIsOpenLink] = useState(false);
    const [file, setFile] = useState(null);
    const [isBookMark, setIsBookMark] = useState(!!item.bookmark);
    const pressTimer = useRef();
    const [targetElement, setTargetElement] = useState(null);
    const [rect, setRect] = useState(null);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);
    const { loading: loadingUpload, success } = useSelector(
        (state) => state.postUploadImage,
    );
    const { loading: loadingDeletePhoto } = useSelector(
        (state) => state.postDeletePhoto,
    );
    const { userInfo } = useSelector((state) => state.userProfile);

    const { users, loading } = useSelector((state) => state.searchUser);

    const { isRunAuto } = useContext(AppContext);

    const [isVisible, setIsVisible] = useState(false);
    // const videoRef = useRef(null);
    const divRef = useRef(null);

    const handleToggleSearch = (itemId) => {
        if (currentItemId !== itemId) {
            setResult([]);
            setCurrentItemId(itemId);
        }
        setIsShowSearch((prev) => !prev);
    };

    const convertObjectURL = (selectedFile) => {
        return URL.createObjectURL(selectedFile);
    };

    const postDetailsUrl = useMemo(() => {
        const baseUrl = `/posts/details/${data?.id}`;
        return baseUrl;
    }, [data?.id]);

    const handleNavigate = useCallback(() => {
        dispatch(addViewPost(data?.id));
        navigate(postDetailsUrl);
    }, [dispatch, data?.id, navigate, postDetailsUrl]);

    const handleAction = (action, id, callback) => {
        dispatch(action(id));
        callback();
    };

    const handleToggleBookMark = () => {
        handleAction(bookMark, item.id, () => {
            setIsBookMark((prevBookMark) => !prevBookMark);
        });
    };

    const handleUploadAvatar = (id_post) => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = () => {
            const file = fileInput.files[0];
            setFile(file);
            dispatch(uploadImage(file, id_post));
        };
        fileInput.click();
    };

    const handleMentions = (user) => {
        if (tagsUser?.some((tag) => tag?.id === user?.id)) {
            setTagsUser((prev) => prev.filter((tag) => tag?.id !== user?.id));
        } else {
            setTagsUser((prev) => [...prev, user]);
        }
    };

    const isMentions = (user_id) => {
        return tagsUser?.some((tag) => tag?.id === user_id);
    };

    const handlePasteUrl = useCallback(() => {
        navigator.clipboard.readText().then((text) => {
            setUrl(text);
        });
    }, []);

    const handleDeletePhoto = () => {
        setIsOpenDeletePhoto(true);
    };

    const handleTouchStart = (item) => {
        pressTimer.current = setTimeout(() => {
            setTargetElement(
                document.getElementById(`delete-photo-${item?.id}`),
            );
            setRect(targetElement?.getBoundingClientRect());
            setContextMenuVisible(true);
        }, 1000);
    };

    const handleTouchEnd = () => {
        clearTimeout(pressTimer.current);
    };

    const closeContextMenu = () => setContextMenuVisible(false);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        dispatch(
            updatePost(data.id, {
                tag_user:
                    debouncedTagsUser.map((tag) => tag.id).length === 0
                        ? ''
                        : debouncedTagsUser.map((tag) => tag.id),
            }),
        );
    }, [debouncedTagsUser]);

    useEffect(() => {
        if (data) {
            setIsBookMark(!!data.bookmark);
        }
    }, [data]);

    useEffect(() => {
        if (item) setData(item);
    }, [item]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            debounce(([entry]) => {
                setIsVisible(entry.isIntersecting);
            }, 200),
            {
                threshold: [0.1],
                rootMargin: `-${Math.max(
                    window.innerHeight * 0.1,
                    100,
                )}px 0px -${Math.max(window.innerHeight * 0.75, 400)}px 0px`,
            },
        );

        if (divRef?.current) {
            observer.observe(divRef?.current);
        }

        return () => {
            if (divRef?.current) {
                observer.unobserve(divRef?.current);
            }
        };
    }, []);

    useEffect(() => {
        if (
            isVisible &&
            (data?.video && data?.video != '0'
                ? videoRef?.current
                : data?.audio)
        ) {
            if (navigator.vibrate) {
                navigator.vibrate(100);
            } else {
                console.log('Thiết bị không hỗ trợ rung.');
            }

            // dispatch(setPostActive(data));
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
                        `post-item-profile${bonusKey}-${data?.id}`,
                    ),
                    parent: contentsChattingRef?.current,
                    video: videoRef.current,
                    bonus: bonusHeight,
                }),
            );
        }
    }, [isVisible, contentsChattingRef, videoRef?.current, data, isRunAuto]);

    useEffect(() => {
        if (debouncedSearch) {
            dispatch(searchUser(debouncedSearch));
        } else {
            setResult([]);
            dispatch({ type: SEARCH_USER_SUCCESS, payload: [] });
        }
    }, [debouncedSearch]);

    useEffect(() => {
        if (users.length > 0) {
            setResult([
                ...users.filter(
                    (user) =>
                        !tagsUser?.some((tag) => tag?.id === user?.id) &&
                        user?.id !== userInfo.id,
                ),
                ...(tagsUser || []),
            ]);
        }
    }, [users]);

    useEffect(() => {
        setIsVisibleChatting(isVisible);
    }, [isVisible]);

    useEffect(() => {
        if (!isBookMark) setInitialLoad(false);
    }, [isBookMark]);

    useEffect(() => {
        setRect(targetElement?.getBoundingClientRect());
    }, [targetElement]);

    return (
        <>
            <div className="relative flex-1 appear-animation duration-300">
                <div
                    ref={divRef}
                    id={`post-item-profile${bonusKey}-${data?.id}`}
                    className={`relative bg-slatePrimary transition-all duration-300 dark:bg-dark2Primary rounded-2xl w-full px-4 pb-5 pt-3 ${
                        isVisible ? 'shadow-2xl scale-[1.02]' : 'shadow-md'
                    }`}
                    onTouchStart={() => {
                        handleTouchStartPost(
                            `post-item-profile${bonusKey}-${data?.id}`,
                        );
                    }}
                    onTouchEnd={handleTouchEndPost}
                >
                    <div
                        id={'hidden'}
                        className={`absolute top-[-22px] ${
                            position === 'right' ? 'right-0' : 'left-0'
                        } border-[5px] border-grayPrimary dark:border-darkPrimary flex items-center gap-4 bg-slatePrimary dark:bg-dark2Primary rounded-3xl px-3 py-[3px]`}
                    >
                        <FaRegStar className="dark:text-white" />
                        <label
                            className={`ui-bookmark  ${
                                isBookMark
                                    ? initialLoad
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
                        <RiDeleteBin6Line
                            onClick={() => {
                                setIsOpen(true);
                            }}
                            className="dark:text-white"
                        />
                    </div>
                    <div onClick={() => handleNavigate(data)}>
                        <PostHeader item={data} position={position} />
                        {(data?.tag_user || tagsUser?.length > 0) && (
                            <div className="flex flex-wrap">
                                {tagsUser?.map((tag, i) => (
                                    <span
                                        className={`font-semibold dark:text-white  mr-2`}
                                        key={i}
                                    >
                                        {tag?.name}
                                    </span>
                                ))}
                            </div>
                        )}
                        <p
                            className={`text-left ${
                                window.location.pathname.includes('details')
                                    ? ''
                                    : 'line-clamp-5'
                            } md:text-lg dark:text-white ${
                                position === 'left' ? 'text-right' : 'text-left'
                            }`}
                        >
                            {data.content}
                        </p>

                        {(data?.img || file) && (
                            <figure
                                onTouchStart={(e) => {
                                    e.stopPropagation();
                                    handleTouchStart(data);
                                }}
                                onTouchEnd={handleTouchEnd}
                                id={`delete-photo-${data.id}`}
                                className="max-w-full relative min-h-40 mt-2"
                            >
                                {/* <Avatar
                                    src={
                                        file
                                            ? convertObjectURL(file)
                                            : `https://talkie.transtechvietnam.com/${data.img}`
                                    }
                                    className=" w-full h-full object-cover rounded-xl"
                                /> */}
                                <LazyLoadImage
                                    className=" w-full h-full object-cover rounded-xl"
                                    alt={''}
                                    effect="blur"
                                    wrapperProps={{
                                        style: {
                                            transitionDelay: '1s',
                                        },
                                    }}
                                    src={
                                        file
                                            ? convertObjectURL(file)
                                            : data?.img instanceof File
                                            ? URL.createObjectURL(data?.img)
                                            : data?.img?.startsWith('blob:')
                                            ? data?.img
                                            : `https://talkie.transtechvietnam.com/${data?.img}`
                                    }
                                />
                                {(loadingUpload || loadingDeletePhoto) && (
                                    <div className="absolute w-full h-full top-0 left-0 rounded-xl bg-black/30 flex justify-center items-center">
                                        <LoadingSpinner />
                                    </div>
                                )}
                            </figure>
                        )}
                        {(data?.url || url) && (
                            <div>
                                <LinkPreviewComponent
                                    url={url ?? data.url}
                                    post_id={data.id}
                                    setData={setData}
                                    dataUrl={data.url}
                                />
                            </div>
                        )}
                        <div className="flex items-center mt-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleUploadAvatar(data.id);
                                }}
                            >
                                <LuImagePlus className="dark:text-white mr-2" />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsOpenLink(true);
                                }}
                            >
                                <IoMdLink
                                    className="dark:text-white mr-2"
                                    size={20}
                                />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleSearch(data.id);
                                }}
                            >
                                <GoMention className="dark:text-white  mr-2" />
                            </button>
                        </div>
                        {isShowSearch && (
                            <>
                                <div className="w-[80%] flex flex-wrap gap-1 mt-2">
                                    {(result.length > 0
                                        ? result
                                        : tagsUser
                                    )?.map((user, i) => (
                                        <MentionsItem
                                            key={i}
                                            user={user}
                                            handle={(e) => {
                                                e.stopPropagation();
                                                handleMentions(user);
                                            }}
                                            isMentions={isMentions(user?.id)}
                                        />
                                    ))}
                                </div>
                                <div className="relative dark:bg-darkPrimary rounded-md pl-10 mt-2 py-1 w-[80%] bg-white">
                                    <input
                                        onChange={(e) =>
                                            setSearchText(e.target.value)
                                        }
                                        onClick={(e) => e.stopPropagation()}
                                        placeholder="Search"
                                        className="border-none outline-none bg-transparent w-full dark:text-white dark:placeholder-gray-400"
                                    />
                                    <RiSearch2Line className="dark:text-white absolute left-3 top-1/2 -translate-y-1/2" />
                                    {loading && (
                                        <PiSpinnerBold className="dark:text-white absolute right-1 top-1/2 -translate-y-1/2 spinner" />
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                    <ModalDelete
                        title="TITLE_DELETE_POST"
                        subTitle="SUBTITLE_DELETE_POST"
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        handle={() =>
                            handleAction(deletePost, item?.id, () => {})
                        }
                    />
                    <ModalDelete
                        title="TITLE_ADD_LINK"
                        subTitle="SUBTITLE_ADD_LINK"
                        isOpen={isOpenLink}
                        setIsOpen={setIsOpenLink}
                        handle={handlePasteUrl}
                        buttonOKText="PASTE"
                    />
                    <ModalDelete
                        title="TITLE_DELETE_PHOTO"
                        subTitle="SUBTITLE_DELETE_PHOTO"
                        isOpen={isOpenDeletePhoto}
                        setIsOpen={setIsOpenDeletePhoto}
                        handle={() => {
                            item.img = null;
                            setFile(null);
                            dispatch(deletePhoto(item?.id));
                        }}
                    />
                </div>
                <PostActions
                    item={data}
                    position={position}
                    handleLike={handleLike}
                />
            </div>
            <CustomContextMenuDeletePhoto
                isVisible={contextMenuVisible}
                onClose={closeContextMenu}
                targetElement={targetElement}
                rect={rect}
                handle={handleDeletePhoto}
            />
        </>
    );
}

export default PostHosting;
