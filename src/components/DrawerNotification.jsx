import React, { useContext, useEffect, useState } from 'react';
import { FaAngleLeft } from 'react-icons/fa';
import { AppContext } from '../AppContext';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getNotification,
    settingNotification,
} from '../redux/actions/UserActions';
import '../App.css';
import { HiOutlineChevronUpDown } from 'react-icons/hi2';
import { LANGUAGE } from '../constants/language.constant';

const settings = [
    {
        'name-en-US': 'Replies',
        'name-vi-VN': 'Trả lời',
        key: 'replies',
    },
    {
        'name-en-US': 'Mentions',
        'name-vi-VN': 'Nhắc đến',
        key: 'mentions',
    },
    {
        'name-en-US': 'Likes',
        'name-vi-VN': 'Thích',
        key: 'likes',
    },
    {
        'name-en-US': 'Reposts',
        'name-vi-VN': 'Chia sẻ',
        key: 'reposts',
        isBorder: false,
    },
];

const settingsNotification = {
    'en-US': ['None', 'Following', 'All'],
    'vi-VN': ['Không', 'Theo dõi', 'Tất cả'],
};

const ItemNotification = ({ item, handle, indexActive }) => {
    const { language } = useSelector((state) => state.userLanguage);
    const [activeText, setActiveText] = useState(
        settingsNotification[language][indexActive],
    );
    const dispatch = useDispatch();
    useEffect(() => {
        setActiveText(settingsNotification[language][indexActive]);
    }, [indexActive]);

    return (
        <div
            className={`flex items-center justify-between py-4 mx-6 ${
                item.isBorder || item.isBorder === undefined
                    ? 'border-b dark:border-grayPrimary'
                    : ''
            } dark:text-white`}
        >
            <p>{item['name-' + language]}</p>
            <Menu
                as="div"
                className="relative inline-block text-left z-[999px]"
            >
                <MenuButton className="relative flex items-center text-gray-500 dark:text-gray-400">
                    {activeText}
                    <HiOutlineChevronUpDown className="text-xl md:text-[30px]" />
                </MenuButton>

                <MenuItems
                    transition
                    className="z-[999] absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-300 divide-y divide-gray-200 rounded-md shadow-lg outline-none dark:bg-dark2Primary dark:border-none"
                >
                    <div className="py-1">
                        {settingsNotification[language].map((not, index) => (
                            <MenuItem key={index}>
                                <p
                                    onClick={() => {
                                        dispatch(
                                            settingNotification({
                                                [item.key]: index,
                                            }),
                                        );
                                        setActiveText(
                                            settingsNotification[language][
                                                index
                                            ],
                                        );
                                    }}
                                    className="p-2 px-4"
                                >
                                    {not}
                                </p>
                            </MenuItem>
                        ))}
                    </div>
                </MenuItems>
            </Menu>
        </div>
    );
};

const DrawerNotification = () => {
    const { showDrawerNotification, toggleShowDrawerNotification } =
        useContext(AppContext);
    const dispatch = useDispatch();
    const { notification } = useSelector((state) => state.userGetNotification);
    const { language } = useSelector((state) => state.userLanguage);

    useEffect(() => {
        dispatch(getNotification());
    }, []);

    return (
        <>
            <div
                className={`absolute left-0 top-0 z-50 w-full h-screen transition-all duration-300 ${
                    showDrawerNotification
                        ? 'translate-x-0'
                        : 'translate-x-full'
                }`}
            >
                <div className="bg-white dark:bg-dark2Primary h-full">
                    <div className="relative px-5 md:px-10 flex justify-center items-center pt-12 pb-4 md:py-5 text-lg md:text-[19px] border-b-[1px] border-gray-300 dark:border-grayPrimary">
                        <button
                            className="text-black dark:text-white absolute left-4"
                            onClick={toggleShowDrawerNotification}
                        >
                            <FaAngleLeft className="text-lg md:text-[22px]" />
                        </button>
                        <div className="text-black dark:text-white font-semibold">
                            {LANGUAGE[language].NOTIFICATION_SETTING}
                        </div>
                    </div>
                    <div className="mx-5 rounded-2xl mt-6 dark:bg-darkPrimary">
                        {settings?.map((setting) => (
                            <ItemNotification
                                key={setting['name-en-US']}
                                item={setting}
                                indexActive={notification?.[setting.key]}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DrawerNotification;
