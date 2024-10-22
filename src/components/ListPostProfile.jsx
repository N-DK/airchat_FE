import React, { useState } from 'react';

import ListPostItems from './ListPostItems';
import PostContent from './PostContent';
import { useDispatch } from 'react-redux';

const ListPostProfile = ({
    list,
    userInfo,
    isTurnOnCamera,
    contentsChattingRef,
}) => {
    return (
        <>
            {list
                ?.filter((item) => item.user_id === userInfo.id)
                .map((item, i) => (
                    <PostContent
                        key={i}
                        item={item}
                        contentsChattingRef={contentsChattingRef}
                    />
                ))}
            <ListPostItems
                postsList={list?.filter((item) => item.user_id !== userInfo.id)}
                isTurnOnCamera={isTurnOnCamera}
                contentsChattingRef={contentsChattingRef}
            />
        </>
    );
};

export default ListPostProfile;
