import React, {
    useState,
    useCallback,
    useContext,
    useMemo,
    useEffect,
} from 'react';
import { Avatar } from 'antd';
import { follow } from '../redux/actions/UserActions';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppContext } from '../AppContext';
import { LANGUAGE } from '../constants/language.constant';

export const ItemFollow = React.memo(({ data, isFollowing, handleFollow }) => {
    const { showDrawerFollow, toggleShowDrawerFollow } = useContext(AppContext);
    const [localIsFollowing, setLocalIsFollowing] = useState(isFollowing);
    const [isLoading, setIsLoading] = useState(false);
    const { userInfo } = useSelector((state) => state.userProfile);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { language } = useSelector((state) => state.userLanguage);

    const userId = useMemo(
        () => data?.stranger_id ?? data?.following_stranger_id ?? data?.id,
        [data],
    );

    useEffect(() => {
        if (isFollowing) setLocalIsFollowing(isFollowing);
    }, [isFollowing]);

    const handleClick = useCallback(
        async (e) => {
            e.stopPropagation();
            e.preventDefault();
            setIsLoading(true);
            try {
                await handleFollow(follow, userId);
                setLocalIsFollowing((prev) => !prev);
            } catch (error) {
                console.error('Failed to follow/unfollow:', error);
            } finally {
                setIsLoading(false);
            }
        },
        [handleFollow, userId],
    );

    const navigateToProfile = useCallback(() => {
        if (showDrawerFollow) toggleShowDrawerFollow();
        navigate(`/profile${userId === userInfo?.id ? '' : `/${userId}`}`);
    }, [
        showDrawerFollow,
        toggleShowDrawerFollow,
        navigate,
        userId,
        userInfo?.id,
    ]);

    const buttonClass = useMemo(
        () =>
            `rounded-full px-8 py-1 ${
                localIsFollowing ? 'bg-bluePrimary text-white' : 'bg-gray-300'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`,
        [localIsFollowing, isLoading],
    );

    const showButton = pathname === '/profile' || userInfo?.id !== data?.id;

    return (
        <div
            onClick={navigateToProfile}
            className="flex items-center justify-between py-3"
        >
            <div className="flex-1 w-10 h-10 rounded-full flex items-center">
                <Avatar
                    size={44}
                    src={`https://talkie.transtechvietnam.com/${data?.image}`}
                    alt=""
                />
                <div className="ml-3 dark:text-white">
                    <h5>{data?.name}</h5>
                    <span className="text-gray-500">{data?.username}</span>
                </div>
            </div>
            {showButton && (
                <button
                    onClick={handleClick}
                    disabled={isLoading}
                    className={buttonClass}
                >
                    {localIsFollowing
                        ? LANGUAGE[language].FOLLOWING
                        : LANGUAGE[language].FOLLOW}
                </button>
            )}
        </div>
    );
});
