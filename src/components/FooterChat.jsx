import { GoHomeFill } from 'react-icons/go';
import { IoSearch } from 'react-icons/io5';
import { IoMdMic } from 'react-icons/io';
import { MdOutlineNotifications } from 'react-icons/md';
import { HiOutlineMail } from 'react-icons/hi';
import { CgArrowsExpandRight } from 'react-icons/cg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../AppContext';
import { HiPause } from 'react-icons/hi2';
import { HiMiniPlay } from 'react-icons/hi2';
import { IoVideocam } from 'react-icons/io5';
import React from 'react';
import RecordCover from './RecordCover';
import { Avatar, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { FaReply } from 'react-icons/fa6';
import { setPostActive, submitPost } from '../redux/actions/PostActions';
import {
    setObjectActive,
    setObjectAudioCurrent,
} from '../redux/actions/SurfActions';

export default function FooterChat({ isSwiping, title, isPlay, handleSend }) {
    const navigate = useNavigate();
    const {
        toggleIsRecord,
        isRunAuto,
        toggleIsRunAuto,
        isRunSpeed,
        toggleIsRunSpeed,
        toggleIsFullScreen,
        recordOption,
        toggleRecordOption,
        isFullScreen,
    } = useContext(AppContext);
    const iconsMenu = [
        {
            icon: <GoHomeFill size="1.8rem" />,
            name: 'chatting',
        },
        {
            icon: <IoSearch size="1.8rem" />,
            name: 'search',
        },
        {
            icon:
                recordOption === 'audio' ? (
                    <IoMdMic size="1.8rem" />
                ) : (
                    <IoVideocam size="1.7rem" />
                ),
            name: 'mic',
        },
        {
            icon: <MdOutlineNotifications size="1.8rem" />,
            name: 'notifications',
        },
        {
            icon: <HiOutlineMail size="1.8rem" />,
            name: 'messages',
        },
    ];
    const pressTimer = useRef();
    const [messageApi, contextHolder] = message.useMessage();
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [touchStartX, setTouchStartX] = useState(null);
    const [isStartRecord, setIsStartRecord] = useState(false);
    const [audio, setAudio] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recognitionRef = useRef(null);
    const { post } = useSelector((state) => state.setPostActive);
    const { object } = useSelector((state) => state.setObjectActive);
    const { audioCurrent } = useSelector(
        (state) => state.setObjectAudioCurrent,
    );
    const dispatch = useDispatch();

    const navigateHandle = (name) => {
        if (name == 'mic' && isPlay) {
            toggleIsRecord();
        } else {
            if (name !== 'mic') {
                navigate(`/${name}`);
            }
        }
    };

    const handleTouchStart = useCallback((e) => {
        setTouchStartX(e.touches[0].clientX);
        pressTimer.current = setTimeout(() => {
            setIsStartRecord(true);
            setContextMenuVisible(true);
        }, 500);
    }, []);

    const handleTouchMove = useCallback(
        (e) => {
            if (touchStartX !== null) {
                setTouchStartX(e.touches[0].clientX);
            }
        },
        [touchStartX],
    );

    const handleTouchEnd = useCallback(
        (e) => {
            stopRecording();
            clearTimeout(pressTimer.current);
            setIsStartRecord(false);
            setContextMenuVisible(false);
            setTouchStartX(null);
        },
        [isStartRecord],
    );

    const startRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.start();
        }
        // Bắt đầu ghi âm âm thanh
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            mediaRecorderRef.current = new MediaRecorder(stream);

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: 'audio/wav',
                });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = () => {
                    const base64data = reader.result;
                    // console.log(base64data);
                    // const audioUrl = URL.createObjectURL(audioBlob);
                    setAudio(base64data); // Cập nhật state với URL của blob
                };

                audioChunksRef.current = []; // Reset chunks để ghi âm mới
            };

            mediaRecorderRef.current.start(); // Bắt đầu ghi âm
        });
    };

    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop(); // Dừng ghi âm âm thanh
        }
    };

    const closeContextMenu = useCallback(
        () => setContextMenuVisible(false),
        [],
    );

    const base64ToBlob = (base64, mimeType) => {
        const byteString = atob(base64.split(',')[1]); // Loại bỏ phần tiền tố 'data:audio/wav;base64,' nếu có
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: mimeType });
    };

    useEffect(() => {
        if (isStartRecord) {
            console.log('IS START RECORD');
            startRecording();
        }
    }, [isStartRecord]);

    useEffect(() => {
        dispatch(setPostActive(null));
        dispatch(setObjectActive(null));
    }, [window.location.href, dispatch]);

    useEffect(() => {
        if (audio && newMessage) {
            if (handleSend) {
                handleSend(newMessage, audio);
            } else {
                const audioBlob = base64ToBlob(audio, 'audio/wav');
                const audioFile = new File([audioBlob], 'audio-recording.wav', {
                    type: 'audio/wav',
                });
                dispatch(submitPost(newMessage, audioFile, post?.id));
            }
            setAudio(null);
            setNewMessage('');
        }
    }, [audio, newMessage]);

    useEffect(() => {
        audioCurrent?.pause();
    }, [useLocation(), audioCurrent]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'vi-VN'; // 'vi-VN, en-US'
            let newTranscript = '';
            recognition.onresult = (event) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                newTranscript = finalTranscript || interimTranscript;
            };

            recognition.onend = () => {
                setNewMessage(newTranscript);
                // if (newTranscript ) {
                // }
                // if (handleSend) handleSend(newTranscript, audio);
            };

            recognitionRef.current = recognition;
        } else {
            console.log('Web Speech API is not supported in this browser.');
        }
    }, [touchStartX, messageApi, handleSend]);

    useEffect(() => {
        if (!isRunAuto || isFullScreen) {
            if (audioCurrent && !audioCurrent.paused) {
                audioCurrent.pause();
            }
        } else if (isRunAuto && !isFullScreen && object) {
            if (object.audio) {
                if (object.audio === audioCurrent) {
                    if (audioCurrent.paused) {
                        audioCurrent.play();
                    }
                } else {
                    if (audioCurrent && !audioCurrent.paused) {
                        audioCurrent.pause();
                    }

                    const audio = object.audio;

                    audio.playbackRate = isRunSpeed;

                    dispatch(setObjectAudioCurrent(audio));

                    audio.onended = () => {
                        handleScroll(object);
                    };

                    audio.play();
                }
            } else {
                handleScroll(object);
            }
        }
    }, [object, isRunAuto, isFullScreen, audioCurrent, isRunSpeed]);

    useEffect(() => {
        if (audioCurrent) {
            audioCurrent.playbackRate = isRunSpeed;
        }
    }, [audioCurrent, isRunSpeed]);

    const handleScroll = (object) => {
        if (object.element) {
            if (object.parent) {
                const rect = object.element.getBoundingClientRect();

                const parentRect = object.parent.getBoundingClientRect();

                const scrollTop =
                    object.parent.scrollTop + (rect.bottom - parentRect.top); // - 100

                object.parent.scrollTo({
                    top: scrollTop,
                    behavior: 'smooth',
                });
            } else {
                object.element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                });
            }
        }
    };

    return (
        <>
            {contextHolder}
            <div
                className={`z-40 fixed bg-white bottom-0 w-full transition-all duration-500 ${
                    isSwiping
                        ? 'bg-opacity-0'
                        : 'bg-opacity-100 dark:bg-darkPrimary'
                }`}
            >
                <div>
                    <div className="flex justify-between items-center px-6 md:px-10 lg:px-64">
                        {iconsMenu.map((item, i) =>
                            item.name === 'mic' ? (
                                <RecordCover
                                    key={i}
                                    contextMenuVisible={contextMenuVisible}
                                    close={closeContextMenu}
                                    touchStartX={touchStartX}
                                >
                                    <button
                                        onClick={() =>
                                            navigateHandle(item.name)
                                        }
                                        onTouchStart={
                                            isPlay
                                                ? handleTouchStart
                                                : undefined
                                        }
                                        onTouchEnd={
                                            isPlay ? handleTouchEnd : undefined
                                        }
                                        onTouchMove={
                                            isPlay ? handleTouchMove : undefined
                                        }
                                        className={`${
                                            i == 2
                                                ? `z-[30] relative flex justify-center items-center w-[55px] h-[55px] rounded-full bg-black dark:bg-dark2Primary ${
                                                      !isPlay
                                                          ? 'bg-opacity-20'
                                                          : 'bg-opacity-100'
                                                  } mt-[2px] text-white`
                                                : `${
                                                      isSwiping
                                                          ? 'opacity-20'
                                                          : title == item.name
                                                          ? 'opacity-100'
                                                          : 'opacity-20'
                                                  } dark:text-white transition-all duration-500`
                                        }`}
                                    >
                                        {post ? (
                                            <div className="relative">
                                                <Avatar
                                                    src={`https://talkie.transtechvietnam.com/${post.avatar}`}
                                                    className="border-blue-500 border-[5px]"
                                                />
                                                <FaReply className="absolute bottom-1 shadow-2xl -left-0" />
                                            </div>
                                        ) : (
                                            item.icon
                                        )}
                                    </button>
                                </RecordCover>
                            ) : (
                                <button
                                    onClick={() => navigateHandle(item.name)}
                                    key={i}
                                    className={`${
                                        i == 2
                                            ? `z-10 flex justify-center items-center w-[55px] h-[55px] rounded-full bg-black dark:bg-dark2Primary ${
                                                  !isPlay
                                                      ? 'bg-opacity-20'
                                                      : 'bg-opacity-100'
                                              } mt-[2px] text-white`
                                            : `${
                                                  isSwiping
                                                      ? 'opacity-20'
                                                      : title == item.name
                                                      ? 'opacity-100'
                                                      : 'opacity-20'
                                              } dark:text-white transition-all duration-500`
                                    }`}
                                >
                                    {item.icon}
                                </button>
                            ),
                        )}
                    </div>

                    <div
                        className={`flex justify-center gap-2 font-medium text-sm mt-2 mb-5 ${
                            isSwiping || !isPlay ? 'opacity-20' : 'opacity-100'
                        } transition-all duration-500`}
                    >
                        <button
                            onClick={toggleRecordOption('audio')}
                            className={`${
                                recordOption == 'audio'
                                    ? 'text-black dark:text-gray-200'
                                    : 'text-gray-300 dark:text-gray-500'
                            }`}
                        >
                            Audio
                        </button>
                        <button
                            onClick={toggleRecordOption('video')}
                            className={`${
                                recordOption == 'video'
                                    ? 'text-black dark:text-gray-200'
                                    : 'text-gray-300 dark:text-gray-500'
                            }`}
                        >
                            Video
                        </button>
                    </div>
                </div>

                <div
                    className={`absolute left-1/2 top-[-10px] transform -translate-x-1/2 w-[88px] h-[88px] rounded-full border-t-[12px] border-white dark:border-darkPrimary ${
                        isSwiping ? 'opacity-0' : 'opacity-100'
                    } transition-all duration-500`}
                ></div>

                {isPlay && (
                    <div className="absolute bottom-[124px] right-5">
                        {isRunAuto && (
                            <button
                                onClick={() => toggleIsRunSpeed()}
                                className="mb-5 flex justify-center items-center w-[60px] h-[60px] rounded-full bg-white dark:bg-darkPrimary shadow-lg dark:shadow-gray-800"
                            >
                                <div className="text-black dark:text-white">
                                    <span className="font-semibold text-2xl">
                                        {isRunSpeed}
                                    </span>
                                    <span className="font-semibold text-lg">
                                        x
                                    </span>
                                </div>
                            </button>
                        )}
                        <button
                            onClick={() => toggleIsFullScreen()}
                            className="mb-5 flex justify-center items-center w-[60px] h-[60px] rounded-full bg-white dark:bg-darkPrimary shadow-lg dark:shadow-gray-800"
                        >
                            <CgArrowsExpandRight
                                size="1.5rem"
                                className="text-black dark:text-white"
                            />
                        </button>
                        <button
                            onClick={() => toggleIsRunAuto()}
                            className="flex justify-center items-center w-[60px] h-[60px] rounded-full bg-white dark:bg-darkPrimary shadow-lg dark:shadow-gray-800"
                        >
                            {isRunAuto ? (
                                <HiPause
                                    size="1.6rem"
                                    className="text-black dark:text-white"
                                />
                            ) : (
                                <HiMiniPlay
                                    size="1.6rem"
                                    className="text-black dark:text-white"
                                />
                            )}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
