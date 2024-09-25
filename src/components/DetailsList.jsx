import { useEffect, useContext, useRef, useState } from 'react';
import { RiAddLine } from 'react-icons/ri';
import { FaRegHeart } from 'react-icons/fa';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { HiMiniArrowUpTray } from 'react-icons/hi2';
import { usePingStates } from '../hooks/usePingStates';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { AppContext } from './../AppContext';
import React from 'react';
import { DEFAULT_PROFILE } from '../constants/image.constant';
import { Avatar } from 'antd';

export default function DetailsList({ post, repCommentPresent }) {
    const [isFavorites, setIsFavorites] = useState({});
    const [isChanges, setIsChanges] = useState({});
    const [isShares, setIsShares] = useState({});
    const [postDetails, setPostDetails] = useState(null);
    const contentsChattingRef = useRef(null);
    const postRefs = useRef([]);
    const { isRunAuto, isRunSpeed } = useContext(AppContext);
    const [postsList, setPostList] = useState([]);

    const favoriteHandle = (idComment) => {
        setPostDetails((prevPost) => ({
            ...prevPost,
            usersComment: prevPost.usersComment.map((item) =>
                item.idComment === idComment
                    ? {
                          ...item,
                          favorites:
                              item.favorites +
                              (isFavorites[idComment] ? -1 : 1),
                      }
                    : item,
            ),
        }));
        setIsFavorites((prevState) => ({
            ...prevState,
            [idComment]: !prevState[idComment],
        }));
    };

    const changeHandle = (idComment) => {
        setPostDetails((prevPost) => ({
            ...prevPost,
            usersComment: prevPost.usersComment.map((item) =>
                item.idComment === idComment
                    ? {
                          ...item,
                          changes:
                              item.changes + (isChanges[idComment] ? -1 : 1),
                      }
                    : item,
            ),
        }));
        setIsChanges((prevState) => ({
            ...prevState,
            [idComment]: !prevState[idComment],
        }));
    };

    const shareHandle = (idComment) => {
        setPostDetails((prevPost) => ({
            ...prevPost,
            usersComment: prevPost.usersComment.map((item) =>
                item.idComment === idComment
                    ? {
                          ...item,
                          shares: item.shares + (isShares[idComment] ? -1 : 1),
                      }
                    : item,
            ),
        }));
        setIsShares((prevState) => ({
            ...prevState,
            [idComment]: !prevState[idComment],
        }));
    };

    useEffect(() => {
        setPostDetails(post);
        setPostList(() => post.usersComment);
    }, [post]);

    const { setPingStates, checkPingStates, currentItemIndex } = usePingStates(
        postsList,
        postRefs,
    );

    useAutoScroll(
        contentsChattingRef,
        postRefs,
        currentItemIndex,
        isRunAuto,
        isRunSpeed,
        checkPingStates,
        setPingStates,
        postsList,
    );

    return (
        <div ref={contentsChattingRef} className="flex justify-end">
            {postDetails?.usersComment?.map((item, i) => {
                const presentComment = repCommentPresent.find(
                    (rep) => rep.idPost === post.idPost,
                );
                return (
                    <div
                        key={i}
                        ref={(el) => (postRefs.current[i] = el)}
                        className={`${
                            presentComment && presentComment.number == i
                                ? 'flex'
                                : 'hidden'
                        }  mt-2 py-6 md:py-10 px-3 md:px-6 gap-3 md:gap-6 bg-slatePrimary`}
                    >
                        <div className="">
                            <div className="relative bg-white rounded-2xl w-full px-4 pb-5 pt-3">
                                <div className="flex items-center gap-[5px]">
                                    <h5 className="md:text-xl">{item.name}</h5>
                                    <span className="text-gray-500 font-medium text-sm md:text-base">
                                        {item.time}
                                    </span>
                                </div>
                                <button>
                                    <p className="text-left md:text-lg">
                                        {item.comments}
                                    </p>
                                </button>
                                <div className="absolute bottom-[-22px] left-0 border-[5px] border-slatePrimary flex gap-4 bg-white rounded-3xl px-3 py-[3px]">
                                    <div
                                        className={`${
                                            isFavorites[item.idComment]
                                                ? 'opacity-100 text-red-600'
                                                : 'opacity-40'
                                        }  flex items-center gap-[6px]`}
                                    >
                                        <FaRegHeart
                                            onClick={() =>
                                                favoriteHandle(item.idComment)
                                            }
                                        />
                                        <span className="text-sm font-medium">
                                            {item.favorites}
                                        </span>
                                    </div>
                                    <div
                                        className={`${
                                            isChanges[item.idComment]
                                                ? 'opacity-100 text-green-600'
                                                : 'opacity-40'
                                        }  flex items-center gap-[6px]`}
                                    >
                                        <PiArrowsClockwiseBold
                                            onClick={() =>
                                                changeHandle(item.idComment)
                                            }
                                        />
                                        <span className="text-sm font-medium">
                                            {item.changes}
                                        </span>
                                    </div>
                                    <div
                                        className={`${
                                            isShares[item.idComment]
                                                ? 'opacity-100 text-black'
                                                : 'opacity-40'
                                        } ml-6 flex items-center gap-4`}
                                    >
                                        <span className="text-sm font-medium">
                                            {item.shares}
                                        </span>
                                        <HiMiniArrowUpTray
                                            onClick={() =>
                                                shareHandle(item.idComment)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative h-10 md:h-12 min-w-10 md:min-w-12">
                            <Avatar
                                src={item.avatar}
                                className="absolute top-0 left-0 z-10 h-10 md:h-12 w-10 md:w-12 rounded-full object-cover"
                                alt="icon"
                            />
                            <div className="absolute bottom-0 right-[-3px] z-10 bg-blue-500 border border-white rounded-full">
                                <RiAddLine
                                    size="1.1rem"
                                    className="p-[2px] text-white"
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
