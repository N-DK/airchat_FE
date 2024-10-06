import { useEffect } from 'react';
import talkieLogo from '../assets/talkie-logo.png';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React from 'react';

export default function HomeScreen() {
    const navigate = useNavigate();
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    useEffect(() => {
        if (userInfo?.token) {
            navigate('/chatting');
        }
    }, [userInfo]);

    return (
        <>
            <div className="z-10 flex flex-col items-center relative h-screen bg-white dark:bg-slate-800">
                <div className="flex justify-center mt-10">
                    <img
                        className="text-center w-8 md:w-12"
                        src={talkieLogo}
                        alt=""
                    />
                </div>
                <h2 className="absolute top-1/3 mt-6 text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-t from-black dark:from-white to-gray-200 dark:to-gray-500">
                    Just Talk
                </h2>
                <div className="absolute bottom-0">
                    <div className="flex flex-col items-center gap-5 w-screen px-6">
                        <button
                            onClick={() => navigate('/login/phonenumber')}
                            className="text-xl md:text-2xl bg-black dark:bg-white text-white dark:text-black w-full md:w-2/3 rounded-full px-8 py-4 md:py-6 shadow-2xl"
                        >
                            Continue with Phone
                        </button>
                        <button
                            onClick={() => navigate('/login/email')}
                            className="text-xl md:text-2xl text-black dark:text-gray-300 bg-white dark:bg-dark2Primary w-full md:w-2/3 rounded-full px-8 py-4 md:py-6 shadow-2xl"
                        >
                            Continue with Email
                        </button>
                    </div>
                    <div className="text-black dark:text-gray-300 my-7 px-6 md:px-10 flex flex-col flex-wrap justify-center md:flex-row gap-x-2 items-center">
                        <span className="text-sm md:text-lg">
                            By pressing on “Continue with...” you agree to our
                        </span>
                        <div className="text-sm md:text-lg">
                            <span className="underline">Privacy Policy</span>
                            <span className="mx-2">and</span>
                            <span className="underline">
                                Terms and Conditions
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="fixed top-0 flex items-center justify-center w-screen h-screen">
        <div className="absolute rounded-full h-[150px] w-[150px] border-[20px] border-gray-200 animate-custom-ping"></div>
      </div> */}
        </>
    );
}
