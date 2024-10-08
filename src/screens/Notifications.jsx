import { useEffect, useState } from 'react';
import FooterChat from '../components/FooterChat';
import { useDispatch, useSelector } from 'react-redux';
import { POST_LIST_RESET } from '../redux/constants/PostConstants';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegUser, FaUser } from 'react-icons/fa6';
import talkieLogo from '../assets/talkie-logo.png';
import { Avatar } from 'antd';
import moment from 'moment';
import { FaUserAlt } from 'react-icons/fa';
import { getListNotification } from '../redux/actions/UserActions';

const NotificationItem = ({ item }) => {
    return (
        <div className="p-3 px-4 border-b border-gray-200 w-full">
            <div className="flex items-start">
                <i className="mr-4 mt-1">
                    <FaUser size={20} />
                </i>
                <div>
                    <figure className="mb-1">
                        <Avatar
                            src={`https://talkie.transtechvietnam.com/${item?.image}`}
                            alt=""
                        />
                    </figure>
                    <p className="dark:text-white">
                        {item?.name} {item?.content}
                        <span className="text-gray-500 dark:text-gray-400">
                            {moment.unix(item?.created_at).fromNow(true)}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default function Notifications() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { notification, key } = useSelector(
        (state) => state.listNotification,
    );
    const [listMentions, setListMentions] = useState([]);
    const [listFollowing, setListFollowing] = useState([]);

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
            key: 'mentions',
        },
        {
            id: 3,
            name: 'Following',
            contents: 'No Activity',
            descriptions:
                'Activity from users that you follow will show up here.',
            key: 'follow',
        },
    ];
    const [showActions, setShowActions] = useState(1);

    useEffect(() => {
        dispatch({ type: POST_LIST_RESET });
        dispatch(getListNotification('mentions'));
        dispatch(getListNotification('follow'));
    }, []);

    useEffect(() => {
        if (notification && key === 'mentions') {
            setListMentions(notification);
        } else if (notification && key === 'follow') {
            setListFollowing(notification);
        }
    }, [notification, key]);

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
                <div className="flex justify-start relative bg-white dark:bg-darkPrimary">
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
                </div>
            </div>
            <div className="relative flex flex-col justify-between h-screen  dark:bg-dark2Primary">
                <div className="absolute w-full left-0 top-[150px] min-h-full flex justify-center bg-slatePrimary">
                    <div className="w-full">
                        {listMentions.length === 0 &&
                        listFollowing.length === 0 &&
                        showActions === 1 ? (
                            <div className="text-black dark:text-gray-300 flex flex-col items-center px-2 pt-3">
                                <h5>{actions[0].contents}</h5>
                                <span className="text-[15px] text-center">
                                    {actions[0].descriptions}
                                </span>
                            </div>
                        ) : (
                            <>
                                {(showActions === 2 || showActions === 1) && (
                                    <div className="w-full">
                                        {listMentions.length === 0 ? (
                                            <div className="text-black dark:text-gray-300 flex flex-col items-center px-2 pt-3">
                                                <h5>
                                                    {
                                                        actions[showActions - 1]
                                                            .contents
                                                    }
                                                </h5>
                                                <span className="text-[15px] text-center">
                                                    {
                                                        actions[showActions - 1]
                                                            .descriptions
                                                    }
                                                </span>
                                            </div>
                                        ) : (
                                            listMentions.map((item, i) => (
                                                <NotificationItem
                                                    key={i}
                                                    item={item}
                                                />
                                            ))
                                        )}
                                    </div>
                                )}

                                {(showActions === 3 || showActions === 1) && (
                                    <div className="w-full">
                                        {listFollowing.length === 0 ? (
                                            <div className="text-black dark:text-gray-300 flex flex-col items-center px-2 pt-3">
                                                <h5>
                                                    {
                                                        actions[showActions - 1]
                                                            .contents
                                                    }
                                                </h5>
                                                <span className="text-[15px] text-center">
                                                    {
                                                        actions[showActions - 1]
                                                            .descriptions
                                                    }
                                                </span>
                                            </div>
                                        ) : (
                                            listFollowing.map((item, i) => (
                                                <NotificationItem
                                                    key={i}
                                                    item={item}
                                                />
                                            ))
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
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
