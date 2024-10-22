import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { FaAngleLeft } from 'react-icons/fa';
import { AppContext } from '../AppContext';
import { IoCloseOutline, IoSearch } from 'react-icons/io5';
import useDebounce from '../hooks/useDebounce';
import LoadingSpinner from './LoadingSpinner';
import { searchUser } from '../redux/actions/MessageAction';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { LANGUAGE } from '../constants/language.constant';

const UserSearchItem = ({ user, handleClick }) => {
    return (
        <div onClick={handleClick} className="flex items-center py-2">
            <figure className="mr-3">
                <Avatar
                    size={40}
                    src={`https://talkie.transtechvietnam.com/${user?.image}`}
                />
            </figure>
            <div>
                <p className="dark:text-white text-lg ">{user?.name}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {user?.username}
                </p>
            </div>
        </div>
    );
};

const DrawerNewDirect = ({}) => {
    const { showDrawerNewDirect, toggleShowDrawerNewDirect } =
        useContext(AppContext);
    const [searchText, setSearchText] = useState('');
    const [result, setResult] = useState([]);
    const debouncedSearch = useDebounce(searchText, 500);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { users, loading } = useSelector((state) => state.searchUser);
    const { language } = useSelector((state) => state.userLanguage);

    const handleClick = (user) => {
        navigate(`/messages/t/${user?.id}`, { state: { user } });
    };

    useEffect(() => {
        setResult(users);
    }, [users]);

    useEffect(() => {
        if (debouncedSearch) {
            dispatch(searchUser(debouncedSearch));
        } else {
            setResult([]);
        }
    }, [debouncedSearch]);

    return (
        <div
            className={`absolute left-0 top-0 z-50 w-full h-screen transition-all duration-300 ${
                showDrawerNewDirect ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
            <div className="bg-white dark:bg-dark2Primary h-full">
                <div className="relative dark:bg-darkPrimary dark:border-darkPrimary px-5 md:px-10 flex justify-center items-center pt-10 pb-6 md:py-5 text-lg md:text-[19px] border-b-[1px] border-gray-300">
                    <button
                        className="text-black dark:text-white absolute left-4"
                        onClick={toggleShowDrawerNewDirect}
                    >
                        <FaAngleLeft className="text-lg md:text-[22px]" />
                    </button>
                    <div className="text-black dark:text-white font-semibold">
                        {LANGUAGE[language].NEW_DIRECT_MESSAGE}
                    </div>
                </div>
                <div className="w-[90%] mx-auto relative mt-4 flex bg-grayPrimary dark:bg-darkPrimary items-center rounded-full px-6 py-3">
                    <div className="flex items-center justify-center">
                        <IoSearch
                            size="1.5rem"
                            className="text-gray-500 m-0 p-0 mr-2"
                        />
                    </div>
                    <input
                        className="bg-inherit w-full border-none outline-none text-[17px] text-black dark:text-white placeholder-gray-500"
                        placeholder={LANGUAGE[language].SEARCH_CONVERSATION}
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2">
                        {debouncedSearch &&
                            (!loading ? (
                                <button onClick={() => setSearchText('')}>
                                    <IoCloseOutline className="text-black dark:text-white" />
                                </button>
                            ) : (
                                <LoadingSpinner />
                            ))}
                    </div>
                </div>
                <div className="px-5">
                    {result?.length > 0 ? (
                        result?.map((user) => (
                            <UserSearchItem
                                key={user?.id}
                                user={user}
                                handleClick={() => handleClick(user)}
                            />
                        ))
                    ) : (
                        <p className="text-center dark:text-white mt-4 text-gray-500">
                            {LANGUAGE[language].START_DIRECT_MESSAGE}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DrawerNewDirect;
