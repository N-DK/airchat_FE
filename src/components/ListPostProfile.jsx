import React, { useState } from 'react';
import { Avatar } from 'antd';
import { FaRegHeart, FaHeart, FaChartLine } from 'react-icons/fa';
import { PiArrowsClockwiseBold } from 'react-icons/pi';
import { HiMiniArrowUpTray } from 'react-icons/hi2';
import { heart } from '../redux/actions/PostActions';
import ListPostItems from './ListPostItems';
import PostContent from './PostContent';

const ListPostProfile = ({ list, userInfo }) => {
    const renderPostActions = (item) => {
        const [isHeart, setIsHeart] = useState(!!item.heart);
        const [likeCount, setLikeCount] = useState(item?.number_heart || 0);

        return (
            <div className="absolute items-center bottom-[-22px] right-0 border-[5px] border-slatePrimary dark:border-darkPrimary flex gap-4 bg-bluePrimary dark:bg-dark2Primary rounded-3xl px-3 py-[3px]">
                <div
                    onClick={() =>
                        handleAction(heart, item.id, () => {
                            setIsHeart(!isHeart);
                            setLikeCount(likeCount + (isHeart ? -1 : 1));
                        })
                    }
                    className="flex items-center text-white"
                >
                    {isHeart ? (
                        <FaHeart className="text-red-500" />
                    ) : (
                        <FaRegHeart />
                    )}
                    <span className="ml-2 text-sm font-medium">
                        {likeCount}
                    </span>
                </div>
                <div className="flex items-center text-white">
                    <PiArrowsClockwiseBold />
                    <span className="ml-2 text-sm font-medium">
                        {item.number_view}
                    </span>
                </div>
                <div className="flex items-center text-white">
                    <FaChartLine />
                    <span className="ml-2 text-sm font-medium">
                        {item.number_share}
                    </span>
                </div>
                <HiMiniArrowUpTray className="text-white" />
            </div>
        );
    };

    return (
        <>
            {list
                ?.filter((item) => item.user_id === userInfo.id)
                .map((item, i) => (
                    <div
                        key={i}
                        className="flex border-b-[6px] border-gray-200 dark:border-dark2Primary py-6 md:py-10 px-3 md:px-6 gap-3 md:gap-6 bg-slatePrimary dark:bg-darkPrimary"
                    >
                        <div className="relative h-10 md:h-12 min-w-10 md:min-w-12">
                            <Avatar
                                src={`https://talkie.transtechvietnam.com/${item.avatar}`}
                                className="absolute top-0 left-0 z-10 h-10 md:h-12 w-10 md:w-12 rounded-full object-cover"
                                alt="avatar"
                            />

                            <div className="absolute top-0 left-0 bg-white h-10 md:h-12 w-10 md:w-12 rounded-full"></div>
                        </div>
                        <div className="w-full">
                            <div className="relative bg-bluePrimary dark:bg-dark2Primary rounded-2xl w-full px-4 pb-5 pt-3">
                                <PostContent item={item} />
                                {renderPostActions(item)}
                            </div>
                        </div>
                    </div>
                ))}
            <ListPostItems
                postsList={list?.filter((item) => item.user_id !== userInfo.id)}
            />
        </>
    );
};

export default ListPostProfile;
