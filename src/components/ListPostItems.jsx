import React, { useEffect, useState } from 'react';
import PostItem from './PostItem';

function ListPostItems({ postsList, contentsChattingRef }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (postsList) {
            setData(postsList);
        }
    }, [postsList]);

    return (
        <div>
            {data?.map((item, index) => (
                <PostItem
                    key={`${item?.id}-${index}`}
                    item={item}
                    contentsChattingRef={contentsChattingRef}
                    setList={setData}
                />
            ))}
        </div>
    );
}

export default ListPostItems;
