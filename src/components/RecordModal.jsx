import { RiCloseFill } from 'react-icons/ri';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppContext';
import { IoMdLink, IoMdMic } from 'react-icons/io';
import { BsChevronExpand } from 'react-icons/bs';
// import { useLocation } from "react-router-dom";
import { submitPost } from '../redux/actions/PostActions';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';
import { HiPause } from 'react-icons/hi2';
import { FaArrowUp } from 'react-icons/fa6';
import RecordRTC from 'recordrtc';
import React from 'react';
import ModalDelete from './ModalDelete';
import SoundWave from './SoundWave';
import { LuImagePlus } from 'react-icons/lu';
import { GoMention } from 'react-icons/go';

export default function RecordModal({ handle }) {
    const { isRecord, toggleIsRecord, recordOption } = useContext(AppContext);
    // const redirect = useLocation().search.split("=")[1] || "trending";
    const dispatch = useDispatch();
    const postSubmit = useSelector((state) => state.postSubmit);
    const { loading } = postSubmit;
    const [permission, setPermission] = useState(false);
    const [audio, setAudio] = useState(null);
    const [video, setVideo] = useState(null);
    const [recordContents, setRecordContents] = useState('');
    const [recorder, setRecorder] = useState(null);
    const [stream, setStream] = useState(null);
    const [recognition, setRecognition] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isAllow, setIsAllow] = useState(false);
    const [duration, setDuration] = useState(0);

    const submitRecordHandle = () => {
        const blob = recorder.getBlob();
        const audioFile = new File([blob], 'audio-recording.wav', {
            type: 'audio/wav',
        });
        if (handle) {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                const base64data = reader.result;
                handle(recordContents, base64data);
                if (isRecord) toggleIsRecord();
            };
        } else {
            dispatch(submitPost(recordContents, audioFile));
        }
    };

    const getMicrophonePermission = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const streamRecord = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: recordOption === 'video',
                });
                const recordRTC = new RecordRTC(streamRecord, {
                    type: recordOption,
                });
                setStream(streamRecord);
                setRecorder(recordRTC);
                setPermission(true);
            } catch (err) {
                alert(err.message);
            }
        } else {
            alert('The MediaRecorder API is not supported in your browser.');
        }
    };

    const startRecordingHandle = () => {
        if (recorder) {
            recorder?.startRecording();
        }
        if (recognition) {
            recognition?.start();
        }
    };

    const stopRecordingHandle = () => {
        if (recorder) {
            recorder.stopRecording(() => {
                const fileBlob = recorder.getBlob();
                if (recordOption === 'audio') {
                    const audioUrl = URL.createObjectURL(fileBlob);
                    setAudio(audioUrl);
                } else {
                    const videoUrl = URL.createObjectURL(fileBlob);
                    setVideo(videoUrl);
                }
            });
        }
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        if (recognition) {
            recognition.stop();
        }
    };

    const handleAllow = () => {
        setIsAllow(true);
    };

    useEffect(() => {
        if (permission) {
            startRecordingHandle();
        } else {
            stopRecordingHandle();
        }
    }, [permission]);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            const rec = new SpeechRecognition();
            rec.continuous = true;
            rec.interimResults = true;
            rec.lang = 'vi-VN';
            rec.onresult = (event) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcriptPart = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcriptPart + ' ';
                    } else {
                        finalTranscript += transcriptPart;
                    }
                }
                setRecordContents(finalTranscript);
            };
            setRecognition(rec);
        } else {
            alert('Web Speech API is not supported in your browser. ');
        }
    }, []);

    useEffect(() => {
        if (!isRecord) {
            setPermission(false);
        }
        setRecordContents('');
        setAudio(null);
        setVideo(null);
    }, [isRecord]);

    useEffect(() => {
        if (!loading) {
            if (isRecord) toggleIsRecord();
        }
    }, [loading]);

    useEffect(() => {
        if (audio) {
            const audioElement = new Audio(audio);

            // Xử lý sự kiện khi metadata được tải thành công
            const handleLoadedMetadata = () => {
                setDuration(audioElement.duration); // Cập nhật duration khi metadata có sẵn
                setAudio(audioElement);
            };

            // Lắng nghe sự kiện 'loadedmetadata'
            audioElement.addEventListener(
                'loadedmetadata',
                handleLoadedMetadata,
            );

            // Xử lý lỗi nếu tệp âm thanh không hợp lệ
            audioElement.addEventListener('error', () => {
                console.error("Audio file couldn't be loaded.");
            });

            // Cleanup sự kiện khi component unmount
            return () => {
                audioElement.removeEventListener(
                    'loadedmetadata',
                    handleLoadedMetadata,
                );
            };
        }
    }, [audio]);

    const formatTime = (lengthInSeconds) => {
        const minutes = Math.floor(lengthInSeconds / 60);
        const seconds = lengthInSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div
            className={`absolute left-0 bottom-0 z-50 w-full h-1/2 ${
                isRecord ? 'translate-y-0' : 'translate-y-[200vh]'
            } transition-all duration-300`}
        >
            <div className="flex flex-col justify-between backdrop-blur-2xl px-6 pt-6 pb-9 md:p-10 bg-white/50 h-full rounded-t-3xl">
                <div className="text-bluePrimary flex justify-between items-center">
                    <div className="flex gap-2 items-end">
                        {/* <div className="flex gap-2">
                            <span className="text-xl">To</span>
                            <span className="text-xl font-semibold">
                                Following
                            </span>
                        </div>
                        <BsChevronExpand size="1.6rem" /> */}
                    </div>
                    <RiCloseFill onClick={() => toggleIsRecord()} size="2rem" />
                </div>

                <div className="bg-bluePrimary rounded-3xl h-32 flex flex-col justify-between items-start px-4 py-3 shadow-md">
                    <textarea
                        value={recordContents}
                        onChange={(e) => setRecordContents(e.target.value)}
                        readOnly={!recordContents}
                        className="w-full bg-inherit text-white placeholder-white outline-none"
                        placeholder="Tap the microphone to record..."
                        cols="30"
                        rows="10"
                    ></textarea>
                    <div className="flex items-center mt-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <LuImagePlus className="dark:text-white mr-2" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <IoMdLink
                                className="dark:text-white mr-2"
                                size={20}
                            />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <GoMention className="dark:text-white mr-2" />
                        </button>
                    </div>
                </div>

                <div className={`flex justify-center items-center gap-5`}>
                    <div
                        className={`${
                            (audio || video) && recordContents && !permission
                                ? 'md:w-full opacity-100'
                                : 'w-0 opacity-0'
                        } transition-all flex justify-end duration-500`}
                    >
                        {audio && (
                            <div className="relative w-full">
                                <SoundWave play={true} color="white" />
                                {/* <span className="absolute -top-8 left-0 text-bluePrimary text-lg">
                                    {formatTime(duration)} Actions
                                </span> */}
                            </div>
                        )}
                        {video && (
                            <video
                                className="w-full h-24 rounded-lg border"
                                src={video}
                                controls
                            ></video>
                        )}
                    </div>

                    <button
                        onClick={() => {
                            if (isAllow) {
                                if (
                                    (audio || video) &&
                                    recordContents &&
                                    !permission
                                ) {
                                    submitRecordHandle();
                                } else if (permission) {
                                    setPermission(!permission);
                                } else {
                                    getMicrophonePermission();
                                }
                            } else {
                                setIsOpen(true);
                            }
                        }}
                        className="relative flex justify-center items-center min-w-[56px] h-[56px] bg-bluePrimary text-white rounded-full shadow-md"
                    >
                        {loading ? (
                            <LoadingSpinner color="white" />
                        ) : (audio || video) &&
                          recordContents &&
                          !permission ? (
                            <FaArrowUp size="1.5rem" />
                        ) : permission ? (
                            <div className="absolute rounded-full p-5 border-[4px] border-bluePrimary">
                                <HiPause size="1.8rem" />
                            </div>
                        ) : (
                            <IoMdMic size="1.8rem" />
                        )}
                    </button>
                </div>
            </div>
            <ModalDelete
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                title="Allow Microphone Access"
                subTitle="Please allow microphone access to record audio for voice commands and messages."
                handle={handleAllow}
                buttonOKText="Allow"
                buttonOKColor="bg-dark2Primary"
            />
        </div>
    );
}
