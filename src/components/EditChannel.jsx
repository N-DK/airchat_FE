import { RiCloseFill } from 'react-icons/ri';
import { IoIosAdd } from 'react-icons/io';
import { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../AppContext';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addChannel, deleteChannel } from '../redux/actions/ChannelActions';
import { Avatar } from 'antd';
import { FaSpinner } from 'react-icons/fa6';
import { LuImagePlus } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import {
    CHANNEL_ADD_RESET,
    CHANNEL_DELETE_RESET,
} from '../redux/constants/ChannelConstants';

const NotifyPinChannel = ({ message, show }) => (
    <div
        className={` ${
            show ? 'z-[9999999] fixed top-0 left-0 w-full h-full' : ''
        }`}
    >
        <div
            className={`bg-white absolute left-1/2 transform -translate-x-1/2 w-auto z-50 dark:bg-dark2Primary shadow-2xl rounded-2xl p-3 md:p-5 transition-all duration-500 ${
                show
                    ? 'translate-y-0 mt-3 opacity-100'
                    : '-translate-y-full opacity-0'
            }`}
        >
            <h6 className="text-black dark:text-white">{message}</h6>
        </div>
    </div>
);

export default function EditChannel({ data }) {
    const [file, setFile] = useState(null);
    const [channelName, setChannelName] = useState(data?.name);
    const [summary, setSummary] = useState(data?.summary ?? '');
    const { isEditChannel, toggleIsEditChannel } = useContext(AppContext);
    const [isContinue, setIsContinue] = useState(false);
    const [showNotify, setShowNotify] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState('');
    const navigate = useNavigate();

    const modalRef = useRef(null);
    const dispatch = useDispatch();
    const {
        channel,
        error,
        loading: loadingEdit,
    } = useSelector((state) => state.channelAdd);
    const { isSuccess, loading: loadingDelete } = useSelector(
        (state) => state.channelDelete,
    );

    const convertObjectURL = (selectedFile) => {
        return URL.createObjectURL(selectedFile);
    };

    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleDeleteChannel = () => {
        dispatch(deleteChannel(data.id));
    };

    const handleCreateChannel = () => {
        if (isContinue) {
            dispatch(addChannel(channelName, file, data.id));
        }
    };

    useEffect(() => {
        if (channelName === data?.name && !file) setIsContinue(false);
        else {
            if (file || channelName) {
                setIsContinue(true);
            } else {
                setIsContinue(false);
            }
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
                toggleIsEditChannel();
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
        if (channel || error) {
            if (isEditChannel) toggleIsEditChannel();
            setNotifyMessage(channel ? 'Channel edited' : error);
            setShowNotify(true);
            setTimeout(() => setShowNotify(false), 1200);
            dispatch({ type: CHANNEL_ADD_RESET });
        }
    }, [channel, error]);

    useEffect(() => {
        if (isSuccess) {
            if (isEditChannel) toggleIsEditChannel();
            setNotifyMessage('Channel deleted');
            setShowNotify(true);
            setTimeout(() => setShowNotify(false), 1200);
            setTimeout(() => navigate(-1), 1200);
            dispatch({ type: CHANNEL_DELETE_RESET });
        }
    }, [isSuccess]);

    return (
        <>
            <div
                ref={modalRef}
                className={`absolute left-0 top-0 z-50 w-full h-screen ${
                    isEditChannel ? 'translate-y-14' : 'translate-y-[100vh]'
                } transition-all duration-300`}
            >
                <div className="px-5 md:px-10 bg-white dark:bg-dark2Primary h-full rounded-t-3xl">
                    <div className="flex justify-between items-center pt-9">
                        <button
                            className="text-black dark:text-white "
                            onClick={() => toggleIsEditChannel()}
                        >
                            Cancel
                        </button>
                        <div>
                            <h4 className="text-black dark:text-white">
                                Edit Channel
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
                                Save
                            </h4>
                        </button>
                    </div>
                    <label htmlFor="file_input" className="inline-block">
                        <div className="relative w-max">
                            <Avatar
                                src={
                                    file
                                        ? convertObjectURL(file)
                                        : `https://talkie.transtechvietnam.com/${data?.photo}`
                                }
                                alt=""
                                className="mt-5 flex justify-center items-center bg-grayPrimary h-[100px] md:h-[120px] w-[100px] md:w-[120px] rounded-3xl"
                            />
                            <div className="bg-black/40 rounded-3xl absolute top-0 left-0 w-full h-full"></div>
                            <div className="text-white absolute top-0 left-0 w-full h-full flex justify-center items-center">
                                {false ? ( //loading
                                    <FaSpinner
                                        className="animate-spin"
                                        size={24}
                                    />
                                ) : (
                                    <LuImagePlus className="" size={24} />
                                )}
                            </div>
                            <input
                                onChange={handleChange}
                                hidden
                                type="file"
                                id="file_input"
                                accept="image/*"
                            />
                        </div>
                    </label>

                    <div className="mt-5 flex item-center">
                        <h6 className="text-black dark:text-white w-24">
                            Name
                        </h6>
                        <input
                            type="text"
                            className="text-black dark:text-white flex-1 bg-inherit placeholder-zinc-300 dark:placeholder-gray-400 font-semibold outline-none"
                            placeholder="Enter a name"
                            value={channelName}
                            onChange={(e) => setChannelName(e.target.value)}
                        />
                    </div>
                    <div className="h-[1px] my-2 w-full bg-gray-400"></div>
                    <div className="flex item-center">
                        <h6 className="text-black dark:text-white w-24">
                            Summary
                        </h6>
                        <input
                            type="text"
                            className="text-black dark:text-white flex-1 bg-inherit placeholder-zinc-300 dark:placeholder-gray-400 font-semibold outline-none"
                            placeholder="Enter a summary"
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={handleDeleteChannel}
                        className="text-red-600 mt-10"
                    >
                        Delete Channel
                    </button>
                </div>
                {(loadingDelete || loadingEdit) && (
                    <div className="fixed w-full h-full top-0 left-0 bg-black/60 flex justify-center items-center">
                        <LoadingSpinner />
                    </div>
                )}
            </div>
            <NotifyPinChannel message={notifyMessage} show={showNotify} />
        </>
    );
}
