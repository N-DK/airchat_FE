import { useEffect, useCallback, useRef, useState } from 'react';
import { Howl } from 'howler';
import { setObjectActive } from '../redux/actions/SurfActions';

const useMediaHandler = ({
    item,
    isRunAuto,
    isFullScreen,
    isVisible,
    isRunSpeed,
    dispatch,
    contentsChattingRef,
    setPostActive,
    bonusHeight = 0,
}) => {
    const [data, setData] = useState(item);
    const audioRef = useRef(null);
    const videoRef = useRef(null);
    const postItemRef = useRef(null);

    const handleScroll = useCallback((object) => {
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
    }, []);

    const handleVideo = useCallback(() => {
        if (!isRunAuto || isFullScreen) {
            if (!videoRef?.current?.paused) {
                videoRef?.current?.pause();
            }
        } else {
            if (videoRef?.current?.paused) {
                videoRef.current.playbackRate = isRunSpeed;
                videoRef?.current?.play();
            }
        }
    }, [isRunAuto, isFullScreen, isRunSpeed]);

    const handleAudio = useCallback(() => {
        if (!isRunAuto || isFullScreen) {
            if (audioRef?.current?.playing()) {
                audioRef?.current?.pause();
            }
        } else {
            if (!audioRef?.current?.playing()) {
                audioRef.current.rate(isRunSpeed);
                audioRef?.current?.play();
            }
        }
    }, [isRunAuto, isFullScreen, isRunSpeed]);

    const handlePause = useCallback(() => {
        if (data?.video && data?.video !== '0') {
            videoRef?.current?.pause();
        } else {
            if (audioRef?.current?.playing()) {
                audioRef.current.pause();
            }
        }
    }, [data]);

    const initAudio = useCallback(() => {
        if (
            item?.audio &&
            item?.audio != 0 &&
            !audioRef?.current?._src.includes(item.audio)
        ) {
            let audioSrc = '';
            if (item.audio.startsWith('blob:')) {
                audioSrc = item.audio;
            } else if (item.audio.startsWith('/')) {
                audioSrc = `https://talkie.transtechvietnam.com${item.audio}`;
            } else {
                audioSrc = `https://talkie.transtechvietnam.com/${item.audio}`;
            }

            audioRef.current = new Howl({
                src: [audioSrc],
                html5: true,
            });
            audioRef.current.volume(1);
            audioRef.current.on('end', () => {
                handleScroll({
                    element: postItemRef.current,
                    parent: contentsChattingRef?.current,
                    bonus: bonusHeight,
                });
            });
        }
    }, [item?.audio, handleScroll, audioRef]);

    const initVideo = useCallback(() => {
        if (!videoRef?.current) return;

        const video = videoRef.current;
        video.controls = false;
        video.playsInline = true;
        video.onended = () => {
            handleScroll({
                element: postItemRef.current,
                parent: contentsChattingRef?.current,
            });
        };
    }, [handleScroll]);

    useEffect(() => {
        if (!item && isRunAuto) {
            handleScroll({
                element: postItemRef.current,
                parent: contentsChattingRef?.current,
            });
            return;
        }

        setData(item);
    }, [item, handleScroll, isRunAuto]);

    useEffect(() => {
        initAudio();
    }, [isVisible, isRunAuto, initAudio]);

    useEffect(() => {
        initVideo();
    }, [initVideo, isRunAuto, isVisible]);

    useEffect(() => {
        if (audioRef?.current) {
            audioRef.current.rate(isRunSpeed);
        } else if (videoRef?.current) {
            videoRef.current.playbackRate = isRunSpeed;
        }
    }, [isRunSpeed]);

    useEffect(() => {
        if (isVisible && postItemRef.current) {
            if (navigator.vibrate) {
                navigator.vibrate(100);
            } else {
                console.log('Thiết bị không hỗ trợ rung.');
            }

            if (setPostActive) {
                dispatch(setPostActive(data));
            }

            dispatch(
                setObjectActive({
                    post: null,
                    audio: audioRef?.current,
                    element: postItemRef.current,
                    parent: contentsChattingRef?.current,
                    video: !!data?.video,
                    bonus: bonusHeight,
                }),
            );

            if (data?.video && data?.video !== '0') {
                handleVideo();
            } else {
                handleAudio();
            }
        } else {
            handlePause();
        }

        return () => {
            handlePause();
        };
    }, [isVisible, data?.id, isRunAuto, isFullScreen, dispatch, setPostActive]);

    return { videoRef, postItemRef };
};

export default useMediaHandler;
