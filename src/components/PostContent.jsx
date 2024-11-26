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
import { FaRegStar, FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { PiSpinnerBold } from 'react-icons/pi';
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
import { LANGUAGE } from '../constants/language.constant';
import { FaRegHeart, FaHeart, FaChartLine } from 'react-icons/fa';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { HiMiniArrowUpTray } from 'react-icons/hi2';
import { heart } from '../redux/actions/PostActions';
import { debounce } from 'lodash';
import { setObjectActive } from '../redux/actions/SurfActions';
import { AppContext } from '../AppContext';
import { BASE_URL } from '../constants/api.constant';
import { addViewPost } from '../redux/actions/UserActions';
import { Howl, Howler } from 'howler';
import SpeakingAnimation from './SpeakingAnimation';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import MessageItem from './MessageItem';

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

const renderPostHeader = (item) => {
    const { language } = useSelector((state) => state.userLanguage);
    return (
        <div className="flex items-center gap-[5px]">
            <h5 className="line-clamp-1 md:text-xl text-white dark:text-white">
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

const renderPostActions = (item) => {
    const [isHeart, setIsHeart] = useState(!!item.heart);
    const [likeCount, setLikeCount] = useState(item?.number_heart || 0);
    const [initialLoad, setInitialLoad] = useState(true);

    const dispatch = useDispatch();

    const handleAction = (action, id, callback) => {
        dispatch(action(id));
        callback();
    };

    const handleSharePostDetail = useCallback((id) => {
        if (navigator.share) {
            navigator
                .share({
                    title: 'Chia sẻ bài viết',
                    text: 'Hãy xem bài viết này!',
                    url: `/share?link=/posts/details/${id}`,
                })
                .then(() => console.log('Chia sẻ thành công!'))
                .catch((error) =>
                    console.error('Chia sẻ không thành công:', error),
                );
        } else {
            window.open(urlToShare, '_blank');
        }
    }, []);

    useEffect(() => {
        if (!isHeart) setInitialLoad(false);
    }, [isHeart]);

    return (
        <div className="absolute items-center bottom-[-22px] right-0 border-[5px] border-slatePrimary dark:border-darkPrimary flex gap-4 bg-bluePrimary dark:bg-dark2Primary rounded-3xl px-3 py-[3px]">
            <div className={`flex items-center text-gray-400`}>
                <button
                    onClick={() =>
                        handleAction(heart, item.id, () => {
                            setIsHeart(!isHeart);
                            setLikeCount(likeCount + (isHeart ? -1 : 1));
                        })
                    }
                    className={`btn heart ${
                        isHeart
                            ? initialLoad
                                ? 'initial-active'
                                : 'active'
                            : ''
                    } flex items-center justify-center text-white text-xl w-10 h-10 text-primary-color rounded-full`}
                ></button>
                <span className="ml-2 text-sm font-medium text-white">
                    {likeCount}
                </span>
            </div>
            {/* <div className="flex items-center text-white">
                <PiArrowsClockwiseBold />
                <span className="ml-2 text-sm font-medium">
                    {item.number_share}
                </span>
            </div> */}
            <div className="flex items-center text-gray-400">
                <FaChartLine />
                <span className="ml-2 text-sm font-medium">
                    {item.number_view}
                </span>
            </div>
            <div
                onClick={() => handleSharePostDetail(item.id)}
                className="flex items-center text-gray-400"
            >
                <HiMiniArrowUpTray />
            </div>
        </div>
    );
};

function PostContent({ item, contentsChattingRef, setListProfile }) {
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
    const [targetElement, setTargetElement] = useState(null);
    const [rect, setRect] = useState(null);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [currentItemId, setCurrentItemId] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);
    const [detailsPostReply, setDetailsPostReply] = useState([]);
    const [replyIndexCurrent, setReplyIndexCurrent] = useState(0);
    const pressTimer = useRef();
    const [isVisible, setIsVisible] = useState(false);
    const videoRef = useRef(null);
    const divRef = useRef(null);

    const { isRunAuto } = useContext(AppContext);

    const { loading: loadingUpload, success } = useSelector(
        (state) => state.postUploadImage,
    );
    const { loading: loadingDeletePhoto } = useSelector(
        (state) => state.postDeletePhoto,
    );
    const { userInfo } = useSelector((state) => state.userProfile);

    const { users, loading } = useSelector((state) => state.searchUser);
    const { language } = useSelector((state) => state.userLanguage);

    const handleAction = (action, id, callback) => {
        dispatch(action(id));
        callback();
    };

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

    useEffect(() => {
        if (item) setData(item);
    }, [item]);

    const handleNavigate = useCallback(() => {
        dispatch(addViewPost(data?.id));
        navigate(postDetailsUrl);
    }, [dispatch, data?.id, navigate, postDetailsUrl]);

    const handleToggleBookMark = () => {
        handleAction(bookMark, item.id, () => {
            setListProfile((prev) => {
                return prev.map((item) => {
                    return item.id === data.id
                        ? { ...item, bookmark: !item.bookmark }
                        : item;
                });
            });
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
        setIsBookMark(!!data.bookmark);
    }, [data]);

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
        if (!isBookMark) setInitialLoad(false);
    }, [isBookMark]);

    useEffect(() => {
        setRect(targetElement?.getBoundingClientRect());
    }, [targetElement]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            debounce(([entry]) => {
                setIsVisible(entry.isIntersecting);
            }, 200),
            {
                threshold: [0.1],
                rootMargin: `-${window.innerHeight * 0.1}px 0px -${Math.max(
                    window.innerHeight * 0.75,
                    400,
                )}px 0px`,
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
        if (
            isVisible &&
            document.getElementById(`post-item-content-${data?.id}`) &&
            (data?.video && data?.video != '0'
                ? videoRef?.current
                : data?.audio)
        ) {
            if (navigator.vibrate) {
                navigator.vibrate(100);
            } else {
                console.log('Thiết bị không hỗ trợ rung.');
            }
            if (window.location.pathname.includes('/posts/details')) {
                dispatch(setPostActive(data));
            }
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
                        `post-item-content-${data?.id}`,
                    ),
                    parent: contentsChattingRef?.current,
                    video: videoRef.current,
                    bonus: -70,
                }),
            );
        }
    }, [isVisible, contentsChattingRef, videoRef, data]);

    useEffect(() => {
        if (item) {
            setDetailsPostReply(item?.reply || []);
        }
    }, [item]);

    return (
        <>
            <div className="flex border-b-[6px] border-gray-200 dark:border-dark2Primary py-6 md:py-10 px-3 md:px-6 gap-3 md:gap-6 bg-slatePrimary dark:bg-darkPrimary">
                <div
                    ref={divRef}
                    className={`relative appear-animation duration-300 h-10 md:h-12 min-w-10 md:min-w-12 ${
                        isVisible && isRunAuto && data?.video ? 'h-16 w-16' : ''
                    }`}
                >
                    {data?.video && isVisible ? (
                        <div
                            className={`${
                                isRunAuto ? 'w-full h-full' : 'w-0 h-0'
                            } duration-300 transition-all`}
                        >
                            <video
                                ref={videoRef}
                                className="absolute h-full w-full top-0 left-0 z-10 md:h-12 md:w-12 rounded-full object-cover"
                                src={`https://talkie.transtechvietnam.com/${data.video}`}
                            />
                        </div>
                    ) : (
                        <Avatar
                            src={`${BASE_URL}${data?.avatar}`}
                            className="absolute top-0 left-0 z-10 h-10 md:h-12 w-10 md:w-12 rounded-full object-cover"
                            alt="icon"
                        />
                    )}

                    {/* <div
                        className={`absolute top-0 left-0 bg-red-300  md:h-12 ${
                            isVisible && isRunAuto && data?.video
                                ? 'h-16 w-16'
                                : 'w-10 h-10'
                        }  md:w-12 rounded-full ${
                            isVisible && isRunAuto ? 'animate-ping' : ''
                        }`}
                    ></div> */}
                    <div
                        className={`md:h-12 ${
                            isVisible && isRunAuto && data?.video
                                ? 'h-16 w-16'
                                : 'w-10 h-10'
                        }  md:w-12 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2`}
                    >
                        {isVisible && isRunAuto && <SpeakingAnimation />}
                    </div>
                </div>
                <div className="flex-1">
                    <div
                        className={`relative bg-bluePrimary transition-all duration-300 dark:bg-dark2Primary rounded-2xl w-full px-4 pb-5 pt-3 ${
                            isVisible ? 'shadow-2xl scale-[1.02]' : 'shadow-md'
                        }`}
                    >
                        <div id={`post-item-content-${data?.id}`}>
                            <div className="absolute top-[-22px] right-0 border-[5px] border-slatePrimary dark:border-darkPrimary flex items-center gap-4 bg-bluePrimary dark:bg-dark2Primary rounded-3xl px-3 py-[3px]">
                                <FaRegStar className="text-white" />
                                <label
                                    className={`ui-bookmark  ${
                                        isBookMark
                                            ? initialLoad
                                                ? 'init-active'
                                                : 'active'
                                            : ''
                                    }`}
                                    onClick={handleToggleBookMark}
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
                                    className="text-white"
                                />
                            </div>
                            <div onClick={() => handleNavigate(data)}>
                                {renderPostHeader(data)}
                                {(data?.tag_user || tagsUser?.length > 0) && (
                                    <div className="flex flex-wrap">
                                        {tagsUser?.map((tag, i) => (
                                            <span
                                                className={`font-semibold dark:text-white text-white mr-2`}
                                                key={i}
                                            >
                                                {tag?.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                <p className="text-left line-clamp-5 md:text-lg text-white dark:text-white">
                                    {data.content}
                                </p>

                                {(data?.img || file) && (
                                    <figure
                                        onTouchStart={(e) => {
                                            e.stopPropagation();
                                            handleTouchStart(item);
                                        }}
                                        onTouchEnd={handleTouchEnd}
                                        id={`delete-photo-${data.id}`}
                                        className="max-w-full relative min-h-40 mt-2"
                                    >
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
                                                    : data?.img.startsWith(
                                                          'blob:',
                                                      )
                                                    ? data?.img
                                                    : `https://talkie.transtechvietnam.com/${data?.img}`
                                            }
                                        />
                                        {(loadingUpload ||
                                            loadingDeletePhoto) && (
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
                                        <LuImagePlus className="dark:text-white text-white mr-2" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsOpenLink(true);
                                        }}
                                    >
                                        <IoMdLink
                                            className="dark:text-white text-white mr-2"
                                            size={20}
                                        />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleSearch(data.id);
                                        }}
                                    >
                                        <GoMention className="dark:text-white text-white mr-2" />
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
                                                    isMentions={isMentions(
                                                        user?.id,
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <div className="relative dark:bg-darkPrimary rounded-md pl-10 mt-2 py-1 w-[80%] bg-white">
                                            <input
                                                onChange={(e) =>
                                                    setSearchText(
                                                        e.target.value,
                                                    )
                                                }
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                                placeholder={
                                                    LANGUAGE[language].SEARCH
                                                }
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
                        {renderPostActions(item)}
                    </div>
                    <div className="flex items-center mt-5">
                        {item?.reply?.map((reply, index) => (
                            <Avatar
                                onClick={() => setReplyIndexCurrent(index)}
                                key={index}
                                src={`${BASE_URL}${reply?.avatar}`}
                                className={`${
                                    replyIndexCurrent === index
                                        ? 'border-2 border-blue-400'
                                        : ''
                                } mr-2`}
                            />
                        ))}
                    </div>
                    {detailsPostReply.length > 0 && (
                        <MessageItem
                            position="left"
                            message={detailsPostReply[replyIndexCurrent]}
                            setDetailsPostReply={setDetailsPostReply}
                            contentsChattingRef={contentsChattingRef}
                            setListProfile={setListProfile}
                        />
                    )}
                </div>
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

export default PostContent;
