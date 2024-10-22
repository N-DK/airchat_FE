import React, { useContext, useEffect, useState } from 'react';
import { FaAngleLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import { AppContext } from '../AppContext';
import { useDispatch, useSelector } from 'react-redux';
import '../App.css';
import { changePassword } from '../redux/actions/UserActions';
import { LANGUAGE } from '../constants/language.constant';

const Notify = ({ message, show }) => (
    <div
        className={`bg-white absolute top-0 left-1/2 transform -translate-x-1/2 w-auto z-50 dark:bg-dark2Primary shadow-2xl rounded-2xl p-3 md:p-5 transition-all duration-500 ${
            show ? 'translate-y-0 mt-3' : '-translate-y-[120%]'
        }`}
    >
        <h6 className="text-black dark:text-white">{message}</h6>
    </div>
);

const InputPassword = ({ label, value, setValue }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col mt-5 ">
            <label className="text-black dark:text-white font-semibold">
                {label}
            </label>
            <div className="relative mt-2">
                <input
                    type={showPassword ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full h-12 px-4  rounded-lg dark:bg-darkPrimary bg-grayPrimary dark:text-white outline-none"
                    autoComplete="new-password"
                    style={{
                        WebkitTextSecurity: showPassword ? 'none' : 'disc', // Ẩn mật khẩu
                    }}
                />
                <div
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    onClick={togglePasswordVisibility}
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
            </div>
        </div>
    );
};

const DrawerChangePassword = () => {
    const { showDrawerChangePassword, toggleShowDrawerChangePassword } =
        useContext(AppContext);
    const dispatch = useDispatch();
    const { isSuccess, error: errorChangePassword } = useSelector(
        (state) => state.userChangePassword,
    );
    const { language } = useSelector((state) => state.userLanguage);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isContinue, setIsContinue] = useState(false);
    const [error, setError] = useState('');
    const [showNotify, setShowNotify] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState('');

    const handleChangePassword = () => {
        if (isContinue) {
            dispatch(
                changePassword({
                    old_pass: oldPassword,
                    new_pass: newPassword,
                    logout_all: 1,
                }),
            );
        }
    };

    useEffect(() => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setIsContinue(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Password does not match');
            setIsContinue(false);
        } else if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            setIsContinue(false);
        } else {
            setError('');
            setIsContinue(true);
        }
    }, [oldPassword, newPassword, confirmPassword]);

    useEffect(() => {
        if (errorChangePassword) {
            setError(errorChangePassword);
        }
    }, [errorChangePassword]);

    useEffect(() => {
        if (isSuccess) {
            setShowNotify(true);
            setNotifyMessage('Change password successfully');
            setTimeout(() => setShowNotify(false), 1200);
        }
    }, [isSuccess]);

    return (
        <div>
            <div>
                <div
                    className={`absolute left-0 top-0 z-50 w-full h-screen transition-all duration-300 ${
                        showDrawerChangePassword
                            ? 'translate-x-0'
                            : 'translate-x-full'
                    }`}
                >
                    <div className="bg-white dark:bg-dark2Primary h-full relative">
                        <div className="relative px-5 md:px-10 flex justify-center items-center pt-12 pb-4 md:py-5 text-lg md:text-[19px] border-b-[1px] border-gray-300 dark:border-grayPrimary">
                            <button
                                className="text-black dark:text-white absolute left-4"
                                onClick={toggleShowDrawerChangePassword}
                            >
                                <FaAngleLeft className="text-lg md:text-[22px]" />
                            </button>
                            <div className="text-black dark:text-white font-semibold">
                                {LANGUAGE[language].CHANGE_PASSWORD}
                            </div>
                        </div>
                        <div className="mx-5 mt-6">
                            <InputPassword
                                label={LANGUAGE[language].OLD_PASSWORD}
                                value={oldPassword}
                                setValue={setOldPassword}
                            />
                            <InputPassword
                                label={LANGUAGE[language].NEW_PASSWORD}
                                value={newPassword}
                                setValue={setNewPassword}
                            />
                            <InputPassword
                                label={LANGUAGE[language].CONFIRM_PASSWORD}
                                value={confirmPassword}
                                setValue={setConfirmPassword}
                            />
                        </div>
                        <div className="mt-3 mx-5">
                            <span className="text-red-500">{error}</span>
                        </div>
                        <button
                            disabled={!isContinue}
                            onClick={handleChangePassword}
                            className={`absolute  bottom-10 w-[90%] left-1/2 -translate-x-1/2 h-12 bg-blue-500 rounded-lg ${
                                isContinue
                                    ? 'dark:text-white'
                                    : 'text-stone-400 dark:text-gray-400 bg-grayPrimary dark:bg-gray-500'
                            }`}
                        >
                            {LANGUAGE[language].CHANGE_PASSWORD}
                        </button>
                    </div>
                </div>
                <Notify message={notifyMessage} show={showNotify} />
            </div>
        </div>
    );
};

export default DrawerChangePassword;
