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
import { LANGUAGE } from '../constants/language.constant';

export default function SearchScreen() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchText, setSearchText] = useState('');
    const [recentSearch, setRecentSearch] = useState([]);
    const debouncedSearch = useDebounce(searchText, 500);
    const [isTurnOnCamera, setIsTurnOnCamera] = useState(false);
    const { language } = useSelector((state) => state.userLanguage);
    const { loading, channels } = useSelector((state) => state.channelList);
    const { search: searchResult } = useSelector((state) => state.userSearch);
    const { post } = useSelector((state) => state.setPostActive);

    const { isSuccess: isSuccessFollow } = useSelector(
        (state) => state.userFollow,
    );
    const { search: recentSearchResult } = useSelector(
        (state) => state.userGetRecentSearch,
    );

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
                        navigate(`/channel/${item?.id || item?.channel_id}`, {
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
            <div className="flex justify-center pt-12 px-5 bg-white dark:bg-darkPrimary pb-[18px]">
                <div className="flex gap-3 bg-grayPrimary dark:bg-dark2Primary items-center w-full rounded-full px-6 py-3">
                    <IoSearch size="1.5rem" className="text-gray-500 m-0 p-0" />
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
                <Search data={searchResult} isTurnOnCamera={isTurnOnCamera} />
            ) : (
                <div className="mx-5 h-full overflow-auto scrollbar-none pb-[200px]">
                    {recentSearch?.length > 0 && (
                        <div className="mt-2">
                            <div className="flex items-center justify-between mb-4">
                                <h5 className="font-bold text-black dark:text-white">
                                    {LANGUAGE[language].RECENT_SEARCHES}
                                </h5>
                                <button
                                    onClick={handleClearRecentSearch}
                                    className="dark:text-white text-sm bg-black/20 rounded-full px-3 py-1"
                                >
                                    {LANGUAGE[language].CLEAR}
                                </button>
                            </div>
                            <div className="flex overflow-x-auto scrollbar-none">
                                {recentSearch.map(renderRecentSearchItem)}
                            </div>
                        </div>
                    )}
                    <div className="mt-8">
                        <h5 className="font-bold text-black dark:text-white">
                            {LANGUAGE[language].TOP_CHANNELS}
                        </h5>
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

            <FooterChat
                title="search"
                isSwiping={false}
                isPlay={debouncedSearch !== '' && searchResult?.top?.length > 0}
                setIsTurnOnCamera={post ? setIsTurnOnCamera : null}
            />
        </div>
    );
}
