import { Avatar } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { addRecentSearch } from '../redux/actions/UserActions';
import { useDispatch } from 'react-redux';

export const ChannelItem = ({ data }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleJoinChannel = () => {
        // navigate(`/channel/${data?.id}`);
    };

    const handleAddRecentSearch = () => {
        dispatch(
            addRecentSearch({
                channel_id: data?.id,
                stranger_id: 0,
            }),
        );
        navigate(`/channel/${data?.id}`, {
            state: {
                channelData: data,
            },
        });
    };

    return (
        <div onClick={handleAddRecentSearch} className="py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <figure className="mr-2">
                        <Avatar
                            size={44}
                            src={`https://talkie.transtechvietnam.com/${data?.photo}`}
                            alt="avatar"
                        />
                    </figure>
                    <div>
                        <p className="text-black dark:text-white">
                            {data?.name}
                        </p>
                        <p className="text-gray-500">3 members</p>
                    </div>
                </div>
                <button className="text-base dark:text-white">Join</button>
            </div>
        </div>
    );
};
