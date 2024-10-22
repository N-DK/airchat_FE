import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../redux/actions/UserActions';
import LoadingSpinner from '../components/LoadingSpinner';
import { USER_UPDATE_PROFILE_RESET } from '../redux/constants/UserConstants';
import React from 'react';
import { LANGUAGE } from '../constants/language.constant';

export default function AboutYou() {
    const inputRef = useRef(null);
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isContinue, setIsContinue] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
    const { loading, isSuccess } = userUpdateProfile;
    const [error, setError] = useState(null);
    const { language } = useSelector((state) => state.userLanguage);

    const navigateSelectAvatarHandle = () => {
        if (isContinue) {
            dispatch(
                updateUser({ name: fullName, username: userName, password }),
            );
        }
    };

    const checkInput = () => {
        if (fullName.trim() === '') {
            setFullName('');
        }
        if (userName.trim() === '') {
            setUserName('');
        }
        if (password.trim() === '') {
            setPassword('');
        }
    };

    const handleIsValidate = () => {
        // username không được chứa ký tự đặt biệt và 2 đến 20 ký tự
        // password phải có ít nhất 6 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 số
        // fullname chỉ được chứa ký tự chữ cái và khoảng trắng

        if (!userName.match(/^[a-zA-Z0-9]+$/)) {
            setError(LANGUAGE[language].USERNAME_ONLY);
            return false;
        }

        if (userName.length < 2 || userName.length > 20) {
            setError(LANGUAGE[language].USERNAME_MUST_BE);
            return false;
        }

        if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)) {
            setError(LANGUAGE[language].PASSWORD_MUST_BE);
            return false;
        }

        if (!fullName.match(/^[a-zA-Z\s]+$/)) {
            setError(LANGUAGE[language].FULL_NAME_ONLY);
            return false;
        }

        setError('');
        return true;
    };

    useEffect(() => {
        if (isSuccess) {
            dispatch({ type: USER_UPDATE_PROFILE_RESET });
            navigate('/selectavatar'); // chatting
        }
    }, [isSuccess]);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    useEffect(() => {
        if (
            fullName.trim() !== '' &&
            userName.trim() !== '' &&
            password.trim() !== ''
        ) {
            if (handleIsValidate()) {
                setIsContinue(true);
            } else {
                setIsContinue(false);
            }
        } else {
            setIsContinue(false);
        }
    }, [fullName, userName, password]);

    return (
        <div className="flex flex-col justify-between h-screen dark:bg-darkPrimary">
            <div className="px-6">
                <div className="flex justify-center mt-12">
                    <h5 className="md:text-2xl text-black dark:text-white">
                        {LANGUAGE[language].ABOUT_YOU}
                    </h5>
                </div>

                <div className="flex justify-center mt-20">
                    <div className="flex bg-grayPrimary dark:bg-dark2Primary justify-center items-center w-full md:w-2/3 lg:w-1/3 rounded-full px-8 py-4">
                        <input
                            className="text-black w-full dark:text-white text-center bg-inherit border-none outline-none text-[17px] font-medium"
                            placeholder={LANGUAGE[language].NAME}
                            ref={inputRef}
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            onBlur={() => checkInput()}
                        />
                    </div>
                </div>

                <div className="flex justify-center mt-3">
                    <div className="flex bg-grayPrimary dark:bg-dark2Primary justify-center items-center w-full md:w-2/3 lg:w-1/3 rounded-full px-8 py-4">
                        <input
                            className="text-black dark:text-white text-center bg-inherit w-full border-none outline-none text-[17px] font-medium"
                            placeholder={LANGUAGE[language].USERNAME}
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            onBlur={() => checkInput()}
                        />
                    </div>
                </div>

                <div className="flex justify-center mt-3">
                    <div className="flex bg-grayPrimary dark:bg-dark2Primary justify-center items-center w-full md:w-2/3 lg:w-1/3 rounded-full px-8 py-4">
                        <input
                            className="text-black dark:text-white text-center bg-inherit w-full border-none outline-none text-[17px] font-medium"
                            placeholder={LANGUAGE[language].PASSWORD}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onBlur={() => checkInput()}
                        />
                    </div>
                </div>

                {!fullName ? (
                    <div className="flex justify-center mt-3">
                        <span className="text-gray-400">
                            {LANGUAGE[language].ENTER_YOUR_FULL_NAME}
                        </span>
                    </div>
                ) : !userName ? (
                    <div className="flex justify-center mt-3">
                        <span className="text-gray-400">
                            {LANGUAGE[language].ENTER_YOUR_USERNAME}
                        </span>
                    </div>
                ) : !password ? (
                    <div className="flex justify-center mt-3">
                        <span className="text-gray-400">
                            {LANGUAGE[language].ENTER_YOUR_PASSWORD}
                        </span>
                    </div>
                ) : error ? (
                    <div className="flex justify-center mt-3">
                        <span className="text-red-500 text-center text-[14px]">
                            {error}
                        </span>
                    </div>
                ) : null}
            </div>

            <div className="flex flex-col items-center px-6 mb-9">
                <button
                    onClick={() => navigateSelectAvatarHandle()}
                    className={`mt-4 text-xl font-medium w-full md:w-2/3 lg:w-1/3 rounded-full py-4 ${
                        isContinue
                            ? 'text-white dark:text-darkPrimary bg-black dark:bg-white'
                            : 'text-stone-400 dark:text-gray-400 bg-grayPrimary dark:bg-dark2Primary'
                    }`}
                >
                    {loading ? (
                        <LoadingSpinner />
                    ) : (
                        <span>{LANGUAGE[language].CONTINUE}</span>
                    )}
                </button>
            </div>
        </div>
    );
}
