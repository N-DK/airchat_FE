import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../redux/actions/UserActions';
import LoadingSpinner from '../components/LoadingSpinner';
import { USER_UPDATE_PROFILE_RESET } from '../redux/constants/UserConstants';
import React from 'react';

export default function AboutYou() {
    const inputRef = useRef(null);
    const [fullName, setFullName] = useState('');
    const [userName, setUserName] = useState('');
    const [isContinue, setIsContinue] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;
    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
    const { loading, isSuccess } = userUpdateProfile;

    const navigateSelectAvatarHandle = () => {
        if (isContinue) {
            dispatch(updateUser({ name: fullName, username: userName }));
        }
    };

    const checkInput = () => {
        if (fullName.trim() === '') {
            setFullName('');
        }
        if (userName.trim() === '') {
            setUserName('');
        }
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
        if (fullName.trim() !== '' && userName.trim() !== '') {
            setIsContinue(true);
        } else {
            setIsContinue(false);
        }
    }, [fullName, userName]);

    return (
        <div className="flex flex-col justify-between h-screen dark:bg-darkPrimary">
            <div className="px-6">
                <div className="flex justify-center mt-12">
                    <h5 className="md:text-2xl text-black dark:text-white">
                        About you
                    </h5>
                </div>

                <div className="flex justify-center mt-20">
                    <div className="flex bg-grayPrimary dark:bg-dark2Primary justify-center items-center w-full md:w-2/3 lg:w-1/3 rounded-full px-8 py-4">
                        <input
                            className="text-black dark:text-white text-center bg-inherit w-1/3 border-none outline-none text-[17px] font-medium"
                            placeholder="Full name"
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
                            className="text-black dark:text-white text-center bg-inherit w-1/3 border-none outline-none text-[17px] font-medium"
                            placeholder="Username"
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            onBlur={() => checkInput()}
                        />
                    </div>
                </div>

                {!fullName ? (
                    <div className="flex justify-center mt-3">
                        <span className="text-gray-400">
                            Enter your full name
                        </span>
                    </div>
                ) : (
                    !userName && (
                        <div className="flex justify-center mt-3">
                            <span className="text-gray-400">
                                Enter your username
                            </span>
                        </div>
                    )
                )}
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
                    {loading ? <LoadingSpinner /> : <span>Continue</span>}
                </button>
            </div>
        </div>
    );
}
