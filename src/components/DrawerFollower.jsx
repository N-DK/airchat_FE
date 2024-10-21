import React, {
    useContext,
    useEffect,
    useState,
    useMemo,
    useCallback,
} from 'react';
import { AppContext } from '../AppContext';
import { FaAngleLeft } from 'react-icons/fa';
import { Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
    follow,
    getFollower,
    getFollowerStranger,
    getFollowing,
    getFollowingStranger,
} from '../redux/actions/UserActions';
import LoadingSpinner from './LoadingSpinner';
import { ItemFollow } from './ItemFollow';

// const ItemFollow = React.memo(({ data, isFollowing, handleFollow }) => {
//     const [localIsFollowing, setLocalIsFollowing] = useState(isFollowing);
//     const [isLoading, setIsLoading] = useState(false);

//     const handleClick = useCallback(async () => {
//         setIsLoading(true);
//         try {
//             await handleFollow(
//                 follow,
//                 data?.stranger_id ?? data?.following_stranger_id,
//             );
//             setLocalIsFollowing((prev) => !prev);
//         } catch (error) {
//             console.error('Failed to follow/unfollow:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     }, [handleFollow, data]);

//     return (
//         <div className="flex items-center justify-between mb-10">
//             <div className="flex-1 w-10 h-10 rounded-full flex items-center">
//                 <Avatar
//                     size={44}
//                     src={
//                         data?.image === '0'
//                             ? 'https://picsum.photos/200/300'
//                             : data.image
//                     }
//                     alt=""
//                 />
//                 <div className="ml-3">
//                     <h5>{data?.name}</h5>
//                     <span>{data?.user_name}</span>
//                 </div>
//             </div>
//             <button
//                 onClick={handleClick}
//                 disabled={isLoading}
//                 className={`rounded-full px-8 py-1 ${
//                     localIsFollowing
//                         ? 'bg-bluePrimary text-white'
//                         : 'bg-gray-300'
//                 } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//             >
//                 {isLoading ? (
//                     <LoadingSpinner />
//                 ) : localIsFollowing ? (
//                     'Following'
//                 ) : (
//                     'Follow'
//                 )}
//             </button>
//         </div>
//     );
// });

const EmptyFollow = React.memo(() => (
    <div className="flex flex-col items-center justify-center h-full fixed z-50 w-full left-0">
        <img src="./src/assets/Untitled-2.png" alt="" />
        <h5 className="mt-3 dark:text-white">Nothing to show here</h5>
    </div>
));

function DrawerFollower({
    userInfo,
    isStranger,
    typeDrawer,
    userInfoListFollowing,
    handleFollow,
}) {
    const { showDrawerFollow, toggleShowDrawerFollow } = useContext(AppContext);
    const dispatch = useDispatch();

    const [listFollow, setListFollow] = useState([]);

    const { follower, following } = useSelector(
        useCallback(
            (state) => ({
                follower: isStranger
                    ? state.userGetFollowerStranger.follower
                    : state.userGetFollower.follower,
                following: isStranger
                    ? state.userGetFollowingStranger.following
                    : state.userGetFollowing.following,
            }),
            [isStranger],
        ),
    );
    const userFollow = useSelector((state) => state.userFollow);

    useEffect(() => {
        setListFollow(typeDrawer === 'following' ? following : follower);
    }, [follower, following, typeDrawer]);

    useEffect(() => {
        const action =
            typeDrawer === 'following'
                ? isStranger
                    ? getFollowingStranger
                    : getFollowing
                : isStranger
                ? getFollowerStranger
                : getFollower;

        if (showDrawerFollow) {
            if (isStranger && userInfo?.id) {
                dispatch(action(userInfo.id));
            } else if (!isStranger) {
                dispatch(action());
            }
        }
    }, [dispatch, isStranger, typeDrawer, showDrawerFollow]); //userInfo,

    const memoizedListFollow = useMemo(() => {
        if (!listFollow) {
            return <LoadingSpinner />;
        }

        return (
            <div className="px-5 md:px-10 pt-6 pb-5">
                {listFollow.length > 0 ? (
                    listFollow.map((item, index) => (
                        <ItemFollow
                            key={index}
                            data={item}
                            isFollowing={userInfoListFollowing?.some(
                                (item_follow) =>
                                    item_follow.stranger_id ===
                                    parseInt(
                                        item.stranger_id ??
                                            item.following_stranger_id,
                                    ),
                            )}
                            handleFollow={handleFollow}
                        />
                    ))
                ) : (
                    <EmptyFollow />
                )}
            </div>
        );
    }, [listFollow, userInfoListFollowing, handleFollow]);

    return (
        <div
            className={`absolute left-0 top-0 z-50 w-full h-screen transition-all duration-300 ${
                showDrawerFollow ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            <div className="bg-white dark:bg-dark2Primary h-full">
                <div className="relative pt-12 pb-8 px-5 md:px-10 flex justify-center items-center py-3 md:py-5 text-lg md:text-[19px] border-b-[1px] border-gray-300">
                    <button
                        className="text-black dark:text-white absolute left-4"
                        onClick={toggleShowDrawerFollow}
                    >
                        <FaAngleLeft className="text-lg md:text-[22px]" />
                    </button>
                    <div className="text-black dark:text-white font-semibold">
                        {userInfo?.username}'s {typeDrawer}
                    </div>
                </div>
                {memoizedListFollow}
            </div>
        </div>
    );
}

export default React.memo(DrawerFollower);
