import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FaAngleLeft, FaBan, FaFlag, FaVolumeMute } from 'react-icons/fa';
import { AppContext } from '../AppContext';
import { Avatar, message } from 'antd';
import { Menu } from '@headlessui/react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import {
    block,
    listBlock,
    listMute,
    mute,
    reportAcc,
} from '../redux/actions/UserActions';
import LoadingSpinner from './LoadingSpinner';
import Message from './Message';
import '../App.css';

const BlocAccountItem = ({
    user,
    handleAction,
    isBlock,
    isMute,
    showMessage,
    handleReport,
}) => {
    const Dropdown = () => {
        return (
            <Menu
                as="div"
                className="relative inline-block text-left z-[9999px]"
            >
                <Menu.Button className="relative">
                    <HiOutlineDotsHorizontal className="text-xl md:text-[30px] text-black dark:text-white" />
                </Menu.Button>

                <Menu.Items className="z-[999px] absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-300 divide-y divide-gray-200 rounded-md shadow-lg outline-none dark:bg-dark2Primary">
                    <div className="py-1 z-[9999px]">
                        <Menu.Item>
                            <button
                                className="flex justify-between items-center w-full px-4 py-2 text-sm dark:text-white"
                                onClick={() => {
                                    showMessage('Muted');
                                    handleAction(
                                        mute,
                                        user?.blocked_id ?? user?.mute_id,
                                        `${
                                            isMute(
                                                user?.blocked_id ??
                                                    user?.mute_id,
                                            )
                                                ? 'unmute'
                                                : 'mute'
                                        }`,
                                    );
                                }}
                            >
                                <span>
                                    {isMute(user?.blocked_id ?? user?.mute_id)
                                        ? 'Unmute'
                                        : 'Mute'}
                                </span>
                                <FaVolumeMute size={16} />
                            </button>
                        </Menu.Item>
                        <Menu.Item>
                            <button
                                onClick={() => {
                                    showMessage('Blocked');
                                    handleAction(
                                        block,
                                        user?.blocked_id ?? user?.mute_id,
                                        `${
                                            isBlock(
                                                user?.blocked_id ??
                                                    user?.mute_id,
                                            )
                                                ? 'unblock'
                                                : 'block'
                                        }`,
                                    );
                                }}
                                className="flex justify-between items-center w-full px-4 py-2 text-sm dark:text-red-600"
                            >
                                <span>
                                    {isBlock(user?.blocked_id ?? user?.mute_id)
                                        ? 'Unblock'
                                        : 'Block'}
                                </span>
                                <FaBan size={16} />
                            </button>
                        </Menu.Item>
                        <Menu.Item>
                            <button
                                onClick={() => {
                                    showMessage('Reported');
                                    handleReport(
                                        user?.blocked_id ?? user?.mute_id,
                                    );
                                }}
                                className="flex justify-between items-center w-full px-4 py-2 text-sm dark:text-red-600"
                            >
                                <span>Report</span>
                                <FaFlag size={16} />
                            </button>
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Menu>
        );
    };

    return (
        <div className="px-4 py-3">
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                    <Avatar size={44} src={''} alt="" />
                    <div className="flex flex-col ml-3">
                        <div className="text-black dark:text-white font-semibold">
                            {user?.name}
                        </div>
                        <p className="dark:text-white">{user?.username}</p>
                    </div>
                </div>
                <Dropdown />
            </div>
        </div>
    );
};
const DrawerBlockAccount = ({ type }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const showMessage = (message) => {
        messageApi.open({
            type: 'success',
            content: message,
            duration: 1,
        });
    };

    const [userList, setUserList] = useState([]);

    const { showDrawerBlockAccount, toggleShowDrawerBlockAccount } =
        useContext(AppContext);
    const dispatch = useDispatch();
    const { block: userListBlock, loading } = useSelector(
        (state) => state.userListBlock,
    );
    const { mute: mutes } = useSelector((state) => state.userListMute);
    const { isSuccess: isSuccessBlock } = useSelector(
        (state) => state.userBlock,
    );
    const { isSuccess: isSuccessMute } = useSelector((state) => state.userMute);

    const isBlock = useCallback(
        (blocked_id) => {
            return userListBlock?.some(
                (item) => item.blocked_id === parseInt(blocked_id),
            );
        },
        [userListBlock],
    );

    const isMute = useCallback(
        (mute_id) => {
            return mutes?.some((item) => item.mute_id === parseInt(mute_id));
        },
        [mutes],
    );

    const handleAction = useCallback(
        (action, id, type) => {
            dispatch(action(id, type));
        },
        [dispatch],
    );

    const handleReport = useCallback(
        (id) => {
            dispatch(reportAcc(id));
        },
        [dispatch],
    );

    useEffect(() => {
        if (isSuccessBlock) dispatch(listBlock());
    }, [isSuccessBlock, dispatch]);

    useEffect(() => {
        if (isSuccessMute) dispatch(listMute());
    }, [isSuccessMute, dispatch]);

    useEffect(() => {
        if (type === 'block') {
            dispatch(listBlock());
        } else if (type === 'mute') {
            dispatch(listMute());
        }
    }, [type, dispatch]);

    useEffect(() => {
        if (type === 'block') {
            setUserList(userListBlock);
        } else if (type === 'mute') {
            setUserList(mutes);
        }
    }, [type, userListBlock, mutes]);

    return (
        <>
            {contextHolder}
            <div
                className={`absolute left-0 top-0 z-50 w-full h-screen transition-all duration-300 ${
                    showDrawerBlockAccount
                        ? 'translate-x-0'
                        : 'translate-x-full'
                }`}
            >
                <div className="bg-white dark:bg-dark2Primary h-full">
                    <div className="relative px-5 md:px-10 flex justify-center items-center py-3 md:py-5 text-lg md:text-[19px] border-b-[1px] border-gray-300">
                        <button
                            className="text-black dark:text-white absolute left-4"
                            onClick={toggleShowDrawerBlockAccount}
                        >
                            <FaAngleLeft className="text-lg md:text-[22px]" />
                        </button>
                        <div className="text-black dark:text-white font-semibold">
                            {type === 'block'
                                ? 'Blocked Accounts'
                                : 'Muted Accounts'}
                        </div>
                    </div>
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className="bg-slatePrimary dark:bg-dark2Primary h-full">
                            {userList?.length > 0 &&
                                userList.map((user, index) => (
                                    <BlocAccountItem
                                        key={index}
                                        user={user}
                                        handleAction={handleAction}
                                        isBlock={isBlock}
                                        isMute={isMute}
                                        showMessage={showMessage}
                                        handleReport={handleReport}
                                    />
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DrawerBlockAccount;
