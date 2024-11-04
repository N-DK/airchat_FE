import React, { useEffect, useState } from 'react';

import ListPostItems from './ListPostItems';
import PostContent from './PostContent';
import { useDispatch, useSelector } from 'react-redux';
import { POST_BOOKMARK_SUCCESS } from '../redux/constants/PostConstants';
import { useLocation } from 'react-router-dom';
import isEqual from 'lodash/isEqual';

const ListPostProfile = ({
    listProfile,
    userInfo,
    isTurnOnCamera,
    contentsChattingRef,
    setListProfile,
}) => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const [listPost, setListPost] = useState([]);
    const userBookMark = useSelector((state) => state.userBookMark);
    const {
        success: isSuccessBookmark,
        post_id: postIdBookMark,
        message,
    } = userBookMark;

    useEffect(() => {
        if (isSuccessBookmark) {
            if (
                pathname.includes('bookmarks') &&
                message.includes('unbookmark')
            ) {
                setListProfile((prev) => {
                    const newListProfile = [...prev];

                    const nonUserPosts = newListProfile.filter(
                        (item) => item.user_id !== userInfo.id,
                    );

                    const userPosts = newListProfile.filter(
                        (item) => item.user_id === userInfo.id,
                    );

                    const filteredUserPosts = userPosts.filter(
                        (item) =>
                            item?.bookmark ||
                            (item?.reply?.length > 0 &&
                                item?.reply?.some((reply) => reply?.bookmark)),
                    );

                    return [...nonUserPosts, ...filteredUserPosts];
                });
            }
            dispatch({
                type: POST_BOOKMARK_SUCCESS,
                payload: null,
                post_id: null,
            });
        }
    }, [
        isSuccessBookmark,
        postIdBookMark,
        dispatch,
        pathname,
        message,
        userInfo,
    ]);

    useEffect(() => {
        if (listProfile) {
            const nonUserPosts =
                listProfile?.filter((item) => item.user_id !== userInfo.id) ||
                [];
            setListPost(nonUserPosts);
        }
    }, [listProfile, userInfo]);

    return (
        <>
            {listProfile
                ?.filter((item) => item.user_id === userInfo.id)
                .map((item, i) => (
                    <PostContent
                        key={i}
                        item={item}
                        contentsChattingRef={contentsChattingRef}
                        setListProfile={setListProfile}
                    />
                ))}
            {listPost?.length > 0 && (
                <ListPostItems
                    postsList={listPost}
                    isTurnOnCamera={isTurnOnCamera}
                    contentsChattingRef={contentsChattingRef}
                    setPostList={setListPost}
                    setListProfile={setListProfile}
                />
            )}
        </>
    );
};

export default ListPostProfile;
