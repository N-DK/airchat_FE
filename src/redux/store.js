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
} from './reducers/PostReducers';
import {
    channelListReducer,
    channelPostsReducer,
} from './reducers/ChannelReducers';

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
