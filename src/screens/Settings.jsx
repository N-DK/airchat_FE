import FooterChat from '../components/FooterChat';
import { FaAngleLeft, FaMoon } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { BsChevronExpand, BsFillSunFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteAccount,
    languageUser,
    logout,
    profile,
    themeDarkUser,
    themeResetUser,
} from '../redux/actions/UserActions';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../AppContext';
import DrawerBlockAccount from '../components/DrawerBlockAccount';
import ModalDelete from '../components/ModalDelete';
import CustomContextMenu from '../components/CustomContextMenu';
import DrawerNotification from '../components/DrawerNotification';
import { LANGUAGE } from '../constants/language.constant';
import vietNamFlag from '../assets/vietnam.png';
import usaFlag from '../assets/united-states.png';
import { Avatar } from 'antd';

export default function Settings() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        showDrawerBlockAccount,
        showDrawerNotification,
        toggleShowDrawerBlockAccount,
        toggleShowDrawerNotification,
    } = useContext(AppContext);
    const { theme } = useSelector((state) => state.userTheme);
    const [isOpen, setIsOpen] = useState(false);
    const { userInfo } = useSelector((state) => state.userProfile);
    const { isSuccess: isDeleteAccountSuccess } = useSelector(
        (state) => state.userDeleteAccount,
    );
    const { language } = useSelector((state) => state.userLanguage);
    const [typeDrawer, setTypeDrawer] = useState(null);

    useEffect(() => {
        if (isDeleteAccountSuccess) {
            const notificationPolicy = localStorage.getItem(
                'notification_policy',
            );

            localStorage.clear();

            if (notificationPolicy) {
                localStorage.setItem('notification_policy', notificationPolicy);
            }

            window.location.href = '/';
        }
    }, [isDeleteAccountSuccess]);

    useEffect(() => {
        if (showDrawerBlockAccount) toggleShowDrawerBlockAccount();
        if (showDrawerNotification) toggleShowDrawerNotification();
    }, [window.location.pathname]);

    useEffect(() => {
        if (!userInfo) dispatch(profile());
    }, [dispatch]);

    const logoutHandle = () => dispatch(logout());

    const handleDeleteAccount = () => {
        dispatch(
            deleteAccount(
                userInfo?.email
                    ? { email: userInfo?.email }
                    : { phoneNumber: userInfo?.phone },
            ),
        );
    };

    return (
        <>
            <div className="relative flex flex-col justify-between h-screen overflow-hidden bg-slatePrimary dark:bg-darkPrimary">
                <div className="px-6 md:px-10 grid grid-cols-3 pt-12 pb-6 md:pb-9">
                    <button onClick={() => navigate(-1)} className="col-span-1">
                        <FaAngleLeft className="text-lg md:text-[22px] text-black dark:text-white" />
                    </button>
                    <div className="col-span-1">
                        <h5 className="text-center md:text-2xl text-black dark:text-white">
                            {LANGUAGE[language].SETTINGS}
                        </h5>
                    </div>
                </div>
                <DrawerBlockAccount type={typeDrawer} />
                <DrawerNotification />
                <div className="h-full overflow-auto scrollbar-none px-6 md:px-10 pt-1 pb-10 flex gap-7 flex-col text-[16px]">
                    <div className="text-black dark:text-white md:text-xl bg-[#FAF8F9] dark:bg-dark2Primary rounded-xl px-3 md:px-5 py-2 md:py-4">
                        <div className="flex justify-between items-center border-b-[1px] border-gray-200 pb-4">
                            <p>{LANGUAGE[language].APPEARANCE}</p>
                            <div className="flex items-center opacity-40">
                                <span>{LANGUAGE[language].SYSTEM_DEFAULT}</span>
                                <BsChevronExpand size="1.2rem" />
                            </div>
                        </div>
                        <p
                            onClick={toggleShowDrawerNotification}
                            className="mt-3"
                        >
                            {LANGUAGE[language].NOTIFICATION_SETTING}
                        </p>
                    </div>
                    <div className="md:text-xl flex items-center justify-between bg-[#FAF8F9] dark:bg-dark2Primary rounded-xl px-3 md:px-5 py-2 md:py-4">
                        <p className="text-black dark:text-white">
                            {LANGUAGE[language].THEME_MODE}
                        </p>
                        {theme === 'dark' ? (
                            <button onClick={() => dispatch(themeResetUser())}>
                                <BsFillSunFill
                                    size="1.2rem"
                                    className="text-yellow-500"
                                />
                            </button>
                        ) : (
                            <button onClick={() => dispatch(themeDarkUser())}>
                                <FaMoon />
                            </button>
                        )}
                    </div>

                    <div className="md:text-xl flex items-center justify-between bg-[#FAF8F9] dark:bg-dark2Primary rounded-xl px-3 md:px-5 py-2 md:py-4">
                        <p className="text-black dark:text-white">
                            {LANGUAGE[language].LANGUAGE}
                        </p>
                        {language === 'vi-VN' ? (
                            <button
                                onClick={() => dispatch(languageUser('en-US'))}
                            >
                                <Avatar
                                    src={vietNamFlag}
                                    alt="vietnam"
                                    className="rounded-none"
                                />
                            </button>
                        ) : (
                            <button
                                onClick={() => dispatch(languageUser('vi-VN'))}
                            >
                                <Avatar
                                    src={usaFlag}
                                    alt="vietnam"
                                    className="rounded-none"
                                />
                            </button>
                        )}
                    </div>

                    <div className="text-black dark:text-white md:text-xl bg-[#FAF8F9] dark:bg-dark2Primary rounded-xl px-3 md:px-5 py-2 md:py-4">
                        <div
                            onClick={() => {
                                setTypeDrawer('block');
                                toggleShowDrawerBlockAccount();
                            }}
                            className="border-b-[1px] border-gray-200 pb-3"
                        >
                            <p>{LANGUAGE[language].BLOCKED_ACCOUNT}</p>
                        </div>
                        <p
                            onClick={() => {
                                setTypeDrawer('mute');
                                toggleShowDrawerBlockAccount();
                            }}
                            className="mt-3"
                        >
                            {LANGUAGE[language].MUTED_ACCOUNT}
                        </p>
                    </div>

                    <div
                        onClick={logoutHandle}
                        className="md:text-xl bg-[#FAF8F9] dark:bg-dark2Primary rounded-xl px-3 md:px-5 py-2 md:py-4"
                    >
                        <p className="text-red-500">
                            {LANGUAGE[language].LOG_OUT}
                        </p>
                    </div>

                    <div
                        onClick={() => setIsOpen(true)}
                        className="md:text-xl bg-[#FAF8F9] dark:bg-dark2Primary rounded-xl px-3 md:px-5 py-2 md:py-4"
                    >
                        <p className="text-red-500">
                            {LANGUAGE[language].DELETE_ACCOUNT}
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-black dark:text-white">
                        <p className="text-[15px]">4.1.0 (28,062)</p>
                        <div className="flex gap-1 text-sm opacity-60">
                            <span>{LANGUAGE[language].PRODUCTION}</span>
                            <span>-</span>
                            <span>{LANGUAGE[language].RELEASE}</span>
                        </div>
                    </div>
                </div>

                <FooterChat title="chatting" isSwiping={false} isPlay={false} />
            </div>
            <ModalDelete
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                handle={handleDeleteAccount}
                title="TITLE_DELETE_ACCOUNT"
                subTitle="SUBTITLE_DELETE_ACCOUNT"
            />
        </>
    );
}
