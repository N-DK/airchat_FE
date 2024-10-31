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
import { LANGUAGE } from '../constants/language.constant';

const EmptyFollow = React.memo(() => {
    const { language } = useSelector((state) => state.userLanguage);
    return (
        <div className="flex flex-col items-center justify-center h-full fixed z-50 w-full left-0 pb-[200px]">
            <img src="./src/assets/Untitled-2.png" alt="" />
            <h5 className="mt-3 dark:text-white">
                {LANGUAGE[language].EMPTY_FOLLOW}
            </h5>
        </div>
    );
});

function DrawerFollower({
    userInfo,
    isStranger,
    typeDrawer,
    userInfoListFollowing,
    handleFollow,
}) {
    const { showDrawerFollow, toggleShowDrawerFollow } = useContext(AppContext);
    const dispatch = useDispatch();
    const { language } = useSelector((state) => state.userLanguage);
    const [listFollow, setListFollow] = useState([]);

    const follower = useSelector(
        useCallback(
            (state) =>
                isStranger
                    ? state.userGetFollowerStranger.follower
                    : state.userGetFollower.follower,
            [isStranger],
        ),
    );

    const following = useSelector(
        useCallback(
            (state) =>
                isStranger
                    ? state.userGetFollowingStranger.following
                    : state.userGetFollowing.following,
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
                        {userInfo?.username}'s{' '}
                        {LANGUAGE[language][typeDrawer?.toUpperCase()]}
                    </div>
                </div>
                {memoizedListFollow}
            </div>
        </div>
    );
}

export default React.memo(DrawerFollower);
