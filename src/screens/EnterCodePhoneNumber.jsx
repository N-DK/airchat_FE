import { FaAngleLeft } from 'react-icons/fa6';
import iconVietnam from '../assets/vietnam-icon.webp';
import { LuDot } from 'react-icons/lu';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CHECK_NUMBER_PHONE_RESET } from '../redux/constants/UserConstants';
import { login } from '../redux/actions/UserActions';
import LoadingSpinner from '../components/LoadingSpinner';
import React from 'react';
import { LANGUAGE } from '../constants/language.constant';
export default function EnterCodePhoneNumber() {
    const inputRef = useRef(null);
    const [numberCode, setNumberCode] = useState('');
    const [isContinue, setIsContinue] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userNumberPhone = useSelector((state) => state.userNumberPhone);
    const { userPhone } = userNumberPhone;
    const userLogin = useSelector((state) => state.userLogin);
    const { loading, userInfo } = userLogin;
    const { language } = useSelector((state) => state.userLanguage);

    const navigateLoginHandle = () => {
        dispatch({ type: CHECK_NUMBER_PHONE_RESET });
        navigate('/login');
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.split('').length < 7) {
            setNumberCode(value);
        }
    };

    const verifyOTP = async () => {
        try {
            const result = await window.confirmationResult.confirm(numberCode);
            const user = result.user;
            const token = await user.getIdToken();
            const response = await fetch(
                'https://talkie.transtechvietnam.com/verify-otp',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        uid: user.uid,
                        token: token,
                    }),
                },
            );
            const data = await response.json();
            if (data.results) {
                alert('OTP sended');
                console.log(data);
            } else {
                alert('OTP failed');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            alert('Failed to verify OTP or send data to server');
        }
    };

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
                <div className="flex items-center justify-center mt-12 text-black dark:text-white">
                    <button
                        onClick={() => navigateLoginHandle()}
                        className="absolute left-7 h-7 md:ml-6 md:h-10 w-7 md:w-10 flex items-center justify-center bg-grayPrimary dark:bg-dark2Primary rounded-full"
                    >
                        <FaAngleLeft className="md:text-xl" />
                    </button>
                    <div className=" flex-1 flex justify-center">
                        <h5 className="md:text-2xl">
                            {LANGUAGE[language].WELCOME_IN}
                        </h5>
                    </div>
                </div>

                <div className="flex justify-center mt-20">
                    <div className="flex bg-grayPrimary dark:bg-dark2Primary justify-center items-center gap-2 md:gap-5 w-full md:w-2/3 lg:w-1/3 rounded-full px-8 py-4">
                        <button className="flex items-center gap-2">
                            <img src={iconVietnam} className="w-6" alt="" />
                            <span className="font-medium text-lg text-black dark:text-white">
                                +84
                            </span>
                        </button>
                        <div className="flex items-center justify-center">
                            <LuDot
                                size="1.5rem"
                                className="text-gray-300 m-0 p-0"
                            />
                        </div>
                        <input
                            className="text-black dark:text-white bg-inherit w-3/5 border-none outline-none text-[17px] font-medium"
                            value={userPhone}
                            readOnly
                        />
                    </div>
                </div>

                <div className="flex justify-center mt-3">
                    <div className="flex bg-grayPrimary dark:bg-dark2Primary justify-center items-center w-full md:w-2/3 lg:w-1/3 rounded-full px-8 py-4">
                        <input
                            className="text-black dark:text-white text-center bg-inherit w-4/5 border-none outline-none text-[17px] font-medium"
                            placeholder="Enter the 4 digit code"
                            ref={inputRef}
                            type="text"
                            value={numberCode}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center px-6 mb-9">
                <h5 className="text-black dark:text-gray-200">
                    {LANGUAGE[language].SEND_AGAIN}
                </h5>
                <button
                    onClick={() => isContinue && verifyOTP()}
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
