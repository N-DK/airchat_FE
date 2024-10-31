import { useEffect, useRef, useCallback } from 'react';

export function useAutoScroll(
    contentsChattingRef,
    postRefs,
    currentItemIndex,
    isRunAuto,
    isRunSpeed,
    checkPingStates,
    setPingStates,
    postsList,
) {
    const audioRef = useRef(null);
    const scrollTimeoutRef = useRef(null);
    const scrollIntervalRef = useRef(null);

    const handleScrollChatting = useCallback(() => {
        const minTime = 2000;
        const maxTime = 6000;
        const timeoutDuration = Math.max(
            minTime,
            maxTime - (isRunSpeed * (maxTime - minTime)) / 3,
        );

        clearTimeout(scrollTimeoutRef.current);
        checkPingStates();
        scrollTimeoutRef.current = setTimeout(() => {
            checkPingStates();
        }, timeoutDuration);
    }, [isRunSpeed, checkPingStates]);

    const playAudio = useCallback(
        (index) => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            if (postsList[index] && postsList[index].audio) {
                const audioUrl = postsList[index].audio.startsWith('/')
                    ? postsList[index].audio.slice(1)
                    : postsList[index].audio;

                audioRef.current = new Howl({
                    src: [`https://talkie.transtechvietnam.com/${audioUrl}`],
                    html5: true,
                });
                audioRef.current.rate(isRunSpeed);
                audioRef.current.play();
                audioRef.current.on('end', () => {
                    autoScrollToNextItem(index + 1);
                });
            } else {
                autoScrollToNextItem(index + 1);
            }
        },
        [postsList, isRunSpeed],
    );

    const autoScrollToNextItem = useCallback(
        (nextItemIndex) => {
            if (
                nextItemIndex !== null &&
                nextItemIndex < postRefs.current.length
            ) {
                const nextRef = postRefs.current[nextItemIndex];
                if (nextRef && contentsChattingRef.current) {
                    contentsChattingRef.current.scrollTo({
                        top:
                            nextRef.offsetTop -
                            contentsChattingRef.current.offsetTop -
                            60,
                        behavior: 'smooth',
                    });
                    if (
                        postsList[nextItemIndex] &&
                        postsList[nextItemIndex].audio
                    ) {
                        playAudio(nextItemIndex);
                    } else {
                        autoScrollToNextItem(nextItemIndex + 1);
                    }
                }
            }
        },
        [postRefs, contentsChattingRef, playAudio, postsList],
    );

    useEffect(() => {
        if (postsList && postsList.length > 0) {
            const contents = contentsChattingRef.current;

            if (isRunAuto) {
                handleScrollChatting();
                contents?.addEventListener('scroll', handleScrollChatting);
                if (
                    postsList[currentItemIndex] &&
                    postsList[currentItemIndex].audio
                ) {
                    playAudio(currentItemIndex);
                } else {
                    autoScrollToNextItem(currentItemIndex);
                }
            } else {
                setPingStates((prevPingStates) => {
                    const newPingStates = { ...prevPingStates };
                    Object.keys(newPingStates).forEach((id) => {
                        newPingStates[id] = false;
                    });
                    return newPingStates;
                });
                clearTimeout(scrollTimeoutRef.current);
                clearInterval(scrollIntervalRef.current);
                contents?.removeEventListener('scroll', handleScrollChatting);
                audioRef.current?.pause();
            }

            return () => {
                clearTimeout(scrollTimeoutRef.current);
                clearInterval(scrollIntervalRef.current);
                contents?.removeEventListener('scroll', handleScrollChatting);
                audioRef.current?.pause();
            };
        }
    }, [
        isRunAuto,
        currentItemIndex,
        handleScrollChatting,
        playAudio,
        setPingStates,
        postsList,
        autoScrollToNextItem,
    ]);
}
