import React, { useEffect, useState } from 'react';
import PostItem from './PostItem';
import { useDispatch, useSelector } from 'react-redux';
import { USER_FOLLOW_SUCCESS } from '../redux/constants/UserConstants';

function ListPostItems({
    postsList,
    contentsChattingRef,
    isTurnOnCamera,
    bonusHeight,
    setPostList,
}) {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const [isFlag, setIsFlag] = useState(true);
    const { success: newPost } = useSelector((state) => state.postSubmit);
    const { isSuccess: isSuccessFollow, stranger_id } = useSelector(
        (state) => state.userFollow,
    );

    const updatePosts = (newPosts) => {
        setPostList ? setPostList(newPosts) : setData(newPosts);
    };

    const finalData = setPostList ? postsList : data;

    useEffect(() => {
        if (isSuccessFollow && !window.location.pathname.includes('profile')) {
            const filteredData = finalData.filter(
                (item) => item?.user_id !== stranger_id,
            );
            updatePosts(filteredData);
            dispatch({
                type: USER_FOLLOW_SUCCESS,
                payload: null,
                results: false,
            });
        }
    }, [isSuccessFollow, stranger_id, finalData, dispatch]);

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
                />
            ))}
        </div>
    );
}

export default ListPostItems;
