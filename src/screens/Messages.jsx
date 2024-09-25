import { IoSearch } from 'react-icons/io5';
import FooterChat from './../components/FooterChat';
import { HiOutlineUserAdd } from 'react-icons/hi';
import icon from '../assets/Untitled-2.png';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { POST_LIST_RESET } from '../redux/constants/PostConstants';
import React from 'react';

export default function Messages() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: POST_LIST_RESET });
    }, []);

    return (
        <div className="relative flex flex-col justify-between h-screen bg-white dark:bg-dark2Primary">
            <div className="flex flex-col gap-8 items-center pt-12 px-5 dark:bg-darkPrimary border-b-[1px] border-gray-200 pb-6">
                <div className="w-full relative">
                    <h5 className=" col-span-2 text-center text-black dark:text-white">
                        Direct Messages
                    </h5>
                    <button className="col-span-1 absolute right-0 top-0 mr-5 flex justify-end">
                        <HiOutlineUserAdd
                            size="1.5rem"
                            className="text-black dark:text-white"
                        />
                    </button>
                </div>

                <div className="flex gap-3 bg-grayPrimary dark:bg-dark2Primary items-center w-full rounded-full px-6 py-3">
                    <div className="flex items-center justify-center">
                        <IoSearch
                            size="1.5rem"
                            className="text-gray-500 m-0 p-0"
                        />
                    </div>
                    <input
                        className="bg-inherit w-3/5 border-none outline-none text-[17px] text-black dark:text-white placeholder-gray-500"
                        placeholder="Search Conversations"
                        type="text"
                    />
                </div>
            </div>

            <div className="px-5 absolute left-0 top-[200px]">
                <div className="flex items-center gap-3">
                    <img
                        src={icon}
                        className="w-11 h-11 object-cover rounded-full"
                        alt=""
                    />
                    <div>
                        <h5 className="text-black dark:text-gray-300">
                            Note to Self
                        </h5>
                        <span className="text-[16px] text-gray-500">
                            Send a message to yourself
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center mt-14">
                    <h5 className="text-black dark:text-gray-300">
                        No Direct Messages
                    </h5>
                    <span className="text-[16px] text-gray-500 text-center">
                        You can start a private conversation with anyone that
                        follows you
                    </span>
                </div>
            </div>

            <FooterChat title="messages" isSwiping={false} isPlay={false} />
        </div>
    );
}
