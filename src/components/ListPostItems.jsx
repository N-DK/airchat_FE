import React from 'react';
import PostItem from './PostItem';

function ListPostItems({ postsList }) {
    return (
        <div>
            {postsList?.map((item, i) => (
                <PostItem key={item?.id} item={item} />
            ))}
        </div>
    );
}

export default ListPostItems;
