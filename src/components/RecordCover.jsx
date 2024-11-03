import React, { useContext, useEffect, useState, useMemo } from 'react';
import { RiArrowLeftSLine, RiDeleteBin6Line } from 'react-icons/ri';
import { FaAnglesLeft } from 'react-icons/fa6';

function RecordCover({ children, contextMenuVisible, close, touchStartX }) {
    const [progress, setProgress] = useState(0);

    const [dimensions, setDimensions] = useState({
        minX: window.innerWidth * 0.1,
        maxX: window.innerWidth * 0.3,
    });

    const buttonClassName = useMemo(() => {
        return `animation-surf-left ml-4 w-12 h-12 bg-red-500 flex items-center justify-center rounded-full transition-all duration-300 ${
            touchStartX < dimensions.maxX && touchStartX > dimensions.minX
                ? 'scale-125'
                : ''
        }`;
    }, [touchStartX, dimensions]);

    useEffect(() => {
        if (contextMenuVisible) {
            setProgress(0);
        }
    }, [contextMenuVisible]);

    useEffect(() => {
        let timer;
        if (progress < 100 && contextMenuVisible) {
            timer = setInterval(() => {
                setProgress((prev) => Math.min(prev + 1, 100));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [progress, contextMenuVisible]);

    return (
        <div className="relative z-50">
            <div>{children}</div>
            {contextMenuVisible && (
                <div className="absolute bg-black/30 w-[300px] rounded-full h-[130%] py-4 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
                    <div className="flex relative items-center h-full">
                        <button onClick={close} className={buttonClassName}>
                            <RiDeleteBin6Line
                                className="text-white"
                                size={26}
                            />
                        </button>
                        <FaAnglesLeft
                            size={24}
                            className="text-white ml-4 mr-4 animation-surf-left"
                        />
                        <div className="absolute left-1/2 -translate-x-1/2">
                            <div className="w-16 h-16 rounded-full relative transition-all duration-300">
                                <svg
                                    className="w-full h-full"
                                    viewBox="0 0 36 36"
                                >
                                    <path
                                        d="M18 2.0845
                                           a 15.9155 15.9155 0 0 1 0 31.831
                                           a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="4"
                                        strokeDasharray={`${progress}, 100`}
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default React.memo(RecordCover);
