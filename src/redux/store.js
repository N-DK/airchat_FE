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
import { channel } from 'process';

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
