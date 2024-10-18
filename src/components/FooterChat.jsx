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

export default function FooterChat({
    isSwiping,
    title,
    isPlay,
    handleSend,
    setIsTurnOnCamera,
}) {
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
        setNewMessageFromFooter,
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
    const [video, setVideo] = useState(null);
    const [stream, setStream] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const recognitionRef = useRef(null);
    const { post } = useSelector((state) => state.setPostActive);
    const { object } = useSelector((state) => state.setObjectActive);
    const { audioCurrent } = useSelector(
        (state) => state.setObjectAudioCurrent,
    );
    const { videoCurrent } = useSelector(
        (state) => state.setObjectVideoCurrent,
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
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
            clearTimeout(pressTimer.current);
            setIsStartRecord(false);
            setContextMenuVisible(false);
            if (setIsTurnOnCamera) setIsTurnOnCamera(false);
        },
        [isStartRecord, recognitionRef, mediaRecorderRef, stream],
    );

    const startRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.start(); // Bắt đầu nhận diện giọng nói nếu có
        }

        // Thiết lập ràng buộc cho việc ghi âm
        const mediaConstraints =
            recordOption === 'video'
                ? { video: true, audio: true } // Nếu chọn video, ghi cả video và âm thanh
                : { audio: true }; // Nếu chỉ chọn âm thanh, chỉ ghi âm thanh

        // Lấy quyền truy cập vào thiết bị ghi âm
        navigator.mediaDevices
            .getUserMedia(mediaConstraints)
            .then((stream) => {
                if (stream) {
                    setStream(stream); // Lưu trữ stream vào state
                }

                mediaRecorderRef.current = new MediaRecorder(stream); // Khởi tạo MediaRecorder với stream

                // Lưu trữ các đoạn âm thanh/video khi có dữ liệu
                mediaRecorderRef.current.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data); // Thêm dữ liệu vào mảng
                };

                // Khi dừng ghi âm
                mediaRecorderRef.current.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, {
                        type:
                            recordOption === 'video'
                                ? 'video/webm'
                                : 'audio/wav', // Thiết lập loại blob
                    });
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob); // Đọc blob dưới dạng URL
                    reader.onloadend = () => {
                        const base64data = reader.result; // Lưu trữ dữ liệu base64

                        if (recordOption === 'video') {
                            // Xử lý video nếu cần
                            setVideo(base64data); // Lưu video vào state
                        } else {
                            setAudio(base64data); // Lưu âm thanh vào state
                        }
                    };

                    audioChunksRef.current = []; // Xóa mảng sau khi ghi xong
                };

                mediaRecorderRef.current.start(); // Bắt đầu ghi âm
            })
            .catch((error) => {
                console.error('Error accessing media devices.', error); // Xử lý lỗi nếu không thể truy cập thiết bị
            });
    };

    const stopRecording = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }

        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    };

    const closeContextMenu = useCallback(
        () => setContextMenuVisible(false),
        [],
    );

    const base64ToBlob = (base64, mimeType) => {
        const byteString = atob(base64.split(',')[1]);
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
            if ((recordOption == 'video' || post) && setIsTurnOnCamera) {
                setIsTurnOnCamera(true);
            }
            startRecording();
        }
    }, [isStartRecord]);

    useEffect(() => {
        dispatch(setPostActive(null));
        dispatch(setObjectActive(null));
    }, [window.location.href, dispatch]);

    useEffect(() => {
        if ((audio || video) && newMessage && touchStartX >= 120) {
            if (handleSend) {
                handleSend(newMessage, audio);
            } else {
                let audioFile = null;
                let videoFile = null;
                if (audio) {
                    const audioBlob = base64ToBlob(audio, 'audio/wav');
                    audioFile = new File([audioBlob], 'audio-recording.wav', {
                        type: 'audio/wav',
                    });
                } else if (video) {
                    const videoBlob = base64ToBlob(video, 'video/webm');
                    videoFile = new File([videoBlob], 'video-recording.webm', {
                        type: 'video/webm',
                    });
                }

                dispatch(
                    submitPost(
                        newMessage,
                        audioFile,
                        post?.id,
                        null,
                        null,
                        videoFile,
                    ),
                );
            }
            setAudio(null);
            setNewMessage('');
            setNewMessageFromFooter('');
        }
    }, [audio, newMessage, touchStartX, video]);

    useEffect(() => {
        audioCurrent?.pause();
        videoCurrent?.pause();
    }, [useLocation(), audioCurrent, videoCurrent]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
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
                setNewMessageFromFooter(newTranscript);
            };

            recognition.onend = () => {
                setNewMessage(newTranscript);
                setNewMessageFromFooter('');
            };

            recognitionRef.current = recognition;
        } else {
            console.log('Web Speech API is not supported in this browser.');
        }
    }, []);

    useEffect(() => {
        if (!isRunAuto || isFullScreen) {
            if (
                (audioCurrent && !audioCurrent.paused) ||
                (videoCurrent && !videoCurrent.paused)
            ) {
                audioCurrent?.pause();
                videoCurrent?.pause();
            }
        } else if (isRunAuto && !isFullScreen && object) {
            if (object.audio) {
                if (object.audio === audioCurrent) {
                    if (audioCurrent?.paused) {
                        audioCurrent.play();
                    }
                } else {
                    if (audioCurrent && !audioCurrent?.paused) {
                        audioCurrent?.pause();
                    }

                    const audio = object.audio;

                    audio.playbackRate = isRunSpeed;

                    dispatch(setObjectAudioCurrent(audio));

                    audio.onended = () => {
                        handleScroll(object);
                    };

                    audio.play();
                }
            } else if (object.video) {
                if (object.video === videoCurrent) {
                    if (videoCurrent?.paused) {
                        videoCurrent?.play();
                    }
                } else {
                    if (videoCurrent && !videoCurrent.paused) {
                        videoCurrent.pause();
                    }

                    const video = object.video;

                    video.playbackRate = isRunSpeed;

                    dispatch(setObjectAudioCurrent(video));

                    video.onended = () => {
                        handleScroll(object);
                    };

                    video.play();
                }
            } else {
                handleScroll(object);
            }
        }
    }, [object, isRunAuto, isFullScreen, audioCurrent, isRunSpeed]);

    useEffect(() => {
        if (audioCurrent) {
            audioCurrent.playbackRate = isRunSpeed;
        } else if (videoCurrent) {
            videoCurrent.playbackRate = isRunSpeed;
        }
    }, [audioCurrent, isRunSpeed, videoCurrent]);

    const handleScroll = (object) => {
        if (object.element) {
            if (object.parent) {
                const rect = object.element.getBoundingClientRect();

                const parentRect = object.parent.getBoundingClientRect();

                const scrollTop =
                    object.parent.scrollTop +
                    (rect.bottom - parentRect.top) +
                    (object?.bonus || 0); // - 100

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
                                                <p className="absolute top-0 left-0 opacity-0 z-10 w-full h-full rounded-full"></p>
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
