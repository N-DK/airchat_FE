import { GoHomeFill } from 'react-icons/go';
import { IoSearch } from 'react-icons/io5';
import { IoMdMic } from 'react-icons/io';
import { MdOutlineNotifications } from 'react-icons/md';
import { HiOutlineMail } from 'react-icons/hi';
import { CgArrowsExpandRight } from 'react-icons/cg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../AppContext';
import { HiPause, HiMiniPlay } from 'react-icons/hi2';
import { IoVideocam } from 'react-icons/io5';
import React from 'react';
import RecordCover from './RecordCover';
import { Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { FaReply } from 'react-icons/fa6';
import { setPostActive, submitPost } from '../redux/actions/PostActions';
import {
    setObjectActive,
    setObjectAudioCurrent,
    setObjectVideoCurrent,
} from '../redux/actions/SurfActions';
import { LANGUAGE } from '../constants/language.constant';
import SpeechRecognition, {
    useSpeechRecognition,
} from 'react-speech-recognition';
import { validateFileSize } from '../utils/validateFileSize.utils';
import { validateBase64Size } from '../utils/validateBase64Size.utils';
import { POST_SUBMIT_RESET } from '../redux/constants/PostConstants';

const NotifyText = ({ message, show }) => {
    return (
        <div
            className={`bg-white z-[99999999] absolute left-1/2 transform -translate-x-1/2 w-auto dark:bg-dark2Primary shadow-2xl rounded-2xl p-3 md:p-5 transition-all duration-500 ${
                show ? 'translate-y-0 mt-3' : '-translate-y-full'
            }`}
        >
            <h6 className="text-black dark:text-white">{message}</h6>
        </div>
    );
};

export default function FooterChat({
    isSwiping,
    title,
    isPlay,
    handleSend,
    setIsTurnOnCamera,
    isInChatRoom,
}) {
    const {
        isRecord,
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
            name: 'search?keyword=',
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
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const redirect = useLocation().search.split('=')[1] || 'trending';
    const pressTimer = useRef();
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [touchStartX, setTouchStartX] = useState(null);
    const [isStartRecord, setIsStartRecord] = useState(false);
    const [audio, setAudio] = useState(null);
    const [video, setVideo] = useState(null);
    const [stream, setStream] = useState(null);
    const [showNotify, setShowNotify] = useState(false);
    const [notifyMessage, setNotifyMessage] = useState('');
    const { post } = useSelector((state) => state.setPostActive);
    const { object } = useSelector((state) => state.setObjectActive);
    const { audioCurrent } = useSelector(
        (state) => state.setObjectAudioCurrent,
    );
    const { videoCurrent } = useSelector(
        (state) => state.setObjectVideoCurrent,
    );
    const { language } = useSelector((state) => state.userLanguage);
    const { transcript, browserSupportsSpeechRecognition, resetTranscript } =
        useSpeechRecognition();
    const { loading, success: newPost } = useSelector(
        (state) => state.postSubmit,
    );
    const startListening = () =>
        SpeechRecognition.startListening({
            continuous: true,
            language,
        });

    const navigateHandle = (name) => {
        if (name == 'mic' && isPlay) {
            toggleIsRecord();
        } else {
            if (name !== 'mic') {
                if (isRunAuto) toggleIsRunAuto();
                navigate(`/${name}`);
            }
        }
    };

    const handleTouchStart = useCallback((e) => {
        setTouchStartX(e.touches[0].clientX);
        pressTimer.current = setTimeout(() => {
            setIsStartRecord(true);
            setContextMenuVisible(true);
        }, 1000);
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
            setContextMenuVisible(false);
            if (setIsTurnOnCamera) setIsTurnOnCamera(false);
        },
        [mediaRecorderRef, stream],
    );

    const startRecording = () => {
        startListening();
        const mediaConstraints =
            recordOption === 'video'
                ? { video: true, audio: true }
                : { audio: true };
        navigator.mediaDevices
            .getUserMedia(mediaConstraints)
            .then((stream) => {
                if (stream) {
                    setStream(stream);
                }
                const mimeType =
                    recordOption === 'video'
                        ? 'video/mp4'
                        : 'audio/mp4;codecs=mp4a.40.2';
                const options = {
                    mimeType: mimeType,
                    audioBitsPerSecond: 128000,
                };
                mediaRecorderRef.current = new MediaRecorder(stream, options);
                mediaRecorderRef.current.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };
                mediaRecorderRef.current.onstop = () => {
                    const audioBlob = new Blob(audioChunksRef.current, {
                        type: mimeType,
                    });
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = () => {
                        const base64data = reader.result;
                        if (recordOption === 'video') {
                            setVideo(base64data);
                        } else {
                            setAudio(base64data);
                        }
                    };
                    audioChunksRef.current = [];
                };
                mediaRecorderRef.current.start();
            })
            .catch((error) => {
                console.error('Error accessing media devices.', error);
            });
    };

    const stopRecording = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        SpeechRecognition.stopListening();

        setIsStartRecord(false);
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

    const handleScroll = (object) => {
        if (object.element) {
            if (object.parent) {
                const rect = object.element.getBoundingClientRect();
                const parentRect = object.parent.getBoundingClientRect();

                const scrollTop =
                    object.parent.scrollTop +
                    (rect.bottom - parentRect.top) +
                    (object?.bonus || 0);

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

    const handleAudioPlayback = async (object) => {
        if (audioCurrent && audioCurrent.playing()) {
            await new Promise((resolve) => {
                audioCurrent.once('pause', () => {
                    resolve();
                });
                audioCurrent?.pause();
            });
        }
        const audio = object?.audio;
        if (audio) {
            audio.volume(1);
            audio.rate(isRunSpeed);
            audio.off('end');
            audio.on('end', () => {
                handleScroll(object);
            });
            dispatch(setObjectAudioCurrent(audio));
            // audio.play();
            // audio.once('play', () => {});
        } else {
            console.error('Audio object is undefined');
        }
    };

    const handleVideoPlayback = async (object) => {
        if (videoCurrent && !videoCurrent.paused) {
            await new Promise((resolve) => {
                videoCurrent.onpause = () => {
                    resolve();
                };
                videoCurrent.pause();
            });
        }
        const video = object?.video;
        if (video) {
            video.controls = false;
            video.playbackRate = isRunSpeed;
            video.playsInline = true;

            video.onended = () => {
                handleScroll(object);
            };

            dispatch(setObjectVideoCurrent(video));
            // video
            //     .play()
            //     .then(() => {
            //     })
            //     .catch((error) => {
            //         console.error('Error playing video:', error);
            //     });
        } else {
            console.error('Video object is undefined');
        }
    };

    useEffect(() => {
        if (newPost && newPost?.id) {
            dispatch({ type: POST_SUBMIT_RESET });
        }
    }, [newPost, dispatch]);

    useEffect(() => {
        if (isStartRecord) {
            if (
                (recordOption == 'video' || post || isInChatRoom) &&
                setIsTurnOnCamera
            ) {
                setIsTurnOnCamera(true);
            }
            setAudio(null);
            setVideo(null);
            resetTranscript();
            startRecording();
        }
    }, [isStartRecord]);

    useEffect(() => {
        dispatch(setPostActive(null));
        dispatch(setObjectActive(null));
    }, [window.location.href, dispatch]);

    useEffect(() => {
        const showError = (message) => {
            setShowNotify(true);
            setNotifyMessage(message);
            setTimeout(() => setShowNotify(false), 1200);
        };

        if (
            (audio || video) &&
            transcript &&
            touchStartX >= window.innerWidth * 0.3 &&
            !isStartRecord &&
            !isRecord
        ) {
            if (handleSend) {
                if (recordOption === 'audio' && !validateBase64Size(audio)) {
                    showError(LANGUAGE[language].FILE_AUDIO_SIZE_ERROR);
                } else if (
                    recordOption === 'video' &&
                    !validateBase64Size(video)
                ) {
                    showError(LANGUAGE[language].FILE_VIDEO_SIZE_ERROR);
                } else {
                    handleSend(transcript, audio || video || null);
                }
            } else {
                let audioFile = null;
                let videoFile = null;

                if (audio) {
                    const audioBlob = base64ToBlob(audio, 'audio/mp3');
                    console.log(audioBlob);
                    audioFile = new File([audioBlob], 'audio-recording.mp3', {
                        type: 'audio/mp3',
                    });
                    console.log(audioFile);
                } else if (video) {
                    const videoBlob = base64ToBlob(video, 'video/mp4');
                    videoFile = new File([videoBlob], 'video-recording.mp4', {
                        type: 'video/mp4',
                    });
                }

                const channel_id = redirect.includes('group-channel')
                    ? redirect.split('/')[1]
                    : redirect.includes('channel')
                    ? redirect.split('/')[2]
                    : null;

                // Kiểm tra kích thước file `File`
                if (audioFile && !validateFileSize(audioFile)) {
                    showError(LANGUAGE[language].FILE_AUDIO_SIZE_ERROR);
                } else if (videoFile && !validateFileSize(videoFile)) {
                    showError(LANGUAGE[language].FILE_VIDEO_SIZE_ERROR);
                } else {
                    dispatch(
                        submitPost(
                            transcript,
                            audioFile,
                            post?.id,
                            null,
                            null,
                            videoFile,
                            channel_id,
                        ),
                    );
                }
            }

            resetTranscript();
            setAudio(null);
            setVideo(null);
        }
    }, [
        audio,
        transcript,
        touchStartX,
        video,
        isStartRecord,
        isRecord,
        window.innerWidth,
    ]);

    useEffect(() => {
        if (touchStartX < window.innerWidth * 0.3 && !isStartRecord) {
            resetTranscript();
            setAudio(null);
            setVideo(null);
        }
    }, [touchStartX, isStartRecord, window.innerWidth]);

    useEffect(() => {
        if (transcript && isStartRecord) setNewMessageFromFooter(transcript);
        else {
            setNewMessageFromFooter('');
            setAudio(null);
            setVideo(null);
        }
    }, [transcript, isStartRecord]);

    // useEffect(() => {
    //     audioCurrent?.pause();
    //     videoCurrent?.pause();
    // }, [audioCurrent, videoCurrent]);

    useEffect(() => {
        const run = async () => {
            if (!isRunAuto || isFullScreen) {
                if (
                    (audioCurrent && audioCurrent.playing()) ||
                    (videoCurrent && !videoCurrent.paused)
                ) {
                    audioCurrent?.pause();
                    videoCurrent?.pause();
                }
            } else if (isRunAuto && !isFullScreen && object) {
                if (object?.audio) {
                    if (object?.audio?._src === audioCurrent?._src) {
                        if (!audioCurrent.playing()) {
                            audioCurrent.play();
                        }
                    } else {
                        await handleAudioPlayback(object);
                    }
                } else if (object?.video) {
                    if (object?.video.src === videoCurrent.src) {
                        if (videoCurrent?.paused) {
                            videoCurrent?.play();
                        }
                    } else {
                        await handleVideoPlayback(object);
                    }
                } else {
                    handleScroll(object);
                }
            }
        };
        run();
    }, [
        object,
        isRunAuto,
        isFullScreen,
        audioCurrent,
        isRunSpeed,
        videoCurrent,
    ]);

    useEffect(() => {
        if (audioCurrent) {
            audioCurrent.rate(isRunSpeed);
        } else if (videoCurrent) {
            videoCurrent.playbackRate = isRunSpeed;
        }
    }, [audioCurrent, isRunSpeed, videoCurrent]);

    return (
        <>
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
                                                          : item.name.includes(
                                                                title,
                                                            )
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
                                                      : item.name.includes(
                                                            title,
                                                        )
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
                            {LANGUAGE[language].AUDIO}
                        </button>
                        <button
                            onClick={toggleRecordOption('video')}
                            className={`${
                                recordOption == 'video'
                                    ? 'text-black dark:text-gray-200'
                                    : 'text-gray-300 dark:text-gray-500'
                            }`}
                        >
                            {LANGUAGE[language].VIDEO}
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
            <NotifyText message={notifyMessage} show={showNotify} />
        </>
    );
}
