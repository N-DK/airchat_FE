import { RiCloseFill } from 'react-icons/ri';
import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppContext';
import { IoMdMic } from 'react-icons/io';
import { BsChevronExpand } from 'react-icons/bs';
// import { useLocation } from "react-router-dom";
import { submitPost } from '../redux/actions/PostActions';
import { useDispatch, useSelector } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';
import { HiPause } from 'react-icons/hi2';
import { FaArrowUp } from 'react-icons/fa6';
import RecordRTC from 'recordrtc';
import React from 'react';

export default function RecordModal() {
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

    const submitRecordHandle = () => {
        const blob = recorder.getBlob();
        const audioFile = new File([blob], 'audio-recording.wav', {
            type: 'audio/wav',
        });
        dispatch(submitPost(recordContents, audioFile));
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
            recorder.startRecording();
        }
        if (recognition) {
            recognition.start();
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
                </div>

                <div className={`flex justify-center items-center gap-5`}>
                    <div
                        className={`${
                            (audio || video) && recordContents && !permission
                                ? 'w-3/4 md:w-full opacity-100'
                                : 'w-0 opacity-0'
                        } transition-all flex justify-end duration-500`}
                    >
                        {audio && <audio src={audio} controls></audio>}
                        {video && (
                            <video
                                className="w-full h-24 rounded-lg border"
                                src={video}
                                controls
                            ></video>
                        )}
                    </div>

                    <button
                        onClick={() =>
                            (audio || video) && recordContents && !permission
                                ? submitRecordHandle()
                                : permission
                                ? setPermission(!permission)
                                : getMicrophonePermission()
                        }
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
        </div>
    );
}
