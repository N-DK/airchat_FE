import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
    userCheckAccountReducer,
    userCodeReducer,
    userEmailReducer,
    userLoginReducer,
    userNumberPhoneReducer,
    userProfileReducer,
    userThemeReducer,
    userUpdateAvatarReducer,
    userUpdateProfileReducer,
    userProfileStrangerReducer,
    userFollowReducer,
    userListFollowReducer,
    postListProfileStrangerReducer,
    userListMuteReducer,
    userListBlockReducer,
    userBlockReducer,
    userMuteReducer,
    userUploadAvatarReducer,
    userGetFollowerStrangerReducer,
    userGetFollowingStrangerReducer,
    userGetFollowerReducer,
    userGetFollowingReducer,
    userSharePostReducer,
    userAddViewPostReducer,
    userReportAccReducer,
    userSearchReducer,
    userDeleteAccountReducer,
    userGetRecentSearchReducer,
    userAddRecentSearchReducer,
    userClearRecentSearchReducer,
    userGetNotificationReducer,
    userSettingNotificationReducer,
    userChangePasswordReducer,
    listNotificationReducer,
} from './reducers/UserReducers';
import {
    bookMarkReducer,
    deletePostReducer,
    heartReducer,
    menuBarReducer,
    postDetailsReducer,
    postListProfileReducer,
    postListReducer,
    postSubmitReducer,
    reportPostReducer,
    postUploadImageReducer,
    postDeletePhotoReducer,
    setPostActiveReducer,
    postUpdateReducer,
    postReplyAllReducer,
} from './reducers/PostReducers';
import {
    channelListReducer,
    channelPostsReducer,
    channelAddReducer,
    channelPinReducer,
    channelDeleteReducer,
} from './reducers/ChannelReducers';
import {
    detailMessageReducers,
    listMessageReducers,
    searchUserReducers,
    socketReducer,
} from './reducers/MessageReducers';
import {
    setObjectActiveReducer,
    setObjectAudioCurrentReducer,
    setObjectVideoCurrentReducer,
} from './reducers/SurfReducers';

const reducer = combineReducers({
    userLogin: userLoginReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userUpdateAvatar: userUpdateAvatarReducer,
    userAccount: userCheckAccountReducer,
    userNumberPhone: userNumberPhoneReducer,
    userEmail: userEmailReducer,
    userCode: userCodeReducer,
    postSubmit: postSubmitReducer,
    postList: postListReducer,
    postListProfile: postListProfileReducer,
    channelList: channelListReducer,
    channelPosts: channelPostsReducer,
    channelAdd: channelAddReducer,
    channelPin: channelPinReducer,
    postDetails: postDetailsReducer,
    userTheme: userThemeReducer,
    userProfile: userProfileReducer,
    userProfileStranger: userProfileStrangerReducer,
    postListProfileStranger: postListProfileStrangerReducer,
    menuBar: menuBarReducer,
    userBookMark: bookMarkReducer,
    userHeart: heartReducer,
    userDeletePost: deletePostReducer,
    userFollow: userFollowReducer,
    userListFollow: userListFollowReducer,
    userListBlock: userListBlockReducer,
    userListMute: userListMuteReducer,
    userBlock: userBlockReducer,
    userMute: userMuteReducer,
    userUploadAvatar: userUploadAvatarReducer,
    userGetFollowerStranger: userGetFollowerStrangerReducer,
    userGetFollowingStranger: userGetFollowingStrangerReducer,
    userGetFollower: userGetFollowerReducer,
    userGetFollowing: userGetFollowingReducer,
    userSharePost: userSharePostReducer,
    userAddViewPost: userAddViewPostReducer,
    userReportAcc: userReportAccReducer,
    userSearch: userSearchReducer,
    userDeleteAccount: userDeleteAccountReducer,
    reportPost: reportPostReducer,
    detailMessage: detailMessageReducers,
    listMessageRecent: listMessageReducers,
    searchUser: searchUserReducers,
    socket: socketReducer,
    userGetRecentSearch: userGetRecentSearchReducer,
    userAddRecentSearch: userAddRecentSearchReducer,
    userClearRecentSearch: userClearRecentSearchReducer,
    channelDelete: channelDeleteReducer,
    postUploadImage: postUploadImageReducer,
    userGetNotification: userGetNotificationReducer,
    postDeletePhoto: postDeletePhotoReducer,
    setPostActive: setPostActiveReducer,
    setObjectActive: setObjectActiveReducer,
    setObjectAudioCurrent: setObjectAudioCurrentReducer,
    postUpdate: postUpdateReducer,
    userSettingNotification: userSettingNotificationReducer,
    userChangePassword: userChangePasswordReducer,
    listNotification: listNotificationReducer,
    postReplyAll: postReplyAllReducer,
    setObjectVideoCurrent: setObjectVideoCurrentReducer,
});

const userInfoFromLocalStorage = localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null;

const userThemeFromLocalStorage = localStorage.getItem('theme')
    ? JSON.parse(localStorage.getItem('theme'))
    : null;

const initialState = {
    userLogin: {
        userInfo: userInfoFromLocalStorage,
    },
    userTheme: {
        theme: userThemeFromLocalStorage,
    },
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware)),
);

export default store;
