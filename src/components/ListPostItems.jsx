import React from 'react';
import PostItem from './PostItem';

function ListPostItems({ postsList, contentsChattingRef }) {
    return (
        <div>
            {postsList?.map((item, index) => (
                <PostItem
                    key={`${item?.id}-${index}`}
                    item={item}
                    contentsChattingRef={contentsChattingRef}
                />
            ))}
        </div>
    );
}

export default ListPostItems;
