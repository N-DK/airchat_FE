import { FaAngleLeft } from 'react-icons/fa6';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    checkUserAccount,
    checkUserEmail,
} from './../redux/actions/UserActions';
import LoadingSpinner from './../components/LoadingSpinner';
import { SAVE_USER_EMAIL_TEMPORARY } from '../redux/constants/UserConstants';
import React from 'react';

export default function LogInEmail() {
    const [email, setEmail] = useState('');
    const [isContinue, setIsContinue] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userAccount = useSelector((state) => state.userAccount);
    const {
        account,
        loading: loadingAccount,
        error: errorAccount,
    } = userAccount;
    const userEmail = useSelector((state) => state.userEmail);
    const { userInfo, loading: loadingEmail, error: errorEmail } = userEmail;

    const submitEmailHandle = () => {
        dispatch(checkUserAccount(email));
    };

    useEffect(() => {
        if (account) {
            if (account.login) {
                navigate('/login');
                dispatch({
                    type: SAVE_USER_EMAIL_TEMPORARY,
                    payload: email,
                });
            } else {
                dispatch(checkUserEmail(email));
            }
        }
    }, [account]);

    useEffect(() => {
        if (userInfo?.results) {
            navigate('/entercode/email');
            dispatch({
                type: SAVE_USER_EMAIL_TEMPORARY,
                payload: email,
            });
        }
    }, [userInfo]);

    useEffect(() => {
        if (email) {
            setIsContinue(true);
        } else {
            setIsContinue(false);
        }
    }, [email]);

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

                <div className="flex justify-center items-center mt-28 ">
                    <div className="w-full md:w-2/3 lg:w-1/3 flex gap-3 md:gap-12 bg-grayPrimary dark:bg-dark2Primary items-center rounded-full px-10 md:px-16 py-4">
                        <button className="flex items-center">
                            <span className="font-medium text-lg text-black dark:text-white">
                                Email:
                            </span>
                        </button>
                        <input
                            className=" text-black dark:text-white bg-inherit w-full border-none outline-none text-[17px] font-medium"
                            placeholder="enter your email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
                {(errorAccount || errorEmail) && (
                    <div className="flex justify-center items-center mt-4">
                        <span className="text-lg font-medium text-red-500">
                            {errorAccount || errorEmail}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex justify-center px-6 mb-9">
                <button
                    onClick={() => isContinue && submitEmailHandle()}
                    className={`text-xl font-medium w-full md:w-2/3 lg:w-1/3 rounded-full py-4 ${
                        isContinue
                            ? 'text-white dark:text-darkPrimary bg-black dark:bg-white'
                            : 'text-stone-400 dark:text-gray-400 bg-grayPrimary dark:bg-dark2Primary'
                    }`}
                >
                    {loadingAccount || loadingEmail ? (
                        <span>Loading...</span>
                    ) : (
                        <span>Continue</span>
                    )}
                </button>
            </div>
        </div>
    );
}
