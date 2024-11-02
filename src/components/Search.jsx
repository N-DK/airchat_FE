import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';
import React, {
    useState,
    useMemo,
    useEffect,
    useCallback,
    useContext,
} from 'react';
import { useSwipeable } from 'react-swipeable';
import { ItemFollow } from './ItemFollow';
import ListPostItems from './ListPostItems';
import { ChannelItem } from './ChannelItem';
import LoadingSpinner from './LoadingSpinner';
import { useDispatch, useSelector } from 'react-redux';
import ChannelCircle from './ChannelCircle';
import PeopleCircle from './PeopleCricle';
import { listFollow, profile } from '../redux/actions/UserActions';
import { LANGUAGE } from '../constants/language.constant';
import ScreenFull from './ScreenFull';
import { AppContext } from '../AppContext';
const EmptySearch = React.memo(() => {
    const { language } = useSelector((state) => state.userLanguage);
    return (
        <div className="flex flex-col items-center justify-start h-full fixed z-50 w-full left-0">
            <img src="./src/assets/Untitled-2.png" alt="" />
            <h5 className="mt-3 dark:text-white">
                {LANGUAGE[language].NO_RESULTS}
            </h5>
            <p className="text-gray-500 dark:text-gray-400">
                {LANGUAGE[language].TRY_SEARCHING_FOR_SOMETHING_ELSE}
            </p>
        </div>
    );
});

const ListFollow = React.memo(({ data }) => {
    const dispatch = useDispatch();
    const { following: userInfoListFollowing } = useSelector(
        (state) => state.userListFollow,
    );

    const { userInfo } = useSelector((state) => state.userProfile);

    useEffect(() => {
        if (!userInfoListFollowing) dispatch(listFollow());
    }, [userInfoListFollowing]);

    useEffect(() => {
        if (!userInfo) dispatch(profile());
    }, [userInfo]);

    const handleAction = useCallback(
        (action, id) => {
            dispatch(action(id));
        },
        [dispatch],
    );

    return data?.people?.length > 0 ? (
        <div className="px-2 mt-4">
            {data.people.map((item, index) => (
                <ItemFollow
                    key={index}
                    data={item}
                    handleFollow={handleAction}
                    isFollowing={userInfoListFollowing?.some(
                        (item_follow) => item_follow.stranger_id == item.id,
                    )}
                />
            ))}
        </div>
    ) : (
        <EmptySearch />
    );
});

const ListChannel = React.memo(({ data }) =>
    data?.channel?.length > 0 ? (
        <div className="px-2 mt-4">
            {data.channel.map((item, index) => (
                <ChannelItem key={index} data={item} />
            ))}
        </div>
    ) : (
        <EmptySearch />
    ),
);

const Latest = React.memo(({ data, setActiveKey }) => {
    const { language } = useSelector((state) => state.userLanguage);

    return (
        <>
            {(data?.channel?.length === 0 || !data?.channel) &&
                (data?.people?.length === 0 || !data?.people) &&
                (data?.top?._data?.length === 0 || !data?.top?._data) && (
                    <EmptySearch />
                )}
            <div className="mt-4">
                {/* Chats */}
                {data?.channel?.length > 0 && (
                    <div className="px-2 mb-2">
                        <div className="flex items-center justify-between dark:text-white mb-4">
                            <h6 className="">{LANGUAGE[language].CHANNELS}</h6>
                            <button
                                onClick={() => setActiveKey('4')}
                                className="text-base"
                            >
                                {LANGUAGE[language].SEE_MORE}
                            </button>
                        </div>
                        <div className="flex">
                            {data?.channel?.map((item, index) => (
                                <ChannelCircle key={index} data={item} />
                            ))}
                        </div>
                    </div>
                )}
                {/* People */}
                {data?.people?.length > 0 && (
                    <div className="px-2 mb-2">
                        <div className="mb-4 flex items-center justify-between dark:text-white">
                            <h6 className="">{LANGUAGE[language].PEOPLE}</h6>
                            <button
                                onClick={() => setActiveKey('3')}
                                className="text-base"
                            >
                                {LANGUAGE[language].SEE_MORE}
                            </button>
                        </div>
                        <div className="flex overflow-x-auto scrollbar-none">
                            {data?.people?.map((item, index) => (
                                <PeopleCircle
                                    key={index}
                                    data={item}
                                    isAddRecentSearch={true}
                                />
                            ))}
                        </div>
                    </div>
                )}
                {/* Recent posts */}
                {data?.top?._data?.length > 0 && (
                    <div>
                        <h6 className="mb-4 px-2 dark:text-white">
                            {LANGUAGE[language].RECENT_POSTS}
                        </h6>
                        <div>
                            <ListPostItems
                                postsList={data?.top?._data}
                                isTurnOnCamera={data?.top?.isTurnOnCamera}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
});

const TabContent = React.memo(
    ({ component: Component, data, setActiveKey }) => (
        <div className={`w-full pb-[calc(100vh-390px)] dark:bg-dark2Primary`}>
            <Component data={data} setActiveKey={setActiveKey} />
        </div>
    ),
);

const tabData = [
    {
        key: '1',
        'title-en-US': 'Latest',
        'title-vi-VN': 'Mới nhất',
        component: Latest,
    },
    {
        key: '2',
        'title-en-US': 'Top',
        'title-vi-VN': 'Nổi bật',
        component: ({ data }) => {
            const topPosts = data?.top;
            return topPosts?._data?.length > 0 ? (
                <ListPostItems
                    postsList={topPosts?._data}
                    isTurnOnCamera={topPosts?.isTurnOnCamera}
                />
            ) : (
                <EmptySearch />
            );
        },
    },
    {
        key: '3',
        'title-en-US': 'People',
        'title-vi-VN': 'Người',
        component: ListFollow,
    },
    {
        key: '4',
        'title-en-US': 'Channels',
        'title-vi-VN': 'Kênh',
        component: ListChannel,
    },
];

function Search({ data, isTurnOnCamera }) {
    const [activeKey, setActiveKey] = useState('1');
    const [searchData, setSearchData] = useState(data);
    const { loading } = useSelector((state) => state.userSearch);
    const { userInfo } = useSelector((state) => state.userProfile);
    const { language } = useSelector((state) => state.userLanguage);
    const { isFullScreen } = useContext(AppContext);
    const dispatch = useDispatch();
    useEffect(() => {
        if (!userInfo) dispatch(profile());
    }, []);

    const changeTab = useCallback(
        (direction) => {
            const currentIndex = tabData.findIndex(
                (tab) => tab.key === activeKey,
            );
            if (direction === 'next' && currentIndex < tabData.length - 1) {
                setActiveKey(tabData[currentIndex + 1].key);
            } else if (direction === 'prev' && currentIndex > 0) {
                setActiveKey(tabData[currentIndex - 1].key);
            }
        },
        [activeKey],
    );

    const handlers = useSwipeable({
        onSwipedLeft: () => changeTab('next'),
        onSwipedRight: () => changeTab('prev'),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true,
    });

    const tabPanes = useMemo(
        () =>
            tabData.map((tab) => (
                <TabPane tab={tab[`title-${language}`]} key={tab.key}>
                    {loading ? (
                        <div className="mt-4">
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            <TabContent
                                component={tab.component}
                                data={searchData}
                                setActiveKey={setActiveKey}
                            />
                        </>
                    )}
                </TabPane>
            )),
        [searchData, loading],
    );

    useEffect(() => {
        setSearchData({
            ...data,
            top: { isTurnOnCamera, _data: data?.top },
        });
    }, [data, isTurnOnCamera]);

    return (
        <div {...handlers} className="overflow-auto scrollbar-none">
            <Tabs
                activeKey={activeKey}
                onChange={setActiveKey}
                className="centered-tabs"
            >
                {tabPanes}
            </Tabs>
            {isFullScreen && <ScreenFull postsList={searchData?.top?._data} />}
        </div>
    );
}

export default Search;
