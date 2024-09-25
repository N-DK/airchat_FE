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
