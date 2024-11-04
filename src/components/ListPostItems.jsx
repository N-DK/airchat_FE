import React, { useEffect, useMemo, useState } from 'react';
import PostItem from './PostItem';
import { useDispatch, useSelector } from 'react-redux';
import {
    USER_FOLLOW_SUCCESS,
    USER_SHARE_POST_SUCCESS,
} from '../redux/constants/UserConstants';
import { POST_BOOKMARK_SUCCESS } from '../redux/constants/PostConstants';
import { useLocation } from 'react-router-dom';
import { profile } from '../redux/actions/UserActions';

function ListPostItems({
    postsList,
    contentsChattingRef,
    isTurnOnCamera,
    bonusHeight,
    setPostList,
    setListProfile,
    bonusKey,
}) {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [isFlag, setIsFlag] = useState(true);
    const userBookMark = useSelector((state) => state.userBookMark);
    const userSharePost = useSelector((state) => state.userSharePost);

    const { pathname } = useLocation();
    const { success: isSuccessBookmark, post_id: postIdBookMark } =
        userBookMark;
    const { isSuccess: isSuccessShare, post_id: postIdShare } = userSharePost;
    const { success: newPost } = useSelector((state) => state.postSubmit);
    const { isSuccess: isSuccessFollow, stranger_id } = useSelector(
        (state) => state.userFollow,
    );
    const { userInfo } = useSelector((state) => state.userProfile);

    const updatePosts = (newPosts) => {
        setPostList ? setPostList(newPosts) : setData(newPosts);
    };

    const finalData = useMemo(
        () => (setPostList ? postsList : data),
        [setPostList, postsList, data],
    );

    useEffect(() => {
        if (!userInfo) dispatch(profile());
    }, [dispatch]);

    useEffect(() => {
        if (isSuccessFollow) {
            // const filteredData = finalData.filter(
            //     (item) => item?.user_id !== stranger_id,
            // );
            // updatePosts(filteredData);

            updatePosts(
                finalData?.map((item) => {
                    if (item?.user_id === stranger_id) {
                        return {
                            ...item,
                            dafollow: !!item?.dafollow ? 0 : 1,
                        };
                    }
                    return item;
                }),
            );

            dispatch({
                type: USER_FOLLOW_SUCCESS,
                payload: null,
                results: false,
            });
        }
    }, [isSuccessFollow, stranger_id, finalData, dispatch, pathname]);

    useEffect(() => {
        if (isSuccessBookmark) {
            if (pathname.includes('bookmarks')) {
                console.log('finalData', finalData);

                const filteredData = finalData.filter(
                    (item) =>
                        item?.bookmark ||
                        (item?.reply?.length > 0 &&
                            item?.reply?.some((reply) => reply?.bookmark)),
                );

                if (setListProfile) {
                    setListProfile((prev) => {
                        const userPosts = prev.filter(
                            (item) => item.user_id === userInfo.id,
                        );

                        return [...filteredData, ...userPosts];
                    });
                }

                updatePosts(filteredData);
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
        finalData,
        dispatch,
        pathname,
        setListProfile,
    ]);

    useEffect(() => {
        if (isSuccessShare) {
            if (
                pathname.split('/')?.[1] === 'profile' &&
                pathname.split('/')?.[2] === 'posts'
            ) {
                const filteredData = finalData.filter((item) =>
                    item?.reply?.some(
                        (reply) => reply?.user_id === userInfo.id,
                    ),
                );

                updatePosts(filteredData);
            }
            dispatch({
                type: USER_SHARE_POST_SUCCESS,
                payload: null,
                post_id: null,
            });
        }
    }, [isSuccessShare, postIdShare, finalData, dispatch]);

    useEffect(() => {
        if (newPost && finalData.length === 0) {
            updatePosts([newPost]);
        }
    }, [newPost, finalData]);

    useEffect(() => {
        if (isFlag) {
            updatePosts(postsList?.length > 0 ? postsList : []);
            setIsFlag(false);
        }
    }, [postsList, isFlag]);

    return (
        <div>
            {finalData.map((item, index) => (
                <PostItem
                    key={`${item?.id}-${index}-${item?.name_channel}`}
                    item={item}
                    contentsChattingRef={contentsChattingRef}
                    setList={setPostList || setData}
                    isTurnOnCamera={isTurnOnCamera}
                    bonusHeight={bonusHeight}
                    bonusKey={bonusKey}
                />
            ))}
        </div>
    );
}

export default ListPostItems;
