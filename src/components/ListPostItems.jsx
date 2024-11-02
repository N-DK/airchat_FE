import React, { useEffect, useState } from 'react';
import PostItem from './PostItem';
import { useDispatch, useSelector } from 'react-redux';
import { USER_FOLLOW_SUCCESS } from '../redux/constants/UserConstants';

function ListPostItems({
    postsList,
    contentsChattingRef,
    isTurnOnCamera,
    bonusHeight,
}) {
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const { success: newPost } = useSelector((state) => state.postSubmit);
    const { isSuccess: isSuccessFollow, stranger_id } = useSelector(
        (state) => state.userFollow,
    );

    useEffect(() => {
        if (isSuccessFollow) {
            if (!window.location.pathname.includes('profile')) {
                const newPostListData = data?.filter(
                    (item) => item?.user_id !== stranger_id,
                );
                setData(newPostListData);
            }
            dispatch({
                type: USER_FOLLOW_SUCCESS,
                payload: null,
                results: false,
            });
        }
    }, [isSuccessFollow, stranger_id, data, window.location.pathname]);

    useEffect(() => {
        if (newPost) {
            if (data.length === 0) {
                setData([newPost]);
            }
        }
    }, [newPost, data]);

    useEffect(() => {
        if (postsList && postsList.length > 0) {
            setData(postsList);
        } else {
            setData([]);
        }
    }, [postsList]);

    return (
        <div>
            {data?.map((item, index) => (
                <PostItem
                    key={`${item?.id}-${index}-${item?.name_channel}`}
                    item={item}
                    contentsChattingRef={contentsChattingRef}
                    setList={setData}
                    isTurnOnCamera={isTurnOnCamera}
                    bonusHeight={bonusHeight}
                />
            ))}
        </div>
    );
}

export default ListPostItems;
