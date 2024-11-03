import { Avatar } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addRecentSearch } from '../redux/actions/UserActions';

export const PeopleCircle = ({ data, isAddRecentSearch = false }) => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.userProfile);
    const dispatch = useDispatch();
    const handleAddRecentSearch = () => {
        if (isAddRecentSearch) {
            dispatch(
                addRecentSearch({
                    channel_id: -1,
                    stranger_id: data?.id || data?.user_id,
                }),
            );
        }
        const profileId = data?.id || data?.user_id;
        const isOwnProfile = profileId === userInfo?.id;
        const profilePath = isOwnProfile
            ? '/profile/posts'
            : `/profile/${profileId}/posts`;
        navigate(profilePath);
    };

    return (
        <div onClick={handleAddRecentSearch} className="mr-3 w-20">
            <div className="flex flex-col justify-center items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-1">
                    <Avatar
                        size={64}
                        src={`https://talkie.transtechvietnam.com/${
                            data?.image ?? data?.user_avatar
                        }`}
                        alt={data?.name}
                    />
                </div>
                <p className="dark:text-white w-full text-center truncate">
                    {data?.name ?? data?.name_user}
                </p>
                <p className="text-sm text-gray-500 w-full text-center truncate">
                    {data?.username}
                </p>
            </div>
        </div>
    );
};

export default PeopleCircle;
