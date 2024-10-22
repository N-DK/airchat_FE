import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Avatar } from 'antd';
import { IoIosAdd } from 'react-icons/io';
import { FaChevronDown, FaRegUser } from 'react-icons/fa6';
import talkieLogo from '../assets/talkie-logo.png';
import { AppContext } from '../AppContext';
import LoaderSkeletonMenuBar from './LoaderSkeletonMenuBar';
import { DEFAULT_PROFILE } from '../constants/image.constant';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

const HeaderChat = ({ title, isSwiping, handleAction }) => {
    const { menus, loading } = useSelector((state) => state.menuBar);
    const redirect =
        useLocation().search.split('=')[1] || window.location.pathname;
    const navigate = useNavigate();
    const { toggleIsAddChannel } = useContext(AppContext);
    // const { channel } = useSelector((state) => state.channelPin);

    useEffect(() => {
        const channelId = redirect.includes('group-channel')
            ? redirect.split('/')[1]
            : null;
        if (!menus?.some((menu) => menu.channel_id == channelId)) {
            navigate(`/chatting`);
        }
    }, [menus]);

    const Dropdown = ({ item, i }) => {
        const btnRef = useRef();
        const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

        const getPaths = (item) => {
            const currentPath =
                window.location.pathname + window.location.search;
            const targetPath = `/chatting/?redirect=${item.key}${
                item.key.includes('group-channel') ? `/${item.channel_id}` : ''
            }`;
            return { currentPath, targetPath };
        };

        const handleNavigation = () => {
            const { currentPath, targetPath } = getPaths(item);

            if (currentPath !== targetPath) {
                navigate(targetPath);
                btnRef.current = null;
            } else if (item.key === 'group-channel') {
                navigate(`/channel/${item.channel_id}`, {
                    state: { channelData: item },
                });
            }
        };

        const handleDropdown = (e) => {
            e.stopPropagation();
            const { currentPath, targetPath } = getPaths(item);

            if (currentPath !== targetPath) {
                navigate(targetPath);
                btnRef.current = null;
            }

            if (btnRef?.current) {
                const rect = btnRef?.current?.getBoundingClientRect();
                setMenuPosition({
                    top: rect?.bottom + 10,
                    left: rect?.left + rect?.width / 2 - 75,
                    width: 150,
                });
            }
        };

        return (
            <div
                ref={btnRef}
                onClick={() => {
                    handleNavigation();
                }}
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
                    {item.key === 'group-channel' && (
                        <Menu
                            as="div"
                            className="relative inline-block text-left z-[9999px]"
                        >
                            <MenuButton
                                onClick={handleDropdown}
                                className="relative"
                            >
                                <FaChevronDown className="dark:text-white" />
                            </MenuButton>

                            {item.key === 'group-channel' && (
                                <MenuItems
                                    transition
                                    className="z-[9999px] fixed bg-white border border-gray-300 divide-y dark:border-none divide-gray-200 rounded-md shadow-lg dark:bg-dark2Primary"
                                    style={{
                                        width: `${menuPosition.width}px`,
                                        position: 'fixed',
                                        top: `${menuPosition.top}px`,
                                        left: `${menuPosition.left}px`,
                                    }}
                                >
                                    <div className="py-1 z-[9999px]">
                                        <MenuItem>
                                            <button
                                                className="flex justify-between items-center w-full px-4 py-2 text-sm dark:text-white"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAction(
                                                        'trending',
                                                        item.channel_id,
                                                    );
                                                }}
                                            >
                                                Trending
                                            </button>
                                        </MenuItem>
                                        <MenuItem>
                                            <button
                                                className="flex justify-between items-center w-full px-4 py-2 text-sm dark:text-white"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAction(
                                                        'recent',
                                                        item.channel_id,
                                                    );
                                                }}
                                            >
                                                Recent
                                            </button>
                                        </MenuItem>
                                    </div>
                                </MenuItems>
                            )}
                        </Menu>
                    )}
                </div>
            </div>
        );
    };

    const renderMenuItems = () => {
        if (loading) return <LoaderSkeletonMenuBar />;

        return menus?.map((item, i) => <Dropdown key={i} item={item} i={i} />);
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
                {/* <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://webrtc.github.io/samples/"
                >
                    
                </a> */}
                <div>
                    <img src={talkieLogo} className="w-9" alt="Talkie Logo" />
                </div>
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
