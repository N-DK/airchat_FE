import talkieLogo from '../assets/talkie-logo.png';
import { IoIosAdd } from 'react-icons/io';
import { FaRegUser } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { AppContext } from './../AppContext';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import LoaderSkeletonMenuBar from './LoaderSkeletonMenuBar';
import { FaChevronDown } from 'react-icons/fa6';
import React from 'react';
import { DEFAULT_PROFILE } from '../constants/image.constant';
import { Avatar } from 'antd';

export default function HeaderChat({ title, isSwiping }) {
    const menuBar = useSelector((state) => state.menuBar);
    const { menus, loading } = menuBar;

    const navigate = useNavigate();
    const { toggleIsAddChannel } = useContext(AppContext);

    // <FaChevronDown
    //   className={`text-xs ${
    //     title == item.key
    //       ? "text-grayPrimary dark:text-grayPrimary"
    //       : "text-gray-700 dark:text-slate-500"
    //   }`}
    // />;

    return (
        <div
            className={`z-40 bg-white dark:bg-darkPrimary pb-[10px] ${
                isSwiping ? 'translate-y-[-150px] opacity-0' : 'opacity-100'
            } transition-all duration-500`}
        >
            <div className="text-black dark:text-white flex justify-between pt-12 px-6 md:px-10">
                <button onClick={() => navigate('/profile')} className="">
                    <FaRegUser className="text-xl md:text-2xl" />
                </button>
                <a
                    target="_blank"
                    href="https://webrtc.github.io/samples/"
                    className=""
                >
                    <img src={talkieLogo} className="w-9" alt="" />
                </a>
                <button className="" onClick={() => toggleIsAddChannel()}>
                    <IoIosAdd className="text-3xl md:text-4xl" />
                </button>
            </div>

            <div className="flex gap-3 pl-6 md:pl-10 mt-6 whitespace-nowrap overflow-auto scrollbar-none">
                {loading ? (
                    <LoaderSkeletonMenuBar />
                ) : (
                    menus?.map((item, i) => (
                        <button
                            onClick={() =>
                                navigate(`/chatting/?redirect=${item.key}`)
                            }
                            className={`text-[13px] md:text-base font-medium rounded-3xl px-4 py-2 ${
                                menus.length - 1 == i && 'mr-5'
                            } ${
                                title == item.key
                                    ? 'bg-bluePrimary dark:bg-slate-500'
                                    : 'bg-grayPrimary dark:bg-dark2Primary'
                            }`}
                            key={i}
                        >
                            <div className="flex justify-center items-center gap-2">
                                <div>
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
                                </div>
                                <span
                                    className={`${
                                        title == item.key
                                            ? 'text-white'
                                            : 'text-black dark:text-gray-400'
                                    }`}
                                >
                                    {item.name}
                                </span>
                            </div>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
