import { Avatar } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addRecentSearch } from '../redux/actions/UserActions';

export default function ChannelCircle({ data }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

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
        <div onClick={handleAddRecentSearch} className="mr-3">
            <div className="flex flex-col justify-center items-center">
                <figure className="mb-1">
                    <Avatar
                        size={44}
                        src={`https://talkie.transtechvietnam.com/${data?.photo}`}
                        alt={data?.name}
                    />
                </figure>
                <p className="dark:text-white">{data?.name}</p>
                {/* <p className="text-sm text-gray-500">21 members</p> */}
            </div>
        </div>
    );
}
