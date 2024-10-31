import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppContext';
import { RiArrowLeftSLine, RiDeleteBin6Line } from 'react-icons/ri';
import { FaAnglesLeft } from 'react-icons/fa6';

function RecordCover({ children, contextMenuVisible, close, touchStartX }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (contextMenuVisible) {
            setProgress(0);
        }
    }, [contextMenuVisible]);

    useEffect(() => {
        let timer;
        if (progress < 100) {
            timer = setInterval(() => {
                setProgress((prev) => Math.min(prev + 1, 100));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [, progress]);

    return (
        <div className="relative z-50">
            <div>{children}</div>
            {contextMenuVisible && (
                <div className="absolute bg-black/70 w-[300px] rounded-full h-[130%] py-4 left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
                    <div className="flex relative items-center h-full">
                        <button
                            onClick={close}
                            className={`ml-10 transition-all duration-300 ${
                                touchStartX < 120 && touchStartX > 100
                                    ? 'scale-150'
                                    : ''
                            }`}
                        >
                            <RiDeleteBin6Line
                                className="text-red-500 "
                                size={26}
                            />
                        </button>
                        <FaAnglesLeft size={24} className="text-white ml-4" />
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

export default RecordCover;
