import React from 'react';
import { FaAngleLeft } from 'react-icons/fa6';
import iconVietnam from '../assets/vietnam-icon.webp';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { auth } from '../firebase.config';
import { checkUserNumberPhone } from '../redux/actions/UserActions';
import PhoneInput from 'react-phone-input-2';

export default function LogInPhoneNumber() {
    const inputRef = useRef(null);
    const [numberPhone, setNumberPhone] = useState('');
    const [recaptchaVerifier, setRecaptchaVerifier] = useState('');
    const [isContinue, setIsContinue] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleInputPhoneChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value) && value.split('').length <= 9) {
            setNumberPhone(value);
        }
    };

    const onCatchVerify = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'send-otp', {
                size: 'invisible',
                callback: (response) => {
                    // onSendOTP();
                },
                'expired-callback': () => {
                    // Xử lý khi recaptcha hết hạn
                },
            });
        }
    };

    const onSendOTP = () => {
        onCatchVerify();

        const appVerifier = window.recaptchaVerifier;
        const phoneNumber = `+${numberPhone}`;
        signInWithPhoneNumber(auth, phoneNumber, appVerifier)
            .then((confirmationResult) => {
                window.confirmationResult = confirmationResult;
                alert('SMS sent');
            })
            .catch((error) => {
                alert('Failed to send OTP' + error);
            });
    };

    useEffect(() => {
        console.log(numberPhone);
        if (numberPhone.length >= 9) {
            setIsContinue(true);
        } else {
            setIsContinue(false);
        }
    }, [numberPhone]);

    // useEffect(() => {
    //     const recaptcha = new RecaptchaVerifier(
    //         'send-otp',
    //         {
    //             size: 'invisible',
    //             callback: function (response) {},
    //         },
    //         auth,
    //     );
    //     setRecaptchaVerifier(recaptcha);
    //     return () => {
    //         recaptcha.clear();
    //     };
    // }, []);

    return (
        <div className="flex flex-col justify-between h-screen bg-white dark:bg-darkPrimary">
            <div className="px-6">
                <div className="grid grid-cols-3 mt-12 text-black dark:text-white">
                    <button
                        onClick={() => navigate('/')}
                        className="col-span-1 h-7 md:ml-6 md:h-10 w-7 md:w-10 flex items-center justify-center bg-grayPrimary dark:bg-dark2Primary rounded-full"
                    >
                        <FaAngleLeft className="md:text-xl" />
                    </button>
                    <div className="col-span-1 w-full flex justify-center">
                        <h5 className="md:text-2xl">Welcome In</h5>
                    </div>
                </div>

                <div className="flex flex-col gap-6 justify-center items-center mt-28">
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
                </div>
            </div>
            <div id="send-otp"></div>
            <div className="flex justify-center px-6 mb-9">
                <button
                    id="send-otp"
                    onClick={() => isContinue && onSendOTP()}
                    className={`text-xl font-medium w-full md:w-2/3 lg:w-1/3 rounded-full py-4 ${
                        isContinue
                            ? 'text-white dark:text-darkPrimary bg-black dark:bg-white'
                            : 'text-stone-400 dark:text-gray-400 bg-grayPrimary dark:bg-dark2Primary'
                    }`}
                >
                    <span>Continue</span>
                </button>
            </div>
        </div>
    );
}
