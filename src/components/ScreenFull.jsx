import { useContext, useRef } from 'react';
import { CgCompressRight } from 'react-icons/cg';
import { HiPause, HiMiniPlay } from 'react-icons/hi2';
import { AppContext } from '../AppContext';
import SoundWave from './SoundWave';
import { usePingStates } from '../hooks/usePingStates';
import React from 'react';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { Avatar } from 'antd';

const BASE_URL = 'https://talkie.transtechvietnam.com/';

export default function ScreenFull({ postsList }) {
    const contentsChattingRef = useRef(null);
    const postRefs = useRef([]);
    const {
        isRunAuto,
        isRunSpeed,
        toggleIsRunAuto,
        toggleIsRunSpeed,
        toggleIsFullScreen,
    } = useContext(AppContext);

    const { pingStates, setPingStates, checkPingStates, currentItemIndex } =
        usePingStates(postsList, postRefs);

    useAutoScroll(
        contentsChattingRef,
        postRefs,
        currentItemIndex,
        isRunAuto,
        isRunSpeed,
        checkPingStates,
        setPingStates,
        postsList,
    );

    return (
        <div className="z-50 h-full w-full fixed right-0 top-0">
            <div
                ref={contentsChattingRef}
                className="overflow-auto scrollbar-none h-full"
            >
                {postsList.map((item, i) => (
                    <div
                        key={i}
                        ref={(el) => (postRefs.current[i] = el)}
                        className="relative border-b-[7px] py-24 px-10 md:py-36 md:px-20 border-gray-800"
                    >
                        <div className="grid grid-cols-2 items-center relative z-10">
                            <div className="col-span-1">
                                <Avatar
                                    src={`${BASE_URL}${item.avatar}`}
                                    className="w-[120px] h-[120px] md:w-[220px] md:h-[220px] object-cover rounded-full"
                                    alt=""
                                />
                            </div>
                            <div className="col-span-1">
                                <h3 className="text-white line-clamp-1 md:text-6xl">
                                    {item.name}
                                </h3>
                                <h4 className="text-white line-clamp-1 md:text-4xl">
                                    {item.userName}
                                </h4>
                            </div>
                            <div className="col-span-2 w-full my-16 md:my-20 min-h-9 md:min-h-16 flex items-center justify-center">
                                <SoundWave
                                    play={pingStates[item._id]}
                                    color="white"
                                />
                            </div>
                            <h4 className="col-span-2 text-white line-clamp-4 md:text-4xl">
                                {item.contents}
                            </h4>
                        </div>

                        <img
                            src={item.avatar}
                            className="absolute top-0 left-0 h-full w-full object-cover"
                            alt=""
                        />
                        <div className="absolute top-0 left-0 h-full w-full backdrop-blur-xl bg-black/30"></div>
                    </div>
                ))}
            </div>

            <div className="z-10 fixed bottom-[125px] right-5">
                {isRunAuto && (
                    <button
                        onClick={() => toggleIsRunSpeed()}
                        className="mb-5 flex justify-center items-center w-[60px] h-[60px] rounded-full bg-darkPrimary shadow-lg"
                    >
                        <div className="text-white">
                            <span className="font-semibold text-2xl">
                                {isRunSpeed}
                            </span>
                            <span className="font-semibold text-lg">x</span>
                        </div>
                    </button>
                )}
                <button
                    onClick={() => toggleIsFullScreen()}
                    className="mb-5 flex justify-center items-center w-[60px] h-[60px] rounded-full bg-darkPrimary shadow-lg"
                >
                    <CgCompressRight size="1.5rem" color="#fff" />
                </button>
                <button
                    onClick={() => toggleIsRunAuto()}
                    className="pl-[4px] flex justify-center items-center w-[60px] h-[60px] rounded-full bg-darkPrimary shadow-lg"
                >
                    {isRunAuto ? (
                        <HiPause size="1.6rem" color="#fff" />
                    ) : (
                        <HiMiniPlay size="1.6rem" color="#fff" />
                    )}
                </button>
            </div>
        </div>
    );
}
