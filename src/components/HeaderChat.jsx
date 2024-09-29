import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Avatar } from 'antd';
import { IoIosAdd } from 'react-icons/io';
import { FaRegUser } from 'react-icons/fa6';
import talkieLogo from '../assets/talkie-logo.png';
import { AppContext } from '../AppContext';
import LoaderSkeletonMenuBar from './LoaderSkeletonMenuBar';
import { DEFAULT_PROFILE } from '../constants/image.constant';

const HeaderChat = ({ title, isSwiping }) => {
    const { menus, loading } = useSelector((state) => state.menuBar);
    const navigate = useNavigate();
    const { toggleIsAddChannel } = useContext(AppContext);

    const renderMenuItems = () => {
        if (loading) return <LoaderSkeletonMenuBar />;

        return menus?.map((item, i) => (
            <button
                key={i}
                onClick={() =>
                    navigate(
                        `/chatting/?redirect=${item.key}${
                            item.key.includes('group-channel')
                                ? `/${item.channel_id}`
                                : ''
                        }`,
                    )
                }
                className={`text-[13px] md:text-base font-medium rounded-3xl px-4 py-2 ${
                    i === menus.length - 1 ? 'mr-5' : ''
                } ${
                    item.key.includes('group-channel')
                        ? title === `${item.key}/${item.channel_id}`
                            ? 'bg-bluePrimary dark:bg-slate-500'
                            : 'bg-grayPrimary dark:bg-dark2Primary'
                        : title === item.key
                        ? 'bg-bluePrimary dark:bg-slate-500'
                        : 'bg-grayPrimary dark:bg-dark2Primary'
                }`}
            >
                <div className="flex justify-center items-center gap-2">
                    {item.key === 'for-you' && (
                        <Avatar
                            src={
                                item.img && item.img !== '0'
                                    ? `https://talkie.transtechvietnam.com/${item.img}`
                                    : DEFAULT_PROFILE
                            }
                            alt="avatar"
                            className="w-5 h-5 object-cover rounded-full"
                        />
                    )}
                    <span
                        className={
                            item.key.includes('group-channel')
                                ? title === `${item.key}/${item.channel_id}`
                                    ? 'text-white'
                                    : 'text-black dark:text-gray-400'
                                : title === item.key
                                ? 'text-white'
                                : 'text-black dark:text-gray-400'
                        }
                    >
                        {item.name}
                    </span>
                </div>
            </button>
        ));
    };

    return (
        <div
            className={`z-40 bg-white dark:bg-darkPrimary pb-[10px] ${
                isSwiping ? 'translate-y-[-150px] opacity-0' : 'opacity-100'
            } transition-all duration-500`}
        >
            <div className="text-black dark:text-white flex justify-between pt-12 px-6 md:px-10">
                <button onClick={() => navigate('/profile')}>
                    <FaRegUser className="text-xl md:text-2xl" />
                </button>
                <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://webrtc.github.io/samples/"
                >
                    <img src={talkieLogo} className="w-9" alt="Talkie Logo" />
                </a>
                <button onClick={toggleIsAddChannel}>
                    <IoIosAdd className="text-3xl md:text-4xl" />
                </button>
            </div>

            <div className="flex gap-3 pl-6 md:pl-10 mt-6 whitespace-nowrap overflow-auto scrollbar-none">
                {renderMenuItems()}
            </div>
        </div>
    );
};

export default HeaderChat;
