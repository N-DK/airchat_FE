import FooterChat from '../components/FooterChat';
import { FaAngleLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { BsChevronExpand } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import {
    logout,
    themeDarkUser,
    themeResetUser,
} from '../redux/actions/UserActions';
import { FaMoon } from 'react-icons/fa';
import { BsFillSunFill } from 'react-icons/bs';
import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import DrawerBlockAccount from '../components/DrawerBlockAccount';

export default function Settings() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { toggleShowDrawerBlockAccount } = useContext(AppContext);
    const userTheme = useSelector((state) => state.userTheme);
    const { theme } = userTheme;

    const logoutHandle = () => {
        dispatch(logout());
    };

    return (
        <div className="relative flex flex-col justify-between h-screen overflow-hidden bg-slatePrimary dark:bg-darkPrimary">
            <div className="px-6 md:px-10 grid grid-cols-3 pt-12 pb-6 md:pb-9">
                <button onClick={() => navigate(-1)} className="col-span-1">
                    <FaAngleLeft className="text-lg md:text-[22px] text-black dark:text-white" />
                </button>
                <div className="col-span-1">
                    <h5 className="text-center md:text-2xl text-black dark:text-white">
                        Settings
                    </h5>
                </div>
            </div>
            <DrawerBlockAccount />
            <div className="h-full overflow-auto scrollbar-none px-6 md:px-10 pt-1 pb-10 flex gap-7 flex-col text-[16px]">
                <div className="text-black dark:text-white md:text-xl bg-[#FAF8F9] dark:bg-dark2Primary rounded-xl px-3 md:px-5 py-2 md:py-4">
                    <div className="flex justify-between items-center border-b-[1px] border-gray-200 pb-4">
                        <p>Appearance</p>
                        <div className="flex items-center opacity-40">
                            <span>System Default</span>
                            <BsChevronExpand size="1.2rem" />
                        </div>
                    </div>
                    <p className="mt-3">Notification Settings</p>
                </div>
                <div className="md:text-xl flex items-center justify-between bg-[#FAF8F9] dark:bg-dark2Primary rounded-xl px-3 md:px-5 py-2 md:py-4">
                    <p className="text-black dark:text-white">Theme mode</p>
                    {theme && theme == 'dark' ? (
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

                <div className="text-black dark:text-white md:text-xl bg-[#FAF8F9] dark:bg-dark2Primary rounded-xl px-3 md:px-5 py-2 md:py-4">
                    <div
                        onClick={() => toggleShowDrawerBlockAccount()}
                        className="border-b-[1px] border-gray-200 pb-3"
                    >
                        <p>Blocked accounts</p>
                    </div>
                    <p className="mt-3">Muted accounts</p>
                </div>

                <div
                    onClick={() => logoutHandle()}
                    className="md:text-xl bg-[#FAF8F9] dark:bg-dark2Primary rounded-xl px-3 md:px-5 py-2 md:py-4"
                >
                    <p className="text-red-500">Log Out</p>
                </div>

                <div className="md:text-xl bg-[#FAF8F9] dark:bg-dark2Primary rounded-xl px-3 md:px-5 py-2 md:py-4">
                    <p className="text-red-500">Delete Account</p>
                </div>

                <div className="flex flex-col items-center text-black dark:text-white">
                    <p className="text-[15px]">4.1.0 (28,062)</p>
                    <div className="flex gap-1 text-sm opacity-60">
                        <span>production</span>
                        <span>-</span>
                        <span>Release</span>
                    </div>
                </div>
            </div>

            <FooterChat title="chatting" isSwiping={false} isPlay={false} />
        </div>
    );
}
