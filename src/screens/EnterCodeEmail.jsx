import { FaAngleLeft } from 'react-icons/fa6';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkUserCode } from './../redux/actions/UserActions';
import LoadingSpinner from '../components/LoadingSpinner';
import {
    CHECK_ACCOUNT_RESET,
    USER_LOGIN_SUCCESS,
} from '../redux/constants/UserConstants';
import React from 'react';

export default function EnterCodeEmail() {
    const inputRef = useRef(null);
    const [numberCode, setNumberCode] = useState('');
    const [isContinue, setIsContinue] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userEmail = useSelector((state) => state.userEmail);
    const { emailTemporary } = userEmail;
    const userCode = useSelector((state) => state.userCode);
    const { userInfo, loading, error } = userCode;

    const navigateLoginHandle = () => {
        dispatch({
            type: CHECK_ACCOUNT_RESET,
        });
        navigate('/login/email'); // /login/email
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.split('').length < 7) {
            setNumberCode(value);
        }
    };

    const verifyOTP = async () => {
        dispatch(checkUserCode(emailTemporary, numberCode));
    };

    useEffect(() => {
        if (userInfo?.results) {
            dispatch({ type: USER_LOGIN_SUCCESS, payload: userInfo });
            navigate('/aboutyou');
        }
    }, [userInfo]);

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    useEffect(() => {
        if (numberCode.split('').length === 6) {
            setIsContinue(true);
        } else {
            setIsContinue(false);
        }
    }, [numberCode]);

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
                        <h5 className="md:text-2xl">Welcome In</h5>
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
                    <div className="flex bg-grayPrimary dark:bg-dark2Primary justify-center items-center w-full md:w-2/3 lg:w-1/3 rounded-full px-8 py-4">
                        <input
                            className="text-black dark:text-white text-center bg-inherit w-4/5 border-none outline-none text-[17px] font-medium"
                            placeholder="Enter the 6 digit code"
                            ref={inputRef}
                            type="text"
                            value={numberCode}
                            onChange={handleInputChange}
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
                <h5 className="text-black dark:text-gray-200">Send Again</h5>
                <button
                    onClick={() => isContinue && verifyOTP()}
                    className={`mt-4 text-xl font-medium w-full md:w-2/3 lg:w-1/3 rounded-full py-4 ${
                        isContinue
                            ? 'text-white dark:text-darkPrimary bg-black dark:bg-white'
                            : 'text-stone-400 dark:text-gray-400 bg-grayPrimary dark:bg-dark2Primary'
                    }`}
                >
                    {loading ? <LoadingSpinner /> : <span>Continue</span>}
                </button>
            </div>
        </div>
    );
}
