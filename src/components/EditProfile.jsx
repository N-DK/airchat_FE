import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../AppContext';
import { LuImagePlus } from 'react-icons/lu';
import { useDispatch, useSelector } from 'react-redux';
import React from 'react';
import { Avatar } from 'antd';
import {
    profile,
    updateUser,
    uploadAvatar,
} from '../redux/actions/UserActions';
import { FaAngleLeft, FaSpinner } from 'react-icons/fa6';
import Message from './Message';
import DrawerChangePassword from './DrawerChangePassword';
import { LANGUAGE } from '../constants/language.constant';

const NotifyText = ({ message, show }) => {
    return (
        <div
            className={`bg-white z-[99999999] absolute left-1/2 w-max transform -translate-x-1/2 dark:bg-dark2Primary shadow-2xl rounded-2xl p-3 md:p-5 transition-all duration-500 ${
                show ? 'translate-y-0 mt-3' : '-translate-y-full'
            }`}
        >
            <h6 className="text-black dark:text-white">{message}</h6>
        </div>
    );
};

export default function EditProfile() {
    const {
        isEditProfile,
        toggleIsEditProfile,
        showDrawerChangePassword,
        toggleShowDrawerChangePassword,
    } = useContext(AppContext);

    const modalRef = useRef(null);
    const dispatch = useDispatch();

    const userProfile = useSelector((state) => state.userProfile);
    const userUploadAvatar = useSelector((state) => state.userUploadAvatar);

    const { loading, error, isSuccess } = userUploadAvatar;
    const { userInfo: userInfoProfile } = userProfile;
    const { isSuccess: isSuccessUpdateProfile } = useSelector(
        (state) => state.userUpdateProfile,
    );

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [website, setWebsite] = useState('');
    const [errorUsername, setErrorUsername] = useState('');
    const [errorName, setErrorName] = useState('');
    const [errorWebsite, setErrorWebsite] = useState('');
    const [disableSave, setDisableSave] = useState(true);
    const [sendMessage, setSendMessage] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState('');
    const [showNotify, setShowNotify] = useState(false);
    const [isHandleSubmit, setIsHandleSubmit] = useState(false);

    const handleSubmit = () => {
        if (inValidateUser({ name, username, bio, website }) === 'pass') {
            dispatch(updateUser({ name, username, bio, website }));
            setIsHandleSubmit(true);
        }
    };

    const inValidateUser = (user) => {
        if (user.username.includes('@')) {
            setErrorUsername(
                'Only alphanumeric characters and periods are allowed',
            );
            return 'error';
        }
        if (user.name.length < 2 || user.name.length > 20) {
            setErrorName('Must be between 2 and 20 characters');
            return 'error';
        }
        if (!user.website.startsWith('www.') && user.website !== '') {
            setErrorWebsite('Website must start with www.');
            return 'error';
        }
        return 'pass';
    };

    const handleUploadAvatar = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.onchange = () => {
            const file = fileInput.files[0];
            dispatch(uploadAvatar(file));
        };
        fileInput.click();
    };

    useEffect(() => {
        if (name !== '' || username !== '' || bio !== '' || website !== '') {
            setDisableSave(
                userInfoProfile?.name === name &&
                    userInfoProfile?.username?.replace('@', '') === username &&
                    userInfoProfile?.bio === bio &&
                    userInfoProfile.website === website,
            );
        }
    }, [name, username, bio, website]);

    useEffect(() => {
        let isFirstRender = true;
        if (userInfoProfile && isFirstRender) {
            setName(userInfoProfile?.name ?? '');
            setUsername(userInfoProfile?.username?.replace('@', '') ?? '');
            setBio(userInfoProfile?.bio ?? '');
            setWebsite(userInfoProfile?.website ?? '');
            isFirstRender = false;
        }
    }, [userInfoProfile]);

    useEffect(() => {
        const modalElement = modalRef.current;
        let startY = 0;
        let isDragging = false;
        const handleTouchStart = (e) => {
            startY = e.touches[0].clientY;
            isDragging = false;
        };
        const handleTouchMove = (e) => {
            const currentY = e.touches[0].clientY;
            const distance = currentY - startY;
            if (distance > 50) {
                isDragging = true;
            }
        };
        const handleTouchEnd = () => {
            if (isDragging) {
                toggleIsEditProfile();
            }
        };

        modalElement.addEventListener('touchstart', handleTouchStart);
        modalElement.addEventListener('touchmove', handleTouchMove);
        modalElement.addEventListener('touchend', handleTouchEnd);
        return () => {
            modalElement.removeEventListener('touchstart', handleTouchStart);
            modalElement.removeEventListener('touchmove', handleTouchMove);
            modalElement.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    useEffect(() => {
        if (!loading && isHandleSubmit && isSuccessUpdateProfile == 1) {
            setNotifyMessage(LANGUAGE[language].UPDATE_PROFILE_SUCCESS);
            setShowNotify(true);
            setTimeout(() => setShowNotify(false), 1200);
            setIsHandleSubmit(false);
            dispatch(profile());
        } else if (!loading && isHandleSubmit && isSuccessUpdateProfile == 0) {
            setNotifyMessage(LANGUAGE[language].UPDATE_PROFILE_FAILED);
            setShowNotify(true);
            setTimeout(() => setShowNotify(false), 1200);
            setIsHandleSubmit(false);
        }
    }, [loading, isSuccessUpdateProfile, isHandleSubmit]);

    useEffect(() => {
        if (!loading && isSuccess) {
            dispatch(profile());
        }
    }, [loading]);

    const { language } = useSelector((state) => state.userLanguage);

    return (
        <>
            <div
                ref={modalRef}
                className={`absolute left-0 top-0 z-50 w-full h-screen transition-all duration-300 ${
                    isEditProfile ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="bg-white dark:bg-dark2Primary h-full">
                    <div className="px-5 md:px-10 flex justify-between pt-12 pb-4 items-center py-3 md:py-5 text-lg md:text-[19px] border-b-[1px] border-gray-300">
                        <button
                            className="text-black dark:text-white"
                            onClick={() => toggleIsEditProfile()}
                        >
                            <FaAngleLeft className="text-lg md:text-[22px] " />
                        </button>
                        <button className="text-black dark:text-white font-semibold">
                            {LANGUAGE[language].EDIT_PROFILE}
                        </button>
                        <button
                            disabled={disableSave}
                            onClick={handleSubmit}
                            className="font-semibold text-bluePrimary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {LANGUAGE[language].SAVE}
                        </button>
                    </div>

                    <div className="px-6 md:px-10 pt-6 pb-5 border-b-[1px] border-gray-300">
                        <div onClick={handleUploadAvatar} className="relative">
                            <Avatar
                                src={`https://talkie.transtechvietnam.com/${
                                    userInfoProfile?.image || ''
                                }`}
                                className="h-[60px] md:h-[70px] w-[60px] md:w-[70px] object-cover rounded-full"
                                alt=""
                            />
                            <div className="bg-black/40 rounded-full absolute top-0 left-0 h-[60px] md:h-[70px] w-[60px] md:w-[70px]"></div>
                            <div className="text-white absolute top-0 left-0 h-[60px] md:h-[70px] w-[60px] md:w-[70px] flex justify-center items-center">
                                {loading ? (
                                    <FaSpinner className="animate-spin" />
                                ) : (
                                    <LuImagePlus className="" />
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="grid grid-cols-3 border-b-[1px] border-gray-300 px-6 md:px-10 py-3 md:py-5">
                            <h6 className="text-black dark:text-white md:text-xl">
                                {LANGUAGE[language].NAME}
                            </h6>
                            <div className=" col-span-2">
                                <input
                                    className="bg-inherit col-span-2 outline-none text-bluePrimary md:text-xl"
                                    type="text"
                                    placeholder={`${LANGUAGE[language].ENTER_YOUR} ${LANGUAGE[language].NAME}`}
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setErrorName('');
                                    }}
                                />
                                {errorName && (
                                    <p className="text-red-500 ">{errorName}</p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 border-b-[1px] border-gray-300 px-6 md:px-10 py-3 md:py-5">
                            <h6 className="text-black dark:text-white md:text-xl">
                                {LANGUAGE[language].USERNAME}
                            </h6>
                            <div className="col-span-2">
                                <input
                                    className="bg-inherit  outline-none text-bluePrimary md:text-xl"
                                    type="text"
                                    placeholder={`${LANGUAGE[language].ENTER_YOUR} ${LANGUAGE[language].USERNAME}`}
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        setErrorUsername('');
                                    }}
                                />
                                {errorUsername && (
                                    <p className="text-red-500">
                                        {errorUsername}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-3 border-b-[1px] border-gray-300 px-6 md:px-10 py-3 md:py-5">
                            <h6 className="text-black dark:text-white md:text-xl">
                                {LANGUAGE[language].BIO}
                            </h6>
                            <input
                                className="bg-inherit col-span-2 outline-none text-bluePrimary md:text-xl"
                                type="text"
                                placeholder={`${LANGUAGE[language].ENTER_YOUR} ${LANGUAGE[language].BIO}`}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                        </div>
                        <div
                            onClick={toggleShowDrawerChangePassword}
                            className="grid grid-cols-3 border-b-[1px] border-gray-300 px-6 md:px-10 py-3 md:py-5"
                        >
                            <h6 className="text-black dark:text-white md:text-xl">
                                {LANGUAGE[language].PASSWORD}
                            </h6>
                            <input
                                className="bg-inherit col-span-2 outline-none text-bluePrimary md:text-xl"
                                type="password"
                                value={'********'}
                                readOnly
                            />
                        </div>
                        <div className="grid grid-cols-3 border-b-[1px] border-gray-300 px-6 md:px-10 py-3 md:py-5">
                            <h6 className="text-black dark:text-white md:text-xl">
                                {LANGUAGE[language].WEBSITE}
                            </h6>
                            <div className="col-span-2">
                                <input
                                    className="bg-inherit outline-none text-bluePrimary md:text-xl"
                                    type="text"
                                    placeholder={`${LANGUAGE[language].ENTER_YOUR} ${LANGUAGE[language].WEBSITE}`}
                                    value={website}
                                    onChange={(e) => {
                                        setWebsite(e.target.value);
                                        setErrorWebsite('');
                                    }}
                                />
                                {errorWebsite && (
                                    <p className="text-red-500">
                                        {errorWebsite}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <DrawerChangePassword />
            </div>
            <NotifyText message={notifyMessage} show={showNotify} />
        </>
    );
}
