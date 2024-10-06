import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from 'antd';
import moment from 'moment';
import {
    FaRegHeart,
    FaHeart,
    FaRegStar,
    FaBookmark,
    FaRegBookmark,
    FaChartLine,
} from 'react-icons/fa';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { HiMiniArrowUpTray } from 'react-icons/hi2';
import { RiAddLine, RiDeleteBin6Line } from 'react-icons/ri';
import {
    bookMark,
    deletePost,
    heart,
    uploadImage,
} from '../redux/actions/PostActions';
import ListPostItems from './ListPostItems';
import { LuImagePlus } from 'react-icons/lu';
import LoadingSpinner from './LoadingSpinner';
import CustomContextMenuDeletePhoto from './CustomContextMenuDeletePhoto';

const ListPostProfile = ({
    list,
    setIsOpen,
    setIdDelete,
    userInfo,
    setIsOpenDeletePhoto,
    setIdDeletePhoto,
    isDeleteFilePhoto,
}) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const pressTimer = useRef();
    const [targetElement, setTargetElement] = useState(null);
    const [rect, setRect] = useState(null);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);

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

    const renderPostContent = (item) => (
        <div onClick={() => handleNavigate(item)}>
            {renderPostHeader(item)}
            <p className="text-left line-clamp-5 md:text-lg text-white dark:text-white">
                {item.content}
            </p>
            {(item?.img || file) && (
                <figure
                    onTouchStart={(e) => {
                        e.stopPropagation();
                        handleTouchStart(item);
                    }}
                    onTouchEnd={handleTouchEnd}
                    id={`delete-photo-${item.id}`}
                    className="max-w-full relative min-h-40"
                >
                    <Avatar
                        src={
                            file
                                ? convertObjectURL(file)
                                : `https://talkie.transtechvietnam.com/${item?.img}`
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
            <div className="flex items-center mt-2">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleUploadAvatar(item?.id);
                    }}
                >
                    <LuImagePlus className="dark:text-white" />
                </button>
            </div>
        </div>
    );

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
