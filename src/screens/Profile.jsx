import React, {
    useContext,
    useEffect,
    useState,
    useCallback,
    useRef,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Image, Spin } from 'antd';
import { FaAngleLeft, FaRegHeart } from 'react-icons/fa';
import { IoGiftOutline } from 'react-icons/io5';
import { FiUpload } from 'react-icons/fi';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import FooterChat from '../components/FooterChat';
import EditProfile from '../components/EditProfile';
import RecordModal from '../components/RecordModal';
import InviteFriend from '../components/InviteFriend';
import ListPostProfile from '../components/ListPostProfile';
import LoadingSpinner from '../components/LoadingSpinner';
import { AppContext } from '../AppContext';
import {
    block,
    follow,
    getProfileStranger,
    listBlock,
    listFollow,
    listMute,
    listPostProfileStranger,
    mute,
    profile,
} from '../redux/actions/UserActions';
import {
    deletePhoto,
    deletePost,
    listPostProfile,
} from '../redux/actions/PostActions';
import { POST_SUBMIT_RESET } from '../redux/constants/PostConstants';
import ListPostItems from '../components/ListPostItems';
import { IoIosSettings } from 'react-icons/io';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import ModalDelete from '../components/ModalDelete';
import { DEFAULT_PROFILE } from '../constants/image.constant';
import DrawerFollower from '../components/DrawerFollower';
import Webcam from 'react-webcam';
import { BsEmojiFrown } from 'react-icons/bs';

const ACTIONS = [
    {
        id: 'posts',
        name: 'Posts',
        contents: 'No messages yet',
        descriptions: 'Your messages will show up here.',
    },
    {
        id: 'highlights',
        name: 'Highlights',
        contents: 'No highlights',
        descriptions: 'Starred items appear here',
    },
    {
        id: 'bookmarks',
        name: 'Bookmarks',
        contents: 'No bookmarks',
        descriptions: 'Bookmarks threads to save them for later.',
    },
];

export default function Profile() {
    const [showActions, setShowActions] = useState('posts');
    const [userInfo, setUserInfo] = useState(null);
    const [listPostUserProfile, setListPostUserProfile] = useState([]);
    const [typeDrawer, setTypeDrawer] = useState(null);
    const [isTurnOnCamera, setIsTurnOnCamera] = useState(false);
    const [isTurnOnCameraReply, setIsTurnOnCameraReply] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { stranger_id } = useParams();

    const {
        isEditProfile,
        isRecord,
        showDrawerFollow,
        toggleIsRecord,
        toggleIsEditProfile,
        toggleShowInviteFriend,
        toggleShowDrawerFollow,
    } = useContext(AppContext);

    const userProfile = useSelector((state) => state.userProfile);
    const userProfileStranger = useSelector(
        (state) => state.userProfileStranger,
    );
    const postListProfile = useSelector((state) => state.postListProfile);
    const postSubmit = useSelector((state) => state.postSubmit);
    const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
    const userFollow = useSelector((state) => state.userFollow);
    const userListFollow = useSelector((state) => state.userListFollow);
    const postListProfileStranger = useSelector(
        (state) => state.postListProfileStranger,
    );
    const userListBlock = useSelector((state) => state.userListBlock);
    const userListMute = useSelector((state) => state.userListMute);
    const userBlock = useSelector((state) => state.userBlock);
    const userMute = useSelector((state) => state.userMute);
    const userDeletePost = useSelector((state) => state.userDeletePost);
    const userBookMark = useSelector((state) => state.userBookMark);
    const userSharePost = useSelector((state) => state.userSharePost);

    const { success: isSuccessDeletePost } = userDeletePost;
    const { userInfo: userInfoProfile, loading: loadingProfile } = userProfile;
    const { userInfo: userInfoStranger, loading: loadingStranger } =
        userProfileStranger;
    const { posts: listPost, loading: loadingListProfile } = postListProfile;
    const { success: successSubmit, loading: loadingSubmit } = postSubmit;
    const { isSuccess } = userUpdateProfile;
    const { isSuccess: isSuccessFollow } = userFollow;
    const { following: userInfoListFollowing } = userListFollow;
    const { posts: listPostStranger } = postListProfileStranger;
    const { block: blocks } = userListBlock;
    const { mute: mutes } = userListMute;
    const { isSuccess: isSuccessBlock } = userBlock;
    const { isSuccess: isSuccessMute } = userMute;
    const { success: isSuccessBookmark } = userBookMark;
    const { isSuccess: isSuccessShare } = userSharePost;
    const { post } = useSelector((state) => state.setPostActive);

    const modalHandle = () => {
        if (isEditProfile) toggleIsEditProfile();
        if (isRecord) toggleIsRecord();
        // if (showDrawerFollow) toggleShowDrawerFollow();
    };

    const isFollowing = useCallback(() => {
        if (!stranger_id) return false;
        return userInfoListFollowing?.some(
            (item) => item.stranger_id === parseInt(stranger_id),
        );
    }, [stranger_id, userInfoListFollowing]);

    const isBlock = useCallback(() => {
        if (!stranger_id) return false;
        return blocks?.some(
            (item) => item.blocked_id === parseInt(stranger_id),
        );
    }, [stranger_id, blocks]);

    const isMute = useCallback(() => {
        if (!stranger_id) return false;
        return mutes?.some((item) => item.mute_id === parseInt(stranger_id));
    }, [stranger_id, mutes]);

    const handleAction = useCallback(
        (action, id) => {
            dispatch(action(id));
        },
        [dispatch],
    );

    const handleBlock = useCallback(
        (id, type) => {
            dispatch(block(id, type));
        },
        [dispatch],
    );

    const handleMute = useCallback(
        (id, type) => {
            dispatch(mute(id, type));
        },
        [dispatch],
    );

    const groupPostById = (list) => {
        if (!list) return [];

        const groupedPosts = new Map();

        list.forEach((item) => {
            if (!groupedPosts.has(item.id)) {
                groupedPosts.set(item.id, { ...item, reply: [] });
            }

            const post = groupedPosts.get(item.id);

            // Đảm bảo item.reply là mảng, và duyệt qua từng phần tử trong item.reply
            item.reply?.forEach((replyItem) => {
                if (
                    !post.reply.some((r) => r?.user_id === replyItem?.user_id)
                ) {
                    post.reply.push(replyItem);
                }
            });
        });

        return Array.from(groupedPosts.values());
    };

    useEffect(() => {
        if (showDrawerFollow) toggleShowDrawerFollow();
    }, [window.location.pathname]);

    useEffect(() => {
        if (stranger_id) dispatch(getProfileStranger(stranger_id));
        dispatch(profile());
        dispatch(listFollow());
        dispatch(listBlock());
        dispatch(listMute());
    }, [dispatch, stranger_id]);

    useEffect(() => {
        if (isSuccessBlock) dispatch(listBlock());
    }, [isSuccessBlock, dispatch]);

    useEffect(() => {
        if (isSuccessMute) dispatch(listMute());
    }, [isSuccessMute, dispatch]);

    useEffect(() => {
        if (isSuccess) {
            dispatch(profile());
        }
    }, [isSuccess, dispatch]);

    useEffect(() => {
        if (isSuccessFollow) {
            dispatch(listFollow());
            if (stranger_id) dispatch(getProfileStranger(stranger_id));
            else dispatch(profile());
        }
    }, [isSuccessFollow, dispatch, stranger_id]);

    useEffect(() => {
        if (!loadingSubmit && successSubmit?.id) {
            dispatch(listPostProfile(showActions, 100, 0));
            if (isRecord) toggleIsRecord();
            dispatch({ type: POST_SUBMIT_RESET });
        }
    }, [loadingSubmit, showActions, dispatch, toggleIsRecord]);

    useEffect(() => {
        if (isSuccessDeletePost) {
            dispatch(listPostProfile(showActions, 100, 0));
        }
    }, [isSuccessDeletePost, dispatch, showActions]);

    useEffect(() => {
        if (!loadingProfile && !loadingStranger) {
            setUserInfo(stranger_id ? userInfoStranger : userInfoProfile);
        }
    }, [loadingProfile, loadingStranger, stranger_id]);

    useEffect(() => {
        setListPostUserProfile(
            stranger_id
                ? groupPostById(listPostStranger)
                : groupPostById(listPost),
        );
    }, [stranger_id, listPostStranger, listPost]);

    useEffect(() => {
        const fetchPosts = () => {
            if (!stranger_id) {
                dispatch(listPostProfile(showActions, 100, 0));
            } else if (showActions) {
                dispatch(
                    listPostProfileStranger(stranger_id, showActions, 100, 0),
                );
            }
        };
        fetchPosts();
    }, [showActions, stranger_id, dispatch]);

    useEffect(() => {
        if (isSuccessBookmark && showActions === 'bookmarks') {
            dispatch(listPostProfile('bookmarks', 100, 0));
        }
    }, [isSuccessBookmark, dispatch, showActions]);

    useEffect(() => {
        if (isSuccessShare && showActions === 'posts') {
            dispatch(listPostProfile('posts', 100, 0));
        }
    }, [isSuccessShare, dispatch, showActions]);

    const renderActionButtons = () => (
        <div className="flex gap-3 text-black dark:text-white">
            {!stranger_id && (
                <button
                    onClick={toggleShowInviteFriend}
                    className="h-[34px] md:h-[40px] w-[34px] md:w-[40px] border-[1px] border-gray-400 rounded-full flex justify-center items-center"
                >
                    <IoGiftOutline className="opacity-30 text-xl md:text-2xl" />
                </button>
            )}
            <button className="h-[34px] md:h-[40px] w-[34px] md:w-[40px] border-[1px] border-gray-400 rounded-full flex justify-center items-center">
                <FiUpload className="opacity-30 text-xl md:text-2xl" />
            </button>
            <button
                onClick={
                    stranger_id
                        ? () =>
                              isBlock()
                                  ? handleBlock(stranger_id, 'unblock')
                                  : handleAction(follow, stranger_id)
                        : toggleIsEditProfile
                }
                className="h-[34px] md:h-[40px] min-w-[34px] md:min-w-[40px] px-4 border-[1px] border-gray-400 rounded-full flex justify-center items-center"
            >
                <span className="font-medium md:text-xl">
                    {stranger_id
                        ? (isBlock() && 'Blocked') ||
                          (isFollowing() && 'Following') ||
                          'Follow'
                        : 'Edit Profile'}
                </span>
            </button>
        </div>
    );

    const renderContent = () => {
        if (loadingListProfile) {
            return (
                <div className="mt-4">
                    <LoadingSpinner />
                </div>
            );
        }

        if (listPostUserProfile?.length > 0) {
            return stranger_id ? (
                <ListPostItems
                    postsList={listPostStranger}
                    isTurnOnCamera={isTurnOnCameraReply}
                />
            ) : (
                <ListPostProfile
                    list={listPostUserProfile}
                    userInfo={userInfo}
                    isTurnOnCamera={isTurnOnCameraReply}
                />
            );
        }

        return ACTIONS.map(
            (item) =>
                showActions === item.id && (
                    <div
                        key={item.id}
                        className="flex flex-col items-center pt-4 px-2"
                    >
                        <h5 className="text-gray-500">{item.contents} </h5>
                        <span className="text-[15px] text-gray-500 text-center">
                            {item.descriptions}
                        </span>
                    </div>
                ),
        );
    };

    const Dropdown = () => {
        return (
            <Menu as="div" className="relative inline-block text-left z-50">
                <MenuButton className="relative">
                    <HiOutlineDotsHorizontal className="text-xl md:text-[30px]" />
                </MenuButton>

                <MenuItems
                    transition
                    className="z-[999px] absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-300 divide-y divide-gray-200 rounded-md shadow-lg outline-none dark:bg-dark2Primary"
                >
                    <div className="py-1">
                        <MenuItem>
                            {({ active }) => (
                                <button
                                    onClick={() =>
                                        handleBlock(
                                            stranger_id,
                                            `${
                                                isBlock() ? 'unblock' : 'block'
                                            }`,
                                        )
                                    }
                                    className={`${
                                        active ? '' : ''
                                    }  flex justify-between w-full px-4 py-2 text-sm dark:text-white`}
                                >
                                    {isBlock() ? 'Unblock' : 'Block'}
                                </button>
                            )}
                        </MenuItem>
                        <MenuItem>
                            {({ active }) => (
                                <button
                                    onClick={() =>
                                        handleMute(
                                            stranger_id,
                                            `${isMute() ? 'unmute' : 'mute'}`,
                                        )
                                    }
                                    className={`${
                                        active ? '' : ''
                                    }  flex justify-between w-full px-4 py-2 text-sm text-gray-700 dark:text-white`}
                                >
                                    {isMute() ? 'Unmute' : 'Mute'}
                                </button>
                            )}
                        </MenuItem>
                    </div>
                </MenuItems>
            </Menu>
        );
    };

    if (!userInfoStranger && !loadingStranger && stranger_id) {
        return (
            <div className="h-screen flex flex-col">
                <div className="sticky top-0 left-0 z-40 bg-white dark:bg-darkPrimary px-6 md:px-10 text-black dark:text-white flex justify-between items-center pt-12 pb-8 md:pb-10">
                    <button onClick={() => navigate(-1)}>
                        <FaAngleLeft className="text-lg md:text-[22px]" />
                    </button>
                </div>
                <div className="flex-1 bg-slatePrimary dark:bg-darkPrimary pb-40">
                    <div className="appear-animation duration-300 flex flex-col items-center justify-center h-full w-full">
                        <BsEmojiFrown
                            size={54}
                            className="text-gray-500 dark:text-gray-400 mb-3"
                        />
                        <p className="text-center dark:text-gray-400 text-xl">
                            The user is not exist
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // || (stranger_id && userInfoStranger)
    return userInfo ? (
        <>
            <div className="relative flex flex-col justify-between h-screen overflow-hidden bg-slatePrimary dark:bg-darkPrimary">
                <div className="overflow-auto scrollbar-none pb-[410px]">
                    <div className="sticky top-0 left-0 z-40 bg-white dark:bg-darkPrimary px-6 md:px-10 text-black dark:text-white flex justify-between items-center pt-12 pb-8 md:pb-10">
                        <button onClick={() => navigate(-1)}>
                            <FaAngleLeft className="text-lg md:text-[22px]" />
                        </button>
                        <h5 className="md:text-2xl">{userInfo?.username}</h5>
                        {!stranger_id ? (
                            <button onClick={() => navigate('/settings')}>
                                <IoIosSettings className="text-xl md:text-[30px]" />
                            </button>
                        ) : (
                            <Dropdown />
                        )}
                    </div>

                    <div className="pb-52 bg-slatePrimary dark:bg-darkPrimary">
                        <div className="bg-white dark:bg-darkPrimary px-6 md:px-10">
                            <div className="flex justify-between items-center">
                                <Image
                                    width={55}
                                    height={55}
                                    src={
                                        userInfo?.image
                                            ? `https://talkie.transtechvietnam.com/${userInfo?.image}`
                                            : DEFAULT_PROFILE
                                    }
                                    className="w-[55px] md:w-[70px] h-[55px] md:h-[70px] object-cover rounded-full"
                                    alt="avatar"
                                    preview={{
                                        scaleStep: 0.1,
                                        mask: false,
                                        maxScale: 0.05,
                                    }}
                                />
                                {renderActionButtons()}
                            </div>

                            <div className="mt-2 md:mt-6">
                                <h4 className="md:text-2xl text-black dark:text-white">
                                    {userInfo?.name}
                                </h4>
                                <span className="text-[15px] md:text-[19px] text-gray-500 dark:text-gray-400">
                                    {userInfo?.username}
                                </span>
                            </div>

                            <div className="flex gap-4 items-center mt-3 md:mt-5">
                                <div
                                    onClick={() => {
                                        setTypeDrawer('following');
                                        toggleShowDrawerFollow();
                                    }}
                                    className="flex gap-2 items-center"
                                >
                                    <h6 className="md:text-xl dark:text-white">
                                        {userInfo?.number_following}
                                    </h6>
                                    <span className="text-[15px] md:text-lg text-gray-500 dark:text-gray-400">
                                        Following
                                    </span>
                                </div>
                                <div
                                    onClick={() => {
                                        setTypeDrawer('follower');
                                        toggleShowDrawerFollow();
                                    }}
                                    className="flex gap-2 items-center"
                                >
                                    <h6 className="md:text-xl dark:text-white">
                                        {userInfo?.number_follow}
                                    </h6>
                                    <span className="text-[15px] md:text-lg text-gray-500 dark:text-gray-400">
                                        Follower
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="sticky top-[90px] left-0 z-30 bg-white dark:bg-darkPrimary px-6 md:px-10 flex pt-4 md:pt-6 gap-4">
                            {ACTIONS.filter((item) =>
                                stranger_id ? item.id !== 'bookmarks' : true,
                            ).map((item) => (
                                <button
                                    onClick={() => setShowActions(item.id)}
                                    key={item.id}
                                    className={`min-w-14 border-b-[3px] ${
                                        showActions === item.id
                                            ? 'border-bluePrimary'
                                            : 'border-white dark:border-darkPrimary'
                                    } pb-[7px]`}
                                >
                                    <span
                                        className={`font-medium ${
                                            item.id === showActions
                                                ? 'text-black dark:text-white'
                                                : 'text-gray-400'
                                        }`}
                                    >
                                        {item.name}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {showActions === 'posts' && !stranger_id && (
                            <div
                                onClick={toggleIsRecord}
                                className="bg-slatePrimary dark:bg-darkPrimary flex items-center py-4 md:py-5 px-3 md:px-6 gap-3 md:gap-6 border-b-[6px] border-gray-200 dark:border-dark2Primary"
                            >
                                <figure>
                                    <div
                                        className={`h-10 md:h-12 w-10 md:w-12 ${
                                            isTurnOnCamera
                                                ? 'scale-[1.5]'
                                                : 'scale-[1]'
                                        } rounded-full overflow-hidden transition-all  duration-300`}
                                    >
                                        {isTurnOnCamera ? (
                                            <Webcam
                                                videoConstraints={{
                                                    facingMode: 'user',
                                                }}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        ) : (
                                            <Avatar
                                                src={
                                                    userInfo?.image &&
                                                    userInfo?.image !== '0'
                                                        ? `https://talkie.transtechvietnam.com/${userInfo.image}`
                                                        : DEFAULT_PROFILE
                                                }
                                                className="w-full h-full object-cover"
                                                alt="icon"
                                            />
                                        )}
                                    </div>
                                </figure>
                                <div className="bg-white dark:bg-dark2Primary shadow-xl rounded-2xl w-full p-3 md:p-5">
                                    <h5 className="text-black dark:text-white">
                                        {userInfo?.name}
                                    </h5>
                                    <button className="text-gray-400">
                                        New post to followers...
                                    </button>
                                </div>
                            </div>
                        )}

                        {renderContent()}
                    </div>
                </div>

                <EditProfile />
                <RecordModal />
                <InviteFriend />
                <DrawerFollower
                    userInfo={userInfo}
                    isStranger={!!stranger_id}
                    typeDrawer={typeDrawer}
                    userInfoListFollowing={userInfoListFollowing}
                    handleFollow={handleAction}
                />

                <div
                    onClick={modalHandle}
                    className={`z-40 absolute h-screen w-screen bg-black bg-opacity-10 transition-all duration-500 ${
                        isEditProfile || isRecord
                            ? 'opacity-100 pointer-events-auto'
                            : 'opacity-0 pointer-events-none'
                    }`}
                />

                <FooterChat
                    title="chatting"
                    isSwiping={false}
                    isPlay={true}
                    setIsTurnOnCamera={
                        post ? setIsTurnOnCameraReply : setIsTurnOnCamera
                    }
                />
            </div>
        </>
    ) : (
        <div className="flex justify-center items-center h-screen dark:bg-darkPrimary">
            <LoadingSpinner />
        </div>
    );
}
