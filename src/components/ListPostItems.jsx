import React from 'react';
import PostItem from './PostItem';

function ListPostItems({ postsList }) {
    return (
        <div>
            {postsList?.map((item, index) => (
                <PostItem key={`${item?.id}-${index}`} item={item} />
            ))}
        </div>
    );
}

export default ListPostItems;
