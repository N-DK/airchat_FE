import React, { useContext } from 'react';
import { AppContext } from '../AppContext';
import { FaAngleLeft } from 'react-icons/fa';
import { FaX } from 'react-icons/fa6';
import { IoSearch } from 'react-icons/io5';

const InviteFriend = () => {
    const { showInviteFriend, toggleShowInviteFriend } = useContext(AppContext);

    return (
        <div
            className={`absolute  left-0 top-0 z-50 w-full h-screen transition-all duration-300 ${
                showInviteFriend ? 'translate-y-0' : 'translate-y-full'
            }`}
        >
            <div className="bg-white dark:bg-dark2Primary h-full">
                <div className="relative px-5 md:px-10 pt-12  flex justify-center items-center py-4 md:py-5 text-lg md:text-[19px] border-b-[1px] border-gray-300">
                    <button
                        className="text-black dark:text-white absolute left-5"
                        onClick={() => toggleShowInviteFriend()}
                    >
                        <FaX className="text-lg md:text-[22px] " />
                    </button>
                    <p className="font-semibold">Invite Friend</p>
                </div>
                <div className="flex flex-col items-center justify-center mt-3">
                    <p className="text-lg md:text-[19px]">
                        Your friends's profile will show you invited them
                    </p>
                </div>
                <div className="flex justify-center pt-5 px-5 bg-white dark:bg-darkPrimary pb-[18px]">
                    <div className="flex gap-3 bg-grayPrimary dark:bg-dark2Primary items-center w-full rounded-full px-6 py-3">
                        <div className="flex items-center justify-center">
                            <IoSearch
                                size="1.5rem"
                                className="text-gray-500 m-0 p-0"
                            />
                        </div>
                        <input
                            className="bg-inherit w-3/5 border-none outline-none text-[17px] text-black dark:text-white placeholder-gray-500"
                            placeholder="Search"
                            type="text"
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center mt-3">
                    <p className="text-xl md:text-[19px] font-semibold mb-2">
                        Add contacts
                    </p>
                    <p className="text-sm text-center md:text-[17px] text-gray-500 w-[50%]">
                        Giving contact permission will allow us to let you
                        invite
                    </p>
                </div>
            </div>
        </div>
    );
};

export default InviteFriend;
