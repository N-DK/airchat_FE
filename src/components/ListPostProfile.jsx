import React, { useEffect, useState } from 'react';

import ListPostItems from './ListPostItems';
import PostContent from './PostContent';
import { useDispatch, useSelector } from 'react-redux';
import { POST_BOOKMARK_SUCCESS } from '../redux/constants/PostConstants';
import { useLocation } from 'react-router-dom';

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
    const { success: isSuccessBookmark, post_id: postIdBookMark } =
        userBookMark;

    useEffect(() => {
        if (isSuccessBookmark) {
            if (pathname.includes('bookmarks')) {
                setListProfile((prev) =>
                    prev.filter(
                        (item) =>
                            item?.id !== postIdBookMark &&
                            !item?.reply?.some(
                                (reply) => reply?.id === postIdBookMark,
                            ),
                    ),
                );
            }
            dispatch({
                type: POST_BOOKMARK_SUCCESS,
                payload: null,
                post_id: null,
            });
        }
    }, [isSuccessBookmark, postIdBookMark, dispatch, pathname]);

    useEffect(() => {
        if (listProfile) {
            setListPost(
                listProfile?.filter((item) => item.user_id !== userInfo.id),
            );
        }
    }, [listProfile]);

    return (
        <>
            {listProfile
                ?.filter((item) => item.user_id === userInfo.id)
                .map((item, i) => (
                    <PostContent
                        key={i}
                        item={item}
                        contentsChattingRef={contentsChattingRef}
                    />
                ))}
            <ListPostItems
                postsList={listPost}
                isTurnOnCamera={isTurnOnCamera}
                contentsChattingRef={contentsChattingRef}
                setPostList={setListPost}
            />
        </>
    );
};

export default ListPostProfile;
