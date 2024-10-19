import {
    POST_SUBMIT_REQUEST,
    POST_SUBMIT_SUCCESS,
    POST_SUBMIT_FAIL,
    POST_SUBMIT_RESET,
    POST_LIST_REQUEST,
    POST_LIST_SUCCESS,
    POST_LIST_FAIL,
    POST_DETAILS_REQUEST,
    POST_DETAILS_SUCCESS,
    POST_DETAILS_FAIL,
    POST_LIST_RESET,
    MENU_BAR_REQUEST,
    MENU_BAR_SUCCESS,
    MENU_BAR_FAIL,
    POST_LIST_PROFILE_REQUEST,
    POST_LIST_PROFILE_SUCCESS,
    POST_LIST_PROFILE_FAIL,
    POST_LIST_PROFILE_RESET,
    POST_BOOKMARK_REQUEST,
    POST_BOOKMARK_SUCCESS,
    POST_BOOKMARK_FAIL,
    POST_HEART_REQUEST,
    POST_HEART_SUCCESS,
    POST_HEART_FAIL,
    POST_DELETE_REQUEST,
    POST_DELETE_SUCCESS,
    POST_DELETE_FAIL,
    POST_REPORT_REQUEST,
    POST_REPORT_SUCCESS,
    POST_REPORT_FAIL,
    POST_UPLOAD_IMAGE_REQUEST,
    POST_UPLOAD_IMAGE_SUCCESS,
    POST_UPLOAD_IMAGE_RESET,
    POST_UPLOAD_IMAGE_FAIL,
    POST_DELETE_PHOTO_REQUEST,
    POST_DELETE_PHOTO_SUCCESS,
    POST_DELETE_PHOTO_FAIL,
    SET_POST_ACTIVE,
    POST_UPDATE_REQUEST,
    POST_UPDATE_SUCCESS,
    POST_UPDATE_FAIL,
    POST_REPLY_ALL_REQUEST,
    POST_REPLY_ALL_SUCCESS,
    POST_REPLY_ALL_FAIL,
    POST_REPLY_ALL_RESET,
} from '../constants/PostConstants';

export const postSubmitReducer = (state = {}, action) => {
    switch (action.type) {
        case POST_SUBMIT_REQUEST:
            return { loading: true };
        case POST_SUBMIT_SUCCESS:
            return {
                loading: false,
                success: action.payload,
            };
        case POST_SUBMIT_RESET:
            return {};
        case POST_SUBMIT_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const postListReducer = (state = { posts: [] }, action) => {
    switch (action.type) {
        case POST_LIST_REQUEST:
            return { loading: true, posts: [] };
        case POST_LIST_SUCCESS:
            return {
                loading: false,
                posts: action.payload,
            };
        case POST_LIST_RESET:
            return { posts: [] };
        case POST_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const postDetailsReducer = (state = { post: {} }, action) => {
    switch (action.type) {
        case POST_DETAILS_REQUEST:
            return { loading: true };
        case POST_DETAILS_SUCCESS:
            return {
                loading: false,
                post: action.payload,
            };
        case POST_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const menuBarReducer = (state = { menus: [] }, action) => {
    switch (action.type) {
        case MENU_BAR_REQUEST:
            return { loading: true, posts: [] };
        case MENU_BAR_SUCCESS:
            return {
                loading: false,
                menus: action.payload,
            };
        case MENU_BAR_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const postListProfileReducer = (state = {}, action) => {
    switch (action.type) {
        case POST_LIST_PROFILE_REQUEST:
            return { loading: true };
        case POST_LIST_PROFILE_SUCCESS:
            return {
                loading: false,
                posts: action.payload,
            };
        case POST_LIST_PROFILE_RESET:
            return {};
        case POST_LIST_PROFILE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const bookMarkReducer = (state = {}, action) => {
    switch (action.type) {
        case POST_BOOKMARK_REQUEST:
            return { loading: true };
        case POST_BOOKMARK_SUCCESS:
            return {
                loading: false,
                success: action.payload,
            };
        case POST_BOOKMARK_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const heartReducer = (state = {}, action) => {
    switch (action.type) {
        case POST_HEART_REQUEST:
            return { loading: true };
        case POST_HEART_SUCCESS:
            return {
                loading: false,
                success: action.payload,
            };
        case POST_HEART_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const deletePostReducer = (state = {}, action) => {
    switch (action.type) {
        case POST_DELETE_REQUEST:
            return { loading: true };
        case POST_DELETE_SUCCESS:
            return {
                loading: false,
                success: true,
            };
        case POST_DELETE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const reportPostReducer = (state = {}, action) => {
    switch (action.type) {
        case POST_REPORT_REQUEST:
            return { loading: true };
        case POST_REPORT_SUCCESS:
            return {
                loading: false,
                success: true,
            };
        case POST_REPORT_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const unReportPostReducer = (state = {}, action) => {
    switch (action.type) {
        case POST_REPORT_REQUEST:
            return { loading: true };
        case POST_REPORT_SUCCESS:
            return {
                loading: false,
                success: action.payload,
            };
        case POST_REPORT_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const postUploadImageReducer = (state = {}, action) => {
    switch (action.type) {
        case POST_UPLOAD_IMAGE_REQUEST:
            return { loading: true };
        case POST_UPLOAD_IMAGE_SUCCESS:
            return {
                loading: false,
                success: action.payload,
            };
        case POST_UPLOAD_IMAGE_RESET:
            return {};
        case POST_UPLOAD_IMAGE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const postDeletePhotoReducer = (state = {}, action) => {
    switch (action.type) {
        case POST_DELETE_PHOTO_REQUEST:
            return { loading: true };
        case POST_DELETE_PHOTO_SUCCESS:
            return {
                loading: false,
                success: action.payload,
            };
        case POST_DELETE_PHOTO_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const postUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case POST_UPDATE_REQUEST:
            return { loading: true };
        case POST_UPDATE_SUCCESS:
            return {
                loading: false,
                success: action.payload,
            };
        case POST_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const postReplyAllReducer = (state = {}, action) => {
    switch (action.type) {
        case POST_REPLY_ALL_REQUEST:
            return { loading: true };
        case POST_REPLY_ALL_SUCCESS:
            return {
                loading: false,
                replyAlls: action.payload,
            };
        case POST_REPLY_ALL_RESET:
            return {};
        case POST_REPLY_ALL_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const setPostActiveReducer = (state = {}, action) => {
    switch (action.type) {
        case SET_POST_ACTIVE:
            return { post: action.payload };
        default:
            return state;
    }
};
