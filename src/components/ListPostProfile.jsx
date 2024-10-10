import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Mentions } from 'antd';
import moment from 'moment';
import {
    FaRegHeart,
    FaHeart,
    FaRegStar,
    FaBookmark,
    FaRegBookmark,
    FaChartLine,
} from 'react-icons/fa';
import { PiArrowsClockwiseBold, PiSpinnerBold } from 'react-icons/pi';
import { HiMiniArrowUpTray } from 'react-icons/hi2';
import { RiAddLine, RiDeleteBin6Line, RiSearch2Line } from 'react-icons/ri';
import {
    bookMark,
    deletePost,
    heart,
    updatePost,
    uploadImage,
} from '../redux/actions/PostActions';
import ListPostItems from './ListPostItems';
import { LuImagePlus } from 'react-icons/lu';
import LoadingSpinner from './LoadingSpinner';
import CustomContextMenuDeletePhoto from './CustomContextMenuDeletePhoto';
import { IoMdLink } from 'react-icons/io';
import { GoMention } from 'react-icons/go';
import useDebounce from '../hooks/useDebounce';
import { searchUser } from '../redux/actions/MessageAction';
import { SEARCH_USER_SUCCESS } from '../redux/constants/MessageConstants';
import LinkPreviewComponent from './LinkPreviewComponent';

const MentionsItem = ({ user, handle, isMentions }) => {
    return (
        <div
            onClick={handle}
            className={`flex items-center p-2 py-1 rounded-lg  mr-2 ${
                isMentions ? 'dark:bg-blue-500' : 'dark:bg-darkPrimary'
            }`}
        >
            <figure className="mr-1 w-5 h-5 flex items-center justify-center">
                <Avatar
                    src={`https://talkie.transtechvietnam.com/${user?.image}`}
                    alt="avatar"
                    className=" w-full h-full"
                />
            </figure>
            <p className="dark:text-white text-sm">{user?.name}</p>
        </div>
    );
};

const ListPostProfile = ({
    list,
    setIsOpen,
    setIdDelete,
    userInfo,
    setIsOpenDeletePhoto,
    setIdDeletePhoto,
    isDeleteFilePhoto,
    setIsOpenLink,
    urlPaste,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const pressTimer = useRef();
    const [targetElement, setTargetElement] = useState(null);
    const [rect, setRect] = useState(null);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [isShowSearch, setIsShowSearch] = useState(false);

    const { loading: loadingUpload, success } = useSelector(
        (state) => state.postUploadImage,
    );
    const { loading: loadingDeletePhoto } = useSelector(
        (state) => state.postDeletePhoto,
    );

    const [file, setFile] = useState(null);

    const handleAction = (action, id, callback) => {
        dispatch(action(id));
        callback();
    };

    const convertObjectURL = (selectedFile) => {
        return URL.createObjectURL(selectedFile);
    };

    const handleNavigate = (item) => {
        const userId =
            item?.reply?.length > 0
                ? `/?userId=${item?.reply[0]?.user_id}`
                : '';
        navigate(`/posts/details/${item?.id}${userId}`);
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

    const renderPostActions = (item) => {
        const [isHeart, setIsHeart] = useState(!!item.heart);
        const [likeCount, setLikeCount] = useState(item?.number_heart || 0);

        return (
            <div className="absolute items-center bottom-[-22px] right-0 border-[5px] border-slatePrimary dark:border-darkPrimary flex gap-4 bg-bluePrimary dark:bg-dark2Primary rounded-3xl px-3 py-[3px]">
                <div
                    onClick={() =>
                        handleAction(heart, item.id, () => {
                            setIsHeart(!isHeart);
                            setLikeCount(likeCount + (isHeart ? -1 : 1));
                        })
                    }
                    className="flex items-center text-white"
                >
                    {isHeart ? (
                        <FaHeart className="text-red-500" />
                    ) : (
                        <FaRegHeart />
                    )}
                    <span className="ml-2 text-sm font-medium">
                        {likeCount}
                    </span>
                </div>
                <div className="flex items-center text-white">
                    <PiArrowsClockwiseBold />
                    <span className="ml-2 text-sm font-medium">
                        {item.number_view}
                    </span>
                </div>
                <div className="flex items-center text-white">
                    <FaChartLine />
                    <span className="ml-2 text-sm font-medium">
                        {item.number_share}
                    </span>
                </div>
                <HiMiniArrowUpTray className="text-white" />
            </div>
        );
    };

    const renderPostHeader = (item) => {
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
                    {moment.unix(item.create_at).fromNow(true)}
                </span>
            </div>
        );
    };

    const renderPostContent = (item) => {
        const [searchText, setSearchText] = useState('');
        const [result, setResult] = useState([]);
        const [tagsUser, setTagsUser] = useState(item?.tag_user_detail);
        const [data, setData] = useState(item);
        const debouncedSearch = useDebounce(searchText, 500);
        const debouncedTagsUser = useDebounce(tagsUser, 200);
        const isFirstRender = useRef(true);

        const { users, loading } = useSelector((state) => state.searchUser);

        const handleMentions = (user) => {
            if (tagsUser.some((tag) => tag?.id === user?.id)) {
                setTagsUser((prev) =>
                    prev.filter((tag) => tag?.id !== user?.id),
                );
            } else {
                setTagsUser((prev) => [...prev, user]);
            }
        };

        const isMentions = (user_id) => {
            return tagsUser?.some((tag) => tag?.id === user_id);
        };

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
                            !tagsUser.some((tag) => tag?.id === user?.id) &&
                            user?.id !== userInfo.id,
                    ),
                    ...tagsUser,
                ]);
            }
        }, [users]);

        return (
            <div onClick={() => handleNavigate(data)}>
                {renderPostHeader(data)}
                <p className="text-left line-clamp-5 md:text-lg text-white dark:text-white">
                    {data.content}
                </p>
                {(data?.tag_user || tagsUser?.length > 0) && (
                    <div className="flex flex-wrap">
                        {tagsUser?.map((tag, i) => (
                            <span
                                className={`font-semibold dark:text-white mr-2`}
                                key={i}
                            >
                                {tag?.name}
                            </span>
                        ))}
                    </div>
                )}
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
                        <Avatar
                            src={
                                file
                                    ? convertObjectURL(file)
                                    : `https://talkie.transtechvietnam.com/${data.img}`
                            }
                            className=" w-full h-full object-cover rounded-xl"
                        />
                        {(loadingUpload || loadingDeletePhoto) && (
                            <div className="absolute w-full h-full top-0 left-0 rounded-xl bg-black/30 flex justify-center items-center">
                                <LoadingSpinner />
                            </div>
                        )}
                    </figure>
                )}
                {(data?.url || urlPaste) && (
                    <div>
                        <LinkPreviewComponent
                            url={urlPaste ?? data.url}
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
                        <IoMdLink className="dark:text-white mr-2" size={20} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsShowSearch((prev) => !prev);
                        }}
                    >
                        <GoMention className="dark:text-white mr-2" />
                    </button>
                </div>
                {isShowSearch && (
                    <>
                        <div className="w-[80%] flex flex-wrap gap-1 mt-2">
                            {(result.length > 0 ? result : tagsUser).map(
                                (user, i) => (
                                    <MentionsItem
                                        key={i}
                                        user={user}
                                        handle={(e) => {
                                            e.stopPropagation();
                                            handleMentions(user);
                                        }}
                                        isMentions={isMentions(user?.id)}
                                    />
                                ),
                            )}
                        </div>
                        <div className="relative dark:bg-darkPrimary rounded-md pl-10 mt-2 py-1 w-[80%]">
                            <input
                                onChange={(e) => setSearchText(e.target.value)}
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
        );
    };

    const renderPostOptions = (item) => {
        const [isBookMark, setIsBookMark] = useState(!!item.bookmark);

        return (
            <div className="absolute top-[-22px] right-0 border-[5px] border-slatePrimary dark:border-darkPrimary flex items-center gap-4 bg-bluePrimary dark:bg-dark2Primary rounded-3xl px-3 py-[3px]">
                <FaRegStar className="text-white" />
                {isBookMark ? (
                    <FaBookmark
                        className="text-purple-700 text-[0.9rem]"
                        onClick={() =>
                            handleAction(bookMark, item.id, () => {
                                setIsBookMark(!isBookMark);
                            })
                        }
                    />
                ) : (
                    <FaRegBookmark
                        className="text-white text-[0.9rem]"
                        onClick={() =>
                            handleAction(bookMark, item.id, () => {
                                setIsBookMark(!isBookMark);
                            })
                        }
                    />
                )}
                <RiDeleteBin6Line
                    onClick={() => {
                        setIsOpen(true);
                        setIdDelete(item.id);
                    }}
                    className="text-white"
                />
            </div>
        );
    };

    const handleTouchStart = (item) => {
        pressTimer.current = setTimeout(() => {
            setTargetElement(
                document.getElementById(`delete-photo-${item?.id}`),
            );
            setRect(targetElement?.getBoundingClientRect());
            setContextMenuVisible(true);
        }, 500);
    };

    const handleTouchEnd = () => {
        clearTimeout(pressTimer.current);
    };

    const closeContextMenu = () => setContextMenuVisible(false);

    useEffect(() => {
        setRect(targetElement?.getBoundingClientRect());
    }, [targetElement]);

    useEffect(() => {
        if (isDeleteFilePhoto) {
            setFile(null);
        }
    }, [isDeleteFilePhoto]);

    const handleDeletePhoto = (id) => {
        setIsOpenDeletePhoto(true);
        setIdDeletePhoto(id);
    };

    return (
        <>
            {list
                ?.filter((item) => item.user_id === userInfo.id)
                .map((item, i) => (
                    <div
                        key={i}
                        className="flex border-b-[6px] border-gray-200 dark:border-dark2Primary py-6 md:py-10 px-3 md:px-6 gap-3 md:gap-6 bg-slatePrimary dark:bg-darkPrimary"
                    >
                        <div className="relative h-10 md:h-12 min-w-10 md:min-w-12">
                            <Avatar
                                src={`https://talkie.transtechvietnam.com/${item.avatar}`}
                                className="absolute top-0 left-0 z-10 h-10 md:h-12 w-10 md:w-12 rounded-full object-cover"
                                alt="avatar"
                            />

                            <div className="absolute top-0 left-0 bg-white h-10 md:h-12 w-10 md:w-12 rounded-full"></div>
                        </div>
                        <div className="w-full">
                            <div className="relative bg-bluePrimary dark:bg-dark2Primary rounded-2xl w-full px-4 pb-5 pt-3">
                                {renderPostOptions(item)}
                                {renderPostContent(item)}
                                {renderPostActions(item)}
                            </div>
                        </div>
                    </div>
                ))}
            <ListPostItems
                postsList={list?.filter((item) => item.user_id !== userInfo.id)}
            />
            <CustomContextMenuDeletePhoto
                isVisible={contextMenuVisible}
                onClose={closeContextMenu}
                targetElement={targetElement}
                rect={rect}
                handle={handleDeletePhoto}
            />
        </>
    );
};

export default ListPostProfile;
