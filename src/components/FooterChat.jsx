import { GoHomeFill } from 'react-icons/go';
import { IoSearch } from 'react-icons/io5';
import { IoMdMic } from 'react-icons/io';
import { MdOutlineNotifications } from 'react-icons/md';
import { HiOutlineMail } from 'react-icons/hi';
import { CgArrowsExpandRight } from 'react-icons/cg';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from '../AppContext';
import { HiPause } from 'react-icons/hi2';
import { HiMiniPlay } from 'react-icons/hi2';
import { IoVideocam } from 'react-icons/io5';
import React from 'react';

export default function FooterChat({ isSwiping, title, isPlay }) {
    const navigate = useNavigate();
    const {
        toggleIsRecord,
        isRunAuto,
        toggleIsRunAuto,
        isRunSpeed,
        toggleIsRunSpeed,
        toggleIsFullScreen,
        recordOption,
        toggleRecordOption,
    } = useContext(AppContext);
    const iconsMenu = [
        {
            icon: <GoHomeFill size="1.8rem" />,
            name: 'chatting',
        },
        {
            icon: <IoSearch size="1.8rem" />,
            name: 'seeall',
        },
        {
            icon:
                recordOption === 'audio' ? (
                    <IoMdMic size="1.8rem" />
                ) : (
                    <IoVideocam size="1.7rem" />
                ),
            name: 'mic',
        },
        {
            icon: <MdOutlineNotifications size="1.8rem" />,
            name: 'notifications',
        },
        {
            icon: <HiOutlineMail size="1.8rem" />,
            name: 'messages',
        },
    ];

    const navigateHandle = (name) => {
        if (name == 'mic' && isPlay) {
            toggleIsRecord();
        } else {
            if (name !== 'mic') {
                navigate(`/${name}`);
            }
        }
    };

    return (
        <div
            className={`z-40 fixed bg-white bottom-0 w-full transition-all duration-500 ${
                isSwiping
                    ? 'bg-opacity-0'
                    : 'bg-opacity-100 dark:bg-darkPrimary'
            }`}
        >
            <div>
                <div className="flex justify-between items-center px-6 md:px-10 lg:px-64">
                    {iconsMenu.map((item, i) => (
                        <button
                            onClick={() => navigateHandle(item.name)}
                            key={i}
                            className={`${
                                i == 2
                                    ? `z-10 flex justify-center items-center w-[55px] h-[55px] rounded-full bg-black dark:bg-dark2Primary ${
                                          !isPlay
                                              ? 'bg-opacity-20'
                                              : 'bg-opacity-100'
                                      } mt-[2px] text-white`
                                    : `${
                                          isSwiping
                                              ? 'opacity-20'
                                              : title == item.name
                                              ? 'opacity-100'
                                              : 'opacity-20'
                                      } dark:text-white transition-all duration-500`
                            }`}
                        >
                            {item.icon}
                        </button>
                    ))}
                </div>

                <div
                    className={`flex justify-center gap-2 font-medium text-sm mt-2 mb-5 ${
                        isSwiping || !isPlay ? 'opacity-20' : 'opacity-100'
                    } transition-all duration-500`}
                >
                    <button
                        onClick={toggleRecordOption('audio')}
                        className={`${
                            recordOption == 'audio'
                                ? 'text-black dark:text-gray-200'
                                : 'text-gray-300 dark:text-gray-500'
                        }`}
                    >
                        Audio
                    </button>
                    <button
                        onClick={toggleRecordOption('video')}
                        className={`${
                            recordOption == 'video'
                                ? 'text-black dark:text-gray-200'
                                : 'text-gray-300 dark:text-gray-500'
                        }`}
                    >
                        Video
                    </button>
                </div>
            </div>

            <div
                className={`absolute left-1/2 top-[-10px] transform -translate-x-1/2 w-[88px] h-[88px] rounded-full border-t-[12px] border-white dark:border-darkPrimary ${
                    isSwiping ? 'opacity-0' : 'opacity-100'
                } transition-all duration-500`}
            ></div>

            {isPlay && (
                <div className="absolute bottom-[124px] right-5">
                    {isRunAuto && (
                        <button
                            onClick={() => toggleIsRunSpeed()}
                            className="mb-5 flex justify-center items-center w-[60px] h-[60px] rounded-full bg-white dark:bg-darkPrimary shadow-lg dark:shadow-gray-800"
                        >
                            <div className="text-black dark:text-white">
                                <span className="font-semibold text-2xl">
                                    {isRunSpeed}
                                </span>
                                <span className="font-semibold text-lg">x</span>
                            </div>
                        </button>
                    )}
                    <button
                        onClick={() => toggleIsFullScreen()}
                        className="mb-5 flex justify-center items-center w-[60px] h-[60px] rounded-full bg-white dark:bg-darkPrimary shadow-lg dark:shadow-gray-800"
                    >
                        <CgArrowsExpandRight
                            size="1.5rem"
                            className="text-black dark:text-white"
                        />
                    </button>
                    <button
                        onClick={() => toggleIsRunAuto()}
                        className="flex justify-center items-center w-[60px] h-[60px] rounded-full bg-white dark:bg-darkPrimary shadow-lg dark:shadow-gray-800"
                    >
                        {isRunAuto ? (
                            <HiPause
                                size="1.6rem"
                                className="text-black dark:text-white"
                            />
                        ) : (
                            <HiMiniPlay
                                size="1.6rem"
                                className="text-black dark:text-white"
                            />
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
