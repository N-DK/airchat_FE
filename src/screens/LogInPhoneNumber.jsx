import React from 'react';
import { FaAngleLeft } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    RecaptchaVerifier,
    signInWithPhoneNumber,
} from 'https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../firebase.config';
import PhoneInput from 'react-phone-input-2';
import {
    checkUserAccount,
    checkUserNumberPhone,
    verifyOTP,
} from '../redux/actions/UserActions';
import { LANGUAGE } from '../constants/language.constant';
import OtpInput from 'react-otp-input';
import { CgSpinner } from 'react-icons/cg';
import {
    CHECK_ACCOUNT_RESET,
    CHECK_NUMBER_PHONE_RESET,
    SAVE_USER_NUMBER_PHONE_TEMPORARY,
    USER_LOGIN_SUCCESS,
} from '../redux/constants/UserConstants';

const TIME_COUNT_DOWN = 59;

const NotifyText = ({ message, show }) => {
    return (
        <div
            className={`bg-white z-[99999999] absolute left-1/2 transform -translate-x-1/2 w-auto dark:bg-dark2Primary shadow-2xl rounded-2xl p-3 md:p-5 transition-all duration-500 ${
                show ? 'translate-y-0 mt-3' : '-translate-y-full'
            }`}
        >
            <h6 className="text-black dark:text-white">{message}</h6>
        </div>
    );
};

export default function LogInPhoneNumber() {
    const [numberPhone, setNumberPhone] = useState(
        localStorage.getItem('phoneNumber') ?? '',
    );
    const [isContinue, setIsContinue] = useState(false);
    const [otp, setOtp] = useState('');
    const [showOTP, setShowOTP] = useState(
        localStorage.getItem('phoneNumber') ? true : false,
    );
    const [showNotify, setShowNotify] = useState(false);
    const [messageNotify, setMessageNotify] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingResendOTP, setLoadingResendOTP] = useState(false);
    const [countDown, setCountDown] = useState(TIME_COUNT_DOWN);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { language } = useSelector((state) => state.userLanguage);
    const {
        error: errorCheckPhone,
        userPhone,
        loading: loadingCheckPhone,
    } = useSelector((state) => state.userNumberPhone);
    const {
        userInfo,
        loading: loadingVerifyOTP,
        error: errorVerifyOTP,
    } = useSelector((state) => state.userCode);
    const {
        account,
        loading: loadingAccount,
        error: errorAccount,
    } = useSelector((state) => state.userAccount);

    const handleSendOTP = () => {
        if (showOTP) {
            onVerifyOTP();
        } else {
            dispatch(checkUserNumberPhone(numberPhone));
        }
    };

    const onCatchVerify = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                'send-otp',
                {
                    size: 'invisible',
                    callback: function (response) {},
                },
                auth,
            );
        }
    };

    const onSendOTP = () => {
        setLoading(true);
        const appVerifier = window.recaptchaVerifier;

        const phoneNumber = `+${numberPhone}`;
        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then(function (confirmationResult) {
                window.confirmationResult = confirmationResult;
                setShowOTP(true);
                setShowNotify(true);
                setLoading(false);
                setLoadingResendOTP(false);
                setIsContinue(false);
                setCountDown(TIME_COUNT_DOWN);
                setMessageNotify(LANGUAGE[language].SEND_OTP_SUCCESS);
                setTimeout(() => setShowNotify(false), 1200);
                localStorage.setItem('phoneNumber', numberPhone);
            })
            .catch(function (error) {
                console.log(error);
                setShowNotify(true);
                setLoading(false);
                setLoadingResendOTP(false);
                dispatch({
                    type: CHECK_ACCOUNT_RESET,
                });
                dispatch({ type: CHECK_NUMBER_PHONE_RESET });
                setCountDown(TIME_COUNT_DOWN);
                setMessageNotify(LANGUAGE[language].SEND_OTP_FAILED);
                setTimeout(() => setShowNotify(false), 1200);
            });
    };

    const onVerifyOTP = async () => {
        try {
            setLoading(true);
            const result = await window.confirmationResult.confirm(otp);
            const user = result.user;
            const uid = user.uid;
            const token = await user.getIdToken();
            setLoading(false);
            dispatch(verifyOTP(uid, token));
        } catch (error) {
            // console.error(
            //     'Error verifying OTP or sending data to server:',
            //     error,
            // );
            // alert('Failed to verify OTP or send data to server');

            setShowNotify(true);
            setLoading(false);
            setMessageNotify(LANGUAGE[language].VERIFY_OTP_FAILED);
            setTimeout(() => setShowNotify(false), 1200);
        }
    };

    useEffect(() => {
        let timer;
        if (showOTP && countDown > 0) {
            timer = setInterval(() => {
                setCountDown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [showOTP, countDown]);

    useEffect(() => {
        if (numberPhone.length >= 9 || otp.length === 6) {
            setIsContinue(true);
        } else {
            setIsContinue(false);
        }
    }, [numberPhone, otp]);

    useEffect(() => {
        onCatchVerify();
    }, []);

    useEffect(() => {
        if (errorCheckPhone) {
            setShowNotify(true);
            setMessageNotify(errorCheckPhone);
        }
    }, [errorCheckPhone]);

    useEffect(() => {
        if (userPhone?.results) {
            dispatch(checkUserAccount({ phone: `+${numberPhone}` }));
            dispatch({ type: CHECK_NUMBER_PHONE_RESET });
        }
    }, [userPhone, numberPhone]);

    useEffect(() => {
        if (account?.results === 1 && numberPhone) {
            if (account.login == 1) {
                navigate('/login');
                if (numberPhone) {
                    dispatch({
                        type: SAVE_USER_NUMBER_PHONE_TEMPORARY,
                        payload: `+${numberPhone}`,
                    });
                }
            } else if (account.login == 0) {
                onSendOTP();
            } else {
                navigate('/aboutyou');
            }
        }
    }, [account, numberPhone]);

    useEffect(() => {
        if (userInfo?.results) {
            dispatch({ type: USER_LOGIN_SUCCESS, payload: userInfo });
            localStorage.removeItem('phoneNumber');
            navigate('/aboutyou');
        }
    }, [userInfo]);

    return (
        <div className="flex relative flex-col justify-between h-screen bg-white dark:bg-darkPrimary">
            <>
                <div className="px-6">
                    <div className="flex items-center justify-center mt-12 text-black dark:text-white">
                        <button
                            onClick={() => {
                                dispatch({
                                    type: CHECK_ACCOUNT_RESET,
                                });
                                localStorage.removeItem('phoneNumber');
                                navigate('/');
                            }}
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
                    <div className="flex flex-col gap-6 justify-center items-center mt-28">
                        {showOTP ? (
                            <>
                                <p className="text-3xl mb-4 dark:text-white font-medium text-center">
                                    {LANGUAGE[language].ENTER_OTP}
                                </p>
                                <OtpInput
                                    value={otp}
                                    onChange={setOtp}
                                    inputType="number"
                                    numInputs={6}
                                    renderSeparator={
                                        <span className="mx-2"></span>
                                    }
                                    renderInput={(props) => (
                                        <input {...props} />
                                    )}
                                    inputStyle={{
                                        width: '50px',
                                        height: '50px',
                                        fontSize: '20px',
                                        border: 'none',
                                        borderRadius: '4px',
                                        outline: 'none',
                                        fontFamily: 'inherit',
                                        boxShadow:
                                            'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
                                    }}
                                />
                            </>
                        ) : (
                            <div className="w-full md:w-2/3 lg:w-1/3 flex gap-3 justify-center md:gap-12 bg-grayPrimary dark:bg-dark2Primary items-center rounded-full  py-4">
                                <PhoneInput
                                    inputStyle={{
                                        border: 'none',
                                        fontSize: '17px',
                                    }}
                                    buttonStyle={{
                                        border: 'none',
                                    }}
                                    buttonClass="bg-grayPrimary dark:bg-dark2Primary"
                                    dropdownClass="bg-grayPrimary dark:bg-dark2Primary scrollbar-none text-black dark:text-white"
                                    containerClass="inline-block w-[85%] bg-transparent"
                                    inputClass="text-black dark:text-white bg-grayPrimary dark:bg-dark2Primary outline-none"
                                    country={'vn'}
                                    value={numberPhone}
                                    onChange={(phone) => setNumberPhone(phone)}
                                />
                            </div>
                        )}
                    </div>
                    <div className="invisible" id="send-otp"></div>
                </div>
                <div className="flex flex-col justify-center px-6 mb-9 ">
                    {/* nếu như showOTP thì hiển thị nút gửi lại 59s */}
                    {showOTP && (
                        <button
                            disabled={countDown > 0 || loadingResendOTP}
                            onClick={() => {
                                if (countDown === 0) {
                                    setLoadingResendOTP(true);
                                    onSendOTP();
                                }
                            }}
                            className={`text-xl mb-4 font-medium w-full relative flex items-center justify-center md:w-2/3 lg:w-1/3 rounded-full py-4 ${
                                countDown === 0
                                    ? 'text-white dark:text-darkPrimary bg-black dark:bg-white'
                                    : 'text-stone-400 dark:text-gray-400 bg-grayPrimary dark:bg-dark2Primary'
                            }`}
                        >
                            {loadingResendOTP && (
                                <CgSpinner
                                    size={32}
                                    className="animate-spin absolute left-1/2 -ml-[95px]"
                                />
                            )}
                            {countDown > 0
                                ? `Gửi lại ${countDown}s`
                                : 'Gửi lại'}
                        </button>
                    )}

                    <button
                        disabled={
                            loading ||
                            loadingCheckPhone ||
                            loadingVerifyOTP ||
                            loadingAccount ||
                            loadingResendOTP
                        }
                        onClick={() => isContinue && handleSendOTP()}
                        className={`text-xl font-medium w-full disabled:opacity-50 relative flex items-center justify-center md:w-2/3 lg:w-1/3 rounded-full py-4 ${
                            isContinue
                                ? 'text-white dark:text-darkPrimary bg-black dark:bg-white'
                                : 'text-stone-400 dark:text-gray-400 bg-grayPrimary dark:bg-dark2Primary'
                        }`}
                    >
                        {(loading ||
                            loadingCheckPhone ||
                            loadingVerifyOTP ||
                            loadingAccount) &&
                            !loadingResendOTP && (
                                <CgSpinner
                                    size={32}
                                    className="animate-spin absolute left-1/2 -ml-[95px]"
                                />
                            )}
                        <span>
                            {showOTP
                                ? LANGUAGE[language].VERIFY
                                : LANGUAGE[language].CONTINUE}
                        </span>
                    </button>
                </div>
            </>

            <NotifyText message={messageNotify} show={showNotify} />
        </div>
    );
}
