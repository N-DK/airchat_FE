import React, { useEffect, useState } from 'react';
import PostItem from './PostItem';
import { useSelector } from 'react-redux';

function ListPostItems({
    postsList,
    contentsChattingRef,
    isTurnOnCamera,
    bonusHeight,
}) {
    const [data, setData] = useState([]);
    const { success: newPost } = useSelector((state) => state.postSubmit);

    useEffect(() => {
        if (newPost) {
            if (data.length === 0) {
                setData([newPost]);
            }
        }
    }, [newPost, data]);

    useEffect(() => {
        if (postsList) {
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
