import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_PROFILE_RESET,
    CHECK_NUMBER_PHONE_REQUEST,
    CHECK_NUMBER_PHONE_SUCCESS,
    CHECK_NUMBER_PHONE_FAIL,
    CHECK_NUMBER_PHONE_RESET,
    USER_UPDATE_AVATAR_REQUEST,
    USER_UPDATE_AVATAR_SUCCESS,
    USER_UPDATE_AVATAR_FAIL,
    USER_THEME_SUCCESS,
    USER_THEME_RESET,
    CHECK_USER_EMAIL_REQUEST,
    CHECK_USER_EMAIL_SUCCESS,
    CHECK_USER_EMAIL_FAIL,
    CHECK_USER_EMAIL_RESET,
    SAVE_USER_EMAIL_TEMPORARY,
    USER_CODE_REQUEST,
    USER_CODE_SUCCESS,
    USER_CODE_FAIL,
    USER_CODE_RESET,
    CHECK_ACCOUNT_REQUEST,
    CHECK_ACCOUNT_SUCCESS,
    CHECK_ACCOUNT_FAIL,
    CHECK_ACCOUNT_RESET,
    USER_PROFILE_REQUEST,
    USER_PROFILE_SUCCESS,
    USER_PROFILE_FAIL,
    USER_PROFILE_STRANGER_REQUEST,
    USER_PROFILE_STRANGER_SUCCESS,
    USER_PROFILE_STRANGER_FAIL,
    USER_FOLLOW_REQUEST,
    USER_FOLLOW_SUCCESS,
    USER_FOLLOW_FAIL,
    USER_LIST_FOLLOW_REQUEST,
    USER_LIST_FOLLOW_SUCCESS,
    USER_LIST_FOLLOW_FAIL,
    POST_LIST_PROFILE_STRANGER_REQUEST,
    POST_LIST_PROFILE_STRANGER_SUCCESS,
    POST_LIST_PROFILE_STRANGER_FAIL,
    USER_BLOCK_REQUEST,
    USER_BLOCK_SUCCESS,
    USER_BLOCK_FAIL,
    USER_MUTE_REQUEST,
    USER_MUTE_SUCCESS,
    USER_MUTE_FAIL,
    USER_LIST_BLOCK_REQUEST,
    USER_LIST_BLOCK_SUCCESS,
    USER_LIST_BLOCK_FAIL,
    USER_LIST_MUTE_REQUEST,
    USER_LIST_MUTE_SUCCESS,
    USER_LIST_MUTE_FAIL,
    USER_UPLOAD_AVATAR_REQUEST,
    USER_UPLOAD_AVATAR_SUCCESS,
    USER_UPLOAD_AVATAR_FAIL,
} from '../constants/UserConstants';

export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true };
        case USER_LOGIN_SUCCESS:
            return {
                loading: false,
                userInfo: action.payload,
            };
        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload };
        case USER_LOGOUT:
            return {};
        default:
            return state;
    }
};

export const userUpdateProfileReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_UPDATE_PROFILE_REQUEST:
            return { loading: true };
        case USER_UPDATE_PROFILE_SUCCESS:
            return { loading: false, isSuccess: true };
        case USER_UPDATE_PROFILE_FAIL:
            return { loading: false, error: action.payload };
        case USER_UPDATE_PROFILE_RESET:
            return {};
        default:
            return state;
    }
};

export const userCheckAccountReducer = (state = {}, action) => {
    switch (action.type) {
        case CHECK_ACCOUNT_REQUEST:
            return { loading: true };
        case CHECK_ACCOUNT_SUCCESS:
            return {
                loading: false,
                account: action.payload,
            };
        case CHECK_ACCOUNT_FAIL:
            return { loading: false, error: action.payload };
        case CHECK_ACCOUNT_RESET:
            return {};
        default:
            return state;
    }
};

export const userNumberPhoneReducer = (state = {}, action) => {
    switch (action.type) {
        case CHECK_NUMBER_PHONE_REQUEST:
            return { loading: true };
        case CHECK_NUMBER_PHONE_SUCCESS:
            return {
                loading: false,
                userPhone: action.payload,
            };
        case CHECK_NUMBER_PHONE_FAIL:
            return { loading: false, error: action.payload };
        case CHECK_NUMBER_PHONE_RESET:
            return {};
        default:
            return state;
    }
};

export const userEmailReducer = (state = {}, action) => {
    switch (action.type) {
        case CHECK_USER_EMAIL_REQUEST:
            return { loading: true };
        case CHECK_USER_EMAIL_SUCCESS:
            return {
                loading: false,
                userInfo: action.payload,
            };
        case CHECK_USER_EMAIL_FAIL:
            return { loading: false, error: action.payload };
        case CHECK_USER_EMAIL_RESET:
            return {};
        case SAVE_USER_EMAIL_TEMPORARY:
            return {
                emailTemporary: action.payload,
            };
        default:
            return state;
    }
};

export const userCodeReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_CODE_REQUEST:
            return { loading: true };
        case USER_CODE_SUCCESS:
            return {
                loading: false,
                userInfo: action.payload,
            };
        case USER_CODE_FAIL:
            return { loading: false, error: action.payload };
        case USER_CODE_RESET:
            return {};
        default:
            return state;
    }
};

export const userUpdateAvatarReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_UPDATE_AVATAR_REQUEST:
            return { loading: true };
        case USER_UPDATE_AVATAR_SUCCESS:
            return { loading: false };
        case USER_UPDATE_AVATAR_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const userThemeReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_THEME_SUCCESS:
            return { theme: action.payload };
        case USER_THEME_RESET:
            return {};
        default:
            return state;
    }
};

export const userProfileReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_PROFILE_REQUEST:
            return { loading: true };
        case USER_PROFILE_SUCCESS:
            return { loading: false, userInfo: action.payload };
        case USER_PROFILE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const userProfileStrangerReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_PROFILE_STRANGER_REQUEST:
            return { loading: true };
        case USER_PROFILE_STRANGER_SUCCESS:
            return { loading: false, userInfo: action.payload };
        case USER_PROFILE_STRANGER_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const userFollowReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_FOLLOW_REQUEST:
            return { loading: true };
        case USER_FOLLOW_SUCCESS:
            return { loading: false, isSuccess: true };
        case USER_FOLLOW_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const userListFollowReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LIST_FOLLOW_REQUEST:
            return { loading: true };
        case USER_LIST_FOLLOW_SUCCESS:
            return { loading: false, following: action.payload };
        case USER_LIST_FOLLOW_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const postListProfileStrangerReducer = (state = {}, action) => {
    switch (action.type) {
        case POST_LIST_PROFILE_STRANGER_REQUEST:
            return { loading: true };
        case POST_LIST_PROFILE_STRANGER_SUCCESS:
            return { loading: false, posts: action.payload };
        case POST_LIST_PROFILE_STRANGER_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const userBlockReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_BLOCK_REQUEST:
            return { loading: true };
        case USER_BLOCK_SUCCESS:
            return { loading: false, isSuccess: true };
        case USER_BLOCK_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const userMuteReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_MUTE_REQUEST:
            return { loading: true };
        case USER_MUTE_SUCCESS:
            return { loading: false, isSuccess: true };
        case USER_MUTE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const userListBlockReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LIST_BLOCK_REQUEST:
            return { loading: true };
        case USER_LIST_BLOCK_SUCCESS:
            return { loading: false, block: action.payload };
        case USER_LIST_BLOCK_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const userListMuteReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LIST_MUTE_REQUEST:
            return { loading: true };
        case USER_LIST_MUTE_SUCCESS:
            return { loading: false, mute: action.payload };
        case USER_LIST_MUTE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const userUploadAvatarReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_UPLOAD_AVATAR_REQUEST:
            return { loading: true };
        case USER_UPLOAD_AVATAR_SUCCESS:
            return { loading: false, isSuccess: true };
        case USER_UPLOAD_AVATAR_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
