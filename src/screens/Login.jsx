import { FaAngleLeft } from 'react-icons/fa6';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    CHECK_ACCOUNT_RESET,
    USER_LOGIN_ERROR_RESET,
} from '../redux/constants/UserConstants';
import { login } from '../redux/actions/UserActions';
import React from 'react';
import { LANGUAGE } from '../constants/language.constant';

export default function Login() {
    const inputRef = useRef(null);
    const [password, setPassword] = useState('');
    const [isContinue, setIsContinue] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userEmail = useSelector((state) => state.userEmail);
    const { emailTemporary } = userEmail;
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo, loading, error: errorLogin } = userLogin;
    const { language } = useSelector((state) => state.userLanguage);

    const navigateLoginHandle = () => {
        dispatch({
            type: CHECK_ACCOUNT_RESET,
        });
        navigate('/login/email');
    };

    const loginHandle = () => {
        dispatch(login(emailTemporary, password));
    };

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    useEffect(() => {
        if (errorLogin) {
            setError(errorLogin);
            dispatch({ type: USER_LOGIN_ERROR_RESET });
        }
    }, [errorLogin]);

    useEffect(() => {
        if (userInfo?.token) {
            navigate('/chatting');
        }
    }, [userInfo]);

    useEffect(() => {
        if (password.split('').length >= 1) {
            setIsContinue(true);
        } else {
            setIsContinue(false);
        }
    }, [password]);

    return (
        <div className="flex flex-col justify-between h-screen dark:bg-darkPrimary">
            <div className="px-6">
                <div className="flex relative mt-12 text-black dark:text-white">
                    <button
                        onClick={() => navigateLoginHandle()}
                        className="z-10 h-7 md:ml-6 md:h-10 w-7 md:w-10 flex items-center justify-center bg-grayPrimary dark:bg-dark2Primary rounded-full"
                    >
                        <FaAngleLeft className="md:text-xl" />
                    </button>
                    <div className="absolute w-full top-0 flex justify-center">
                        <h5 className="md:text-2xl">
                            {LANGUAGE[language].LOGIN}
                        </h5>
                    </div>
                </div>

                <div className="flex justify-center items-center mt-28 ">
                    <div className="w-full md:w-2/3 lg:w-1/3 flex gap-3 md:gap-12 bg-grayPrimary dark:bg-dark2Primary items-center rounded-full px-10 md:px-16 py-4">
                        <button className="flex items-center">
                            <span className="font-medium text-lg text-black dark:text-white">
                                Email:
                            </span>
                        </button>
                        <input
                            className=" text-black dark:text-white bg-inherit w-full border-none outline-none text-[17px] font-medium"
                            value={emailTemporary}
                            readOnly
                        />
                    </div>
                </div>

                <div className="flex justify-center mt-3">
                    <div className="w-full md:w-2/3 lg:w-1/3 flex gap-3 md:gap-12 bg-grayPrimary dark:bg-dark2Primary items-center rounded-full px-10 md:px-16 py-4">
                        <button className="flex items-center">
                            <span className="font-medium text-lg text-black dark:text-white">
                                Password:
                            </span>
                        </button>
                        <input
                            className=" text-black dark:text-white bg-inherit w-full border-none outline-none text-[17px] font-medium"
                            placeholder={LANGUAGE[language].ENTER_YOUR_PASSWORD}
                            ref={inputRef}
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                {error && (
                    <div className="flex justify-center items-center mt-4">
                        <span className="text-lg font-medium text-red-500">
                            {error}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex flex-col items-center px-6 mb-9">
                <button
                    onClick={() => isContinue && loginHandle()}
                    className={`mt-4 text-xl font-medium w-full md:w-2/3 lg:w-1/3 rounded-full py-4 ${
                        isContinue
                            ? 'text-white dark:text-darkPrimary bg-black dark:bg-white'
                            : 'text-stone-400 dark:text-gray-400 bg-grayPrimary dark:bg-dark2Primary'
                    }`}
                >
                    {loading ? (
                        <span>{LANGUAGE[language].LOADING}</span>
                    ) : (
                        <span>{LANGUAGE[language].CONTINUE}</span>
                    )}
                </button>
            </div>
        </div>
    );
}
