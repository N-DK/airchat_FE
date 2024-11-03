import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoSearch } from 'react-icons/io5';
import { Avatar } from 'antd';
import FooterChat from './../components/FooterChat';
import { listChannel } from './../redux/actions/ChannelActions';
import LoaderSkeletonChannels from './../components/LoaderSkeletonChannels';
import { POST_LIST_RESET } from '../redux/constants/PostConstants';
import useDebounce from '../hooks/useDebounce';
import Search from '../components/Search';
import {
    clearRecentSearch,
    getRecentSearch,
    listFollow,
    search,
} from '../redux/actions/UserActions';
import PeopleCircle from '../components/PeopleCricle';
import { FaC, FaChevronLeft } from 'react-icons/fa6';
import { LANGUAGE } from '../constants/language.constant';

export default function SeeAll() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [recentSearch, setRecentSearch] = useState([]);
    const debouncedSearch = useDebounce(searchText, 500);

    const { loading, channels } = useSelector((state) => state.channelList);
    const { search: searchResult } = useSelector((state) => state.userSearch);
    const { isSuccess: isSuccessFollow } = useSelector(
        (state) => state.userFollow,
    );
    const { search: recentSearchResult } = useSelector(
        (state) => state.userGetRecentSearch,
    );
    const { language } = useSelector((state) => state.userLanguage);

    const handleClearRecentSearch = useCallback(() => {
        setRecentSearch([]);
        dispatch(clearRecentSearch());
    }, [dispatch]);

    useEffect(() => {
        dispatch({ type: POST_LIST_RESET });
        dispatch(listChannel());
        dispatch(getRecentSearch());
    }, [dispatch]);

    useEffect(() => {
        if (recentSearchResult) {
            setRecentSearch(recentSearchResult);
        }
    }, [recentSearchResult]);

    useEffect(() => {
        if (isSuccessFollow) {
            dispatch(listFollow());
        }
    }, [isSuccessFollow, dispatch]);

    useEffect(() => {
        if (debouncedSearch.trim() !== '') {
            dispatch(search(debouncedSearch));
        }
    }, [debouncedSearch, dispatch]);

    useEffect(() => {
        return () => {
            dispatch(getRecentSearch());
        };
    }, [dispatch]);

    const renderRecentSearchItem = useCallback((item, index) => {
        if (item.channel_id) {
            return (
                <div
                    onClick={() => {
                        navigate(`/channel/${item?.id}`, {
                            state: {
                                channelData: {
                                    name: item?.name_channel,
                                    photo: item?.img_channel,
                                },
                            },
                        });
                    }}
                    key={index}
                    className="flex flex-col justify-center items-center mr-3"
                >
                    <Avatar
                        src={`https://talkie.transtechvietnam.com/${item?.img_channel}`}
                        alt=""
                        className="w-16 h-16 rounded-2xl mb-2 object-cover"
                    />
                    <p className="text-center dark:text-white">
                        {item?.name_channel}
                    </p>
                </div>
            );
        }
        return <PeopleCircle key={index} data={item} />;
    }, []);

    const renderChannelItem = useCallback(
        (item, index) => (
            <button
                key={index}
                onClick={() =>
                    navigate(`/channel/${item.id}`, {
                        state: {
                            channelData: item,
                            trending: channels.trending,
                        },
                    })
                }
                className="flex gap-4"
            >
                <Avatar
                    src={`https://talkie.transtechvietnam.com/${item.photo}`}
                    alt=""
                    className="w-14 h-14 rounded-2xl object-cover"
                />
                <h6 className="mt-2 text-black dark:text-white">{item.name}</h6>
            </button>
        ),
        [navigate, channels?.trending],
    );

    return (
        <div className="relative flex flex-col h-screen bg-slatePrimary dark:bg-dark2Primary overflow-hidden">
            <div className=" flex justify-center pt-10 px-5 bg-white dark:bg-darkPrimary pb-[18px]">
                <div className="relative w-full justify-center flex">
                    <h4 className="dark:text-white">
                        {LANGUAGE[language].ALL_CHANNELS}
                    </h4>
                    <button
                        onClick={() => navigate('/chatting')}
                        className="absolute top-1/2 -translate-y-1/2 left-4"
                    >
                        <FaChevronLeft className="dark:text-white" />
                    </button>
                </div>
            </div>
            <div className="h-full overflow-auto scrollbar-none pb-[200px]">
                <div className="mt-3 mx-5">
                    <div className="flex gap-3 bg-grayPrimary dark:bg-darkPrimary items-center w-full rounded-full px-6 py-3">
                        <IoSearch
                            size="1.5rem"
                            className="text-gray-500 m-0 p-0"
                        />
                        <input
                            className="bg-inherit w-3/5 border-none outline-none text-[17px] text-black dark:text-white placeholder-gray-500"
                            placeholder={LANGUAGE[language].SEARCH}
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                </div>
                {searchText ? (
                    <div className="mt-3">
                        <Search data={searchResult} />
                    </div>
                ) : (
                    <div className="mx-5">
                        <div
                            className={`${
                                channels?.hosting?.length > 0 ? 'mt-8' : ''
                            }`}
                        >
                            {channels?.hosting?.length > 0 && (
                                <h5 className="font-bold text-black dark:text-white">
                                    {LANGUAGE[language].HOSTING}
                                </h5>
                            )}
                            {loading ? (
                                <LoaderSkeletonChannels />
                            ) : (
                                <div className="mt-4 flex flex-col gap-6">
                                    {channels?.hosting?.map(renderChannelItem)}
                                </div>
                            )}
                        </div>
                        <div
                            className={`${
                                channels?.recent?.length > 0 ? 'mt-8' : ''
                            }`}
                        >
                            {channels?.recent?.length > 0 && (
                                <h5 className="font-bold text-black dark:text-white">
                                    {LANGUAGE[language].RECENTLY_ACTIVE}
                                </h5>
                            )}
                            {loading ? (
                                <LoaderSkeletonChannels />
                            ) : (
                                <div className="mt-4 flex flex-col gap-6">
                                    {channels?.recent?.map(renderChannelItem)}
                                </div>
                            )}
                        </div>
                        <div
                            className={`${
                                channels?.trending?.length > 0 ? 'mt-8' : ''
                            }`}
                        >
                            {channels?.trending?.length > 0 && (
                                <h5 className="font-bold text-black dark:text-white">
                                    {LANGUAGE[language].TRENDING}
                                </h5>
                            )}
                            {loading ? (
                                <LoaderSkeletonChannels />
                            ) : (
                                <div className="mt-4 flex flex-col gap-6">
                                    {channels?.trending?.map(renderChannelItem)}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <FooterChat title="" isSwiping={false} isPlay={true} />
        </div>
    );
}
