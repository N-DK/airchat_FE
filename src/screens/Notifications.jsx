import { useCallback, useEffect, useRef, useState } from 'react';
import FooterChat from '../components/FooterChat';
import { useDispatch, useSelector } from 'react-redux';
import { POST_LIST_RESET } from '../redux/constants/PostConstants';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegUser, FaUser } from 'react-icons/fa6';
import talkieLogo from '../assets/talkie-logo.png';
import { Avatar } from 'antd';
import moment from 'moment/moment';
import { getListNotification } from '../redux/actions/UserActions';
import LoaderSkeletonNotificationItem from '../components/LoaderSkeletonNotificationItem';
import { USER_LIST_NOTIFICATION_RESET } from '../redux/constants/UserConstants';

const NotificationItem = ({ item }) => {
    const navigate = useNavigate();
    const handleNavigate = () => {
        if (item?.post_id === 0) {
            navigate(`/profile/${item?.stranger_id}/posts`);
        } else {
            navigate(`/posts/details/${item?.post_id}`);
        }
    };
    const { language } = useSelector((state) => state.userLanguage);

    return (
        <div
            onClick={handleNavigate}
            className="p-3 px-4 border-b border-gray-200 w-full dark:border-darkPrimary appear-animation duration-200"
        >
            <div className="flex items-start">
                <i className="mr-4 mt-1 dark:text-white">
                    <FaUser size={20} />
                </i>
                <div>
                    <figure className="mb-1">
                        <Avatar
                            src={`https://talkie.transtechvietnam.com/${item?.stranger_avartar}`}
                            alt=""
                        />
                    </figure>
                    <p className="dark:text-white">
                        {item?.name}{' '}
                        {
                            item?.[
                                language.split('-')[0] === 'vi'
                                    ? 'content_vi'
                                    : 'content'
                            ]
                        }
                        <span className="text-gray-500 ml-2 dark:text-gray-400">
                            {moment
                                .unix(item?.created_at)
                                .locale(language.split('-')[0])
                                .fromNow(true)}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

const actions = [
    {
        id: 1,
        'name-en-US': 'All',
        'name-vi-VN': 'Tất cả',
        'contents-en-US': 'No Activity',
        'contents-vi-VN': 'Không hoạt động',
        'descriptions-en-US':
            'Join some conversations to start receiving activity.',
        'descriptions-vi-VN':
            'Tham gia vào một số cuộc trò chuyện để bắt đầu nhận được hoạt động.',
    },
    {
        id: 2,
        'name-en-US': 'Mentions',
        'name-vi-VN': 'Nhắc đến',
        'contents-en-US': 'No Mentions',
        'contents-vi-VN': 'Không nhắc đến',
        'descriptions-en-US': 'Mentions and replies will show up here.',
        'descriptions-vi-VN': 'Nhắc đến và trả lời sẽ hiển thị ở đây.',
        key: 'mentions',
    },
    {
        id: 3,
        'name-en-US': 'Following',
        'name-vi-VN': 'Theo dõi',
        'contents-en-US': 'No Activity',
        'contents-vi-VN': 'Không hoạt động',
        'descriptions-en-US':
            'Activity from users that you follow will show up here.',
        'descriptions-vi-VN':
            'Hoạt động từ người dùng mà bạn theo dõi sẽ hiển thị ở đây.',
        key: 'follow',
    },
];

const LIMIT = 10;
const OFFSET = 0;

export default function Notifications() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [wait, setWait] = useState(true);
    const [showActions, setShowActions] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [tabsOffset, setTabsOffset] = useState({
        1: OFFSET,
        2: OFFSET,
        3: OFFSET,
    });
    const [tabsData, setTabsData] = useState({
        1: null,
        2: null,
        3: null,
    });
    const [tabsIsEnd, setTabsIsEnd] = useState({
        1: false,
        2: false,
        3: false,
    });
    const [tabsIsBottom, setTabsIsBottom] = useState({
        1: false,
        2: false,
        3: false,
    });
    const { language } = useSelector((state) => state.userLanguage);
    const { notification, key, loading } = useSelector(
        (state) => state.listNotification,
    );
    const containerRef = useRef(null);

    const handleScroll = useCallback(() => {
        const contents = containerRef?.current;
        if (!contents) return;

        const scrollTop =
            contents.scrollTop || contents.documentElement?.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight =
            contents.scrollHeight || contents.documentElement?.scrollHeight;

        if (scrollTop + windowHeight >= documentHeight - 300) {
            setTabsIsBottom((prev) => ({
                ...prev,
                [showActions]: true,
            }));
        } else {
            setTabsIsBottom((prev) => ({
                ...prev,
                [showActions]: false,
            }));
        }
    }, [containerRef, showActions]);

    useEffect(() => {
        dispatch({ type: POST_LIST_RESET });
    }, []);

    useEffect(() => {
        if (!tabsData[showActions]) {
            const offset = tabsOffset[showActions];
            dispatch(
                getListNotification(
                    actions[showActions - 1].key,
                    LIMIT,
                    offset,
                ),
            );
        }
    }, [showActions]);

    useEffect(() => {
        const offset = tabsOffset[showActions];
        if (offset !== 0 && hasMore && tabsData[showActions].length >= LIMIT) {
            dispatch(
                getListNotification(
                    actions[showActions - 1].key,
                    LIMIT,
                    offset,
                ),
            );
        }
    }, [tabsOffset[showActions], hasMore]);

    useEffect(() => {
        const contents = containerRef?.current;
        if (loading || !contents) return;

        contents.addEventListener('scroll', handleScroll);

        return () => {
            contents.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll, containerRef, loading]);

    useEffect(() => {
        if (!containerRef.current) return;
        containerRef.current?.scrollTo({ top: 0 });
        setHasMore(false);
    }, [showActions, containerRef]);

    useEffect(() => {
        if (tabsIsBottom[showActions] && !tabsIsEnd[showActions]) {
            setTabsOffset((prev) => ({
                ...prev,
                [showActions]: prev[showActions] + LIMIT,
            }));
            setHasMore(true);
        } else {
            setHasMore(false);
        }
    }, [tabsIsBottom, showActions, tabsIsEnd]);

    useEffect(() => {
        if (notification) {
            setWait(true);
            const newTabsData = { ...tabsData };
            if (hasMore) {
                newTabsData[showActions] = [
                    ...newTabsData[showActions],
                    ...notification,
                ];
            } else {
                newTabsData[showActions] = notification;
            }
            setTabsData(newTabsData);
            setWait(false);
            dispatch({ type: USER_LIST_NOTIFICATION_RESET });
        }
    }, [notification, tabsData, hasMore]);

    useEffect(() => {
        if (notification?.length === 0 && tabsData[showActions]) {
            setTabsIsEnd((prev) => ({
                ...prev,
                [showActions]: true,
            }));
        }
    }, [notification, tabsData, showActions]);

    return (
        <div className="overflow-hidden">
            <div className=" flex flex-col  fixed z-10 w-full bg-white dark:bg-darkPrimary">
                <div className="relative mb-8 pt-12 px-6">
                    <div className="relative">
                        <button
                            onClick={() => navigate('/profile/posts')}
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
                            disabled={wait || loading}
                            onClick={() => setShowActions(i + 1)}
                            key={i}
                            className={`min-w-14 border-b-[3px] mx-4 ${
                                showActions === i + 1
                                    ? 'border-bluePrimary'
                                    : 'border-white dark:border-darkPrimary'
                            } pb-[7px]`}
                        >
                            <span
                                className={`font-medium ${
                                    i + 1 === showActions
                                        ? 'text-black dark:text-white'
                                        : 'text-gray-400'
                                }`}
                            >
                                {item['name-' + language]}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
            <div
                ref={containerRef}
                className="relative flex flex-col justify-between h-screen overflow-auto scrollbar-none"
            >
                <div className="absolute w-full left-0 top-[150px] pb-[200px] min-h-full overflow-hidden flex justify-center dark:bg-dark2Primary bg-slatePrimary">
                    <div className="w-full">
                        <div className="w-full">
                            {tabsData[showActions]?.length === 0 &&
                            !wait &&
                            !loading ? (
                                <div className="text-black dark:text-gray-300 flex flex-col items-center px-2 pt-3">
                                    <h5>
                                        {
                                            actions[showActions - 1][
                                                'contents-' + language
                                            ]
                                        }
                                    </h5>
                                    <span className="text-[15px] text-center">
                                        {
                                            actions[showActions - 1][
                                                'descriptions-' + language
                                            ]
                                        }
                                    </span>
                                </div>
                            ) : (
                                <>
                                    {tabsData[showActions]?.map((item, i) => (
                                        <NotificationItem key={i} item={item} />
                                    ))}
                                    {(loading || wait) && (
                                        <LoaderSkeletonNotificationItem />
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
        </div>
    );
}
