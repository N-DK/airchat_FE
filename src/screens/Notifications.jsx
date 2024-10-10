import { useEffect, useState } from 'react';
import FooterChat from '../components/FooterChat';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { useDispatch } from 'react-redux';
import { POST_LIST_RESET } from '../redux/constants/PostConstants';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegUser } from 'react-icons/fa6';
import talkieLogo from '../assets/talkie-logo.png';

export default function Notifications() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const actions = [
        {
            id: 1,
            name: 'All',
            contents: 'No Activity',
            descriptions:
                'Join some conversations to start receiving activity.',
        },
        {
            id: 2,
            name: 'Mentions',
            contents: 'No Mentions',
            descriptions: 'Mentions and replies will show up here.',
        },
        {
            id: 3,
            name: 'Following',
            contents: 'No Activity',
            descriptions:
                'Activity from users that you follow will show up here.',
        },
    ];
    const [showActions, setShowActions] = useState(1);

    useEffect(() => {
        dispatch({ type: POST_LIST_RESET });
    }, []);

    return (
        <div>
            <div className=" flex flex-col fixed z-10 w-full bg-white dark:bg-darkPrimary">
                <div className="relative my-4 pt-12 px-6">
                    <div className="relative">
                        <button
                            onClick={() => navigate('/profile')}
                            className="absolute top-1/2 -translate-y-1/2 left-0 dark:text-white"
                        >
                            <FaRegUser className="text-xl md:text-2xl" />
                        </button>
                        <figure className="w-9 mx-auto">
                            <img
                                src={talkieLogo}
                                className="w-full"
                                alt="Talkie Logo"
                            />
                        </figure>
                    </div>
                </div>
                <div className="flex justify-center relative px-6 bg-white dark:bg-darkPrimary">
                    {actions.map((item, i) => (
                        <button
                            onClick={() => setShowActions(i + 1)}
                            key={i}
                            className={`min-w-14 border-b-[3px] mx-4 ${
                                showActions == i + 1
                                    ? 'border-bluePrimary'
                                    : 'border-white dark:border-darkPrimary'
                            } pb-[7px]`}
                        >
                            <span
                                className={`font-medium ${
                                    i + 1 == showActions
                                        ? 'text-black dark:text-white'
                                        : 'text-gray-400'
                                }`}
                            >
                                {item.name}
                            </span>
                        </button>
                    ))}
                    {/* <button>
          <HiOutlineDotsHorizontal
            size="1.8rem"
            className="text-black dark:text-gray-300 absolute right-0 top-50 translate-y-[-50%]"
          />
        </button> */}
                </div>
            </div>
            <div className="relative flex flex-col justify-between h-screen bg-slatePrimary dark:bg-dark2Primary">
                <div className="absolute w-full left-0 top-44 flex justify-center">
                    {actions.map(
                        (item, i) =>
                            showActions == i + 1 && (
                                <div
                                    key={i}
                                    className="text-black dark:text-gray-300 flex flex-col items-center px-2"
                                >
                                    <h5>{item.contents}</h5>
                                    <span className="text-[15px] text-center">
                                        {item.descriptions}
                                    </span>
                                </div>
                            ),
                    )}
                </div>
            </div>

            <FooterChat
                title="notifications"
                isSwiping={false}
                isPlay={false}
            />
        </div>
    );
}
