import { RiCloseFill } from 'react-icons/ri';
import { IoIosAdd } from 'react-icons/io';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../AppContext';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addChannel } from '../redux/actions/ChannelActions';
import LoadingSpinner from './LoadingSpinner';
import { LANGUAGE } from '../constants/language.constant';

export default function AddChannel() {
    const [file, setFile] = useState(null);
    const [channelName, setChannelName] = useState('');
    const { isAddChannel, toggleIsAddChannel } = useContext(AppContext);
    const [isContinue, setIsContinue] = useState(false);
    const { loading: loadingAdd } = useSelector((state) => state.channelAdd);
    const { language } = useSelector((state) => state.userLanguage);

    const modalRef = useRef(null);
    const dispatch = useDispatch();

    const convertObjectURL = (selectedFile) => {
        return URL.createObjectURL(selectedFile);
    };

    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // setFile(URL.createObjectURL(selectedFile));
            setFile(selectedFile);
        }
    };

    const handleCreateChannel = () => {
        if (isContinue) {
            // file là blob chuyển thành hình ảnh
            // const file = new File([file], file.name, { type: file.type });
            dispatch(addChannel(channelName, file));
        }
    };

    useEffect(() => {
        if (file && channelName) {
            setIsContinue(true);
        } else {
            setIsContinue(false);
        }
    }, [file, channelName]);

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
                toggleIsAddChannel();
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

    return (
        <>
            <div
                ref={modalRef}
                className={`absolute left-0 top-0 z-50 w-full h-screen ${
                    isAddChannel ? 'translate-y-14' : 'translate-y-[200vh]'
                } transition-all duration-300`}
            >
                <div className="px-5 md:px-10 bg-white dark:bg-dark2Primary h-full rounded-t-3xl">
                    <div className="flex justify-between items-center pt-9">
                        <button
                            className="text-black dark:text-white"
                            onClick={() => toggleIsAddChannel()}
                        >
                            <RiCloseFill size="2.3rem" />
                        </button>
                        <div>
                            <h4 className="text-black dark:text-white">
                                {LANGUAGE[language].NEW_CHANNEL}
                            </h4>
                        </div>
                        <button onClick={handleCreateChannel}>
                            <h4
                                className={`${
                                    isContinue
                                        ? 'text-black dark:text-bluePrimary'
                                        : 'text-zinc-500'
                                }`}
                            >
                                {LANGUAGE[language].CREATE}
                            </h4>
                        </button>
                    </div>

                    <div className="mt-9">
                        <p className="text-center text-lg text-zinc-500 dark:text-gray-400">
                            {LANGUAGE[language].NEW_CHANNEL_DESCRIPTION}
                        </p>
                    </div>

                    <div className="mt-10">
                        <h4 className="text-black dark:text-white">
                            {LANGUAGE[language].CHANNEL_NAME}
                        </h4>
                        <input
                            type="text"
                            className="text-black dark:text-white mt-2 w-full bg-inherit placeholder-zinc-300 dark:placeholder-gray-400 text-3xl font-semibold outline-none"
                            placeholder={LANGUAGE[language].ENTER_A_NAME}
                            value={channelName}
                            onChange={(e) => setChannelName(e.target.value)}
                        />
                    </div>

                    <div className="mt-10">
                        <h4 className="text-black dark:text-white">
                            {LANGUAGE[language].CHANNEL_PHOTO}
                        </h4>
                        <label htmlFor="file_input" className="inline-block">
                            {!file ? (
                                <div className="mt-3 flex justify-center items-center bg-grayPrimary h-[70px] md:h-[120px] w-[70px] md:w-[120px] rounded-2xl">
                                    <IoIosAdd
                                        size="4rem"
                                        className="text-zinc-400 p-2"
                                    />
                                </div>
                            ) : (
                                <img
                                    src={convertObjectURL(file)}
                                    className="mt-3 h-[70px] md:h-[120px] w-[70px] md:w-[120px] rounded-2xl object-cover"
                                    alt=""
                                />
                            )}
                        </label>

                        <input
                            onChange={handleChange}
                            hidden
                            type="file"
                            id="file_input"
                            accept="image/*"
                        />
                    </div>
                </div>
                {loadingAdd && (
                    <div className="fixed w-full h-full top-0 left-0 bg-black/30 flex justify-center items-center">
                        <LoadingSpinner />
                    </div>
                )}
            </div>
        </>
    );
}
