import { useEffect } from 'react';

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
    useEffect(() => {
        const contents = contentsChattingRef.current;
        let isScrolling = false;
        let scrollTimeout;
        let scrollInterval;
        const minTime = 2000;
        const maxTime = 6000;
        const timeoutDuration = Math.max(
            minTime,
            maxTime - (isRunSpeed * (maxTime - minTime)) / 3,
        );
        const intervalDuration = timeoutDuration;

        const handleScrollChatting = () => {
            isScrolling = true;
            clearTimeout(scrollTimeout);
            checkPingStates();
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
                checkPingStates();
            }, timeoutDuration);
        };

        const autoScrollToNextItem = () => {
            if (
                currentItemIndex !== null &&
                currentItemIndex < postRefs.current.length - 1
            ) {
                const nextItemIndex = currentItemIndex + 1;
                const nextRef = postRefs.current[nextItemIndex];
                if (nextRef) {
                    contentsChattingRef.current?.scrollTo({
                        top:
                            nextRef.offsetTop -
                            contentsChattingRef.current.offsetTop -
                            60,
                        behavior: 'smooth',
                    });
                }
            }
        };

        if (isRunAuto) {
            handleScrollChatting();
            contents.addEventListener('scroll', handleScrollChatting);
            scrollInterval = setInterval(() => {
                if (!isScrolling && currentItemIndex !== null) {
                    autoScrollToNextItem();
                }
            }, intervalDuration);
        } else {
            setPingStates((prevPingStates) => {
                const newPingStates = { ...prevPingStates };
                Object.keys(newPingStates).forEach((id) => {
                    newPingStates[id] = false;
                });
                return newPingStates;
            });
            clearTimeout(scrollTimeout);
            clearInterval(scrollInterval);
            if (contents) {
                contents.removeEventListener('scroll', handleScrollChatting);
            }
        }
        return () => {
            clearTimeout(scrollTimeout);
            clearInterval(scrollInterval);
            if (contents) {
                contents.removeEventListener('scroll', handleScrollChatting);
            }
        };
    }, [postsList, postRefs, currentItemIndex, isRunAuto, isRunSpeed]);
}
