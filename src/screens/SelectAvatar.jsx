import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaAngleLeft, FaUser } from 'react-icons/fa';
import { RiAddLine } from 'react-icons/ri';
import { uploadAvatar } from '../redux/actions/UserActions';
import LoadingSpinner from '../components/LoadingSpinner';
import { LANGUAGE } from '../constants/language.constant';

export default function SelectAvatar() {
    const [isContinue, setIsContinue] = useState(false);
    const [image, setImage] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.userLogin);
    const { language } = useSelector((state) => state.userLanguage);

    const handleChangeImg = useCallback((e) => {
        const file = e.target.files[0];
        setImage(URL.createObjectURL(file));
        setImageUrl(file);
    }, []);

    const navigateHandle = useCallback(() => {
        if (isContinue && imageUrl) {
            setLoading(true);
            dispatch(uploadAvatar(imageUrl))
                .then(() => {
                    setLoading(false);
                    navigate('/selectpermissions');
                })
                .catch(() => {
                    setLoading(false);
                });
        } else if (isContinue) {
            // dispatch({ type: USER_UPDATE_PROFILE_SUCCESS });
            navigate('/selectpermissions');
        }
    }, [isContinue, imageUrl, dispatch, navigate]);

    useEffect(() => {
        setIsContinue(!!image || (userInfo && userInfo?.avatar));
    }, [image, userInfo]);

    const renderAvatar = () => {
        if (!image && !userInfo?.avatar) {
            return (
                <div className="relative bg-grayPrimary dark:bg-dark2Primary rounded-full h-32 w-32 flex justify-center items-center">
                    <FaUser size="2.3rem" className="text-gray-400" />
                    <div className="absolute bottom-0 right-4 bg-bluePrimary rounded-full">
                        <RiAddLine
                            size="1.8rem"
                            className="p-[3px] text-white"
                        />
                    </div>
                </div>
            );
        }
        return (
            <img
                className="object-cover relative bg-grayPrimary rounded-full h-32 w-32 flex justify-center items-center"
                src={image || userInfo?.avatar}
                alt="Avatar"
            />
        );
    };

    return (
        <div className="flex flex-col justify-between h-screen dark:bg-darkPrimary">
            <div className="flex relative mt-12 text-black dark:text-white">
                <button
                    onClick={() => navigate('/aboutyou')}
                    className="absolute left-7 h-7 md:ml-6 md:h-10 w-7 md:w-10 flex items-center justify-center bg-grayPrimary dark:bg-dark2Primary rounded-full"
                >
                    <FaAngleLeft className="md:text-xl" />
                </button>
                <div className="absolute w-full top-0 flex justify-center">
                    <h5 className="md:text-2xl">
                        {LANGUAGE[language].YOUR_AVATAR}
                    </h5>
                </div>
            </div>

            <form className="flex flex-col justify-center items-center px-6">
                <label htmlFor="file_input">{renderAvatar()}</label>
                <input
                    onChange={handleChangeImg}
                    hidden
                    type="file"
                    id="file_input"
                />

                <div className="mt-8 text-center text-[13px] md:text-lg text-gray-400">
                    <p>{LANGUAGE[language].CLEAR_PHOTO_FEATURING_TALKIE}</p>
                </div>
            </form>

            <div className="flex justify-center px-6 mb-9">
                <button
                    onClick={navigateHandle}
                    className={`text-xl font-medium w-full md:w-2/3 lg:w-1/3 rounded-full px-8 py-4 ${
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
