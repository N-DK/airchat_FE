import { Avatar } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export const PeopleCircle = ({ data }) => {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.userProfile);
    return (
        <div
            onClick={() =>
                navigate(
                    `/profile${
                        data?.id === userInfo?.id ? '' : `/${data?.id}`
                    }`,
                )
            }
            className="mr-3 w-20"
        >
            <div className="flex flex-col justify-center items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden mb-1">
                    <Avatar
                        size={64}
                        src={`https://talkie.transtechvietnam.com/${data?.image}`}
                        alt={data?.name}
                    />
                </div>
                <p className="dark:text-white w-full text-center truncate">
                    {data?.name}
                </p>
                <p className="text-sm text-gray-500 w-full text-center truncate">
                    {data?.username}
                </p>
            </div>
        </div>
    );
};

export default PeopleCircle;
