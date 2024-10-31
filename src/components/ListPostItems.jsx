import React, { useEffect, useState } from 'react';
import PostItem from './PostItem';
import { useDispatch, useSelector } from 'react-redux';
import { USER_FOLLOW_SUCCESS } from '../redux/constants/UserConstants';
import { useLocation } from 'react-router-dom';

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
            // if (redirect === 'see-all') {
            //     navigate('/seeall');
            // } else if (redirect?.includes('group-channel')) {
            //     const channel_id = redirect?.split('/')[1];
            //     dispatch(
            //         listPost(
            //             redirect?.split('/')[0],
            //             limit,
            //             offset,
            //             channel_id,
            //             1,
            //         ),
            //     );
            // } else if (redirect !== 'see-all') {
            //     dispatch(listPost(redirect, limit, offset));
            // }
            // lọc postListData có user_id trùng với stranger_id
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
