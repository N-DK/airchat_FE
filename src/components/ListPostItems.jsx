import React from 'react';
import PostItem from './PostItem';

function ListPostItems({ postsList, postRefs }) {
    return (
        <div>
            {postsList?.map((item, i) => (
                <PostItem key={i} item={item} i={i} postRefs={postRefs} />
            ))}
        </div>
    );
}

export default ListPostItems;
