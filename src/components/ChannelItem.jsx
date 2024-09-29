import { Avatar } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ChannelItem = ({ data }) => {
    const navigate = useNavigate();

    return (
        <div onClick={() => navigate(`/channel/${data?.id}`)} className="py-3">
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
                <button className="text-base">Join</button>
            </div>
        </div>
    );
};
