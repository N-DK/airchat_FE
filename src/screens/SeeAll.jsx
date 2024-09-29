import { IoSearch } from 'react-icons/io5';
import FooterChat from './../components/FooterChat';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listChannel } from './../redux/actions/ChannelActions';
import LoaderSkeletonChannels from './../components/LoaderSkeletonChannels';
import { POST_LIST_RESET } from '../redux/constants/PostConstants';
import React from 'react';
import { DEFAULT_PROFILE } from '../constants/image.constant';
import { Avatar } from 'antd';
import useDebounce from '../hooks/useDebounce';
import Search from '../components/Search';
import { search } from '../redux/actions/UserActions';
export default function SeeAll() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const channelList = useSelector((state) => state.channelList);
    const { loading, channels } = channelList;
    const [searchText, setSearchText] = useState('');
    const debouncedSearch = useDebounce(searchText, 500);

    const { loading: loadingSearch, search: searchResult } = useSelector(
        (state) => state.userSearch,
    );

    useEffect(() => {
        dispatch({ type: POST_LIST_RESET });
        dispatch(listChannel());
    }, []);

    useEffect(() => {
        // fetch data with debouncedSearch
        if (debouncedSearch.trim() !== '') {
            dispatch(search(debouncedSearch));
        }
    }, [debouncedSearch]);

    return (
        <div className="relative flex flex-col h-screen bg-slatePrimary dark:bg-dark2Primary overflow-hidden">
            <div className="flex justify-center pt-12 px-5 bg-white dark:bg-darkPrimary pb-[18px]">
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
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
            </div>

            {searchText ? (
                <Search data={searchResult} />
            ) : (
                <>
                    <div className="mt-2 mx-5 h-full overflow-auto scrollbar-none  pb-[200px]">
                        <h5 className="font-bold text-black dark:text-white">
                            Top Channels
                        </h5>
                        {loading ? (
                            <LoaderSkeletonChannels />
                        ) : (
                            <div className="mt-4 flex flex-col gap-6">
                                {channels.trending?.map((item, i) => (
                                    <button
                                        key={i}
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
                                        <h6 className="mt-2 text-black dark:text-white">
                                            {item.name}
                                        </h6>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            <FooterChat title="seeall" isSwiping={false} isPlay={false} />
        </div>
    );
}
