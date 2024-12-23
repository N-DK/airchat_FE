import {
    CHANNEL_LIST_REQUEST,
    CHANNEL_LIST_SUCCESS,
    CHANNEL_LIST_FAIL,
    CHANNEL_POSTS_REQUEST,
    CHANNEL_POSTS_SUCCESS,
    CHANNEL_POSTS_FAIL,
    CHANNEL_ADD_REQUEST,
    CHANNEL_ADD_SUCCESS,
    CHANNEL_ADD_FAIL,
    CHANNEL_PIN_REQUEST,
    CHANNEL_PIN_SUCCESS,
    CHANNEL_PIN_FAIL,
    CHANNEL_DELETE_REQUEST,
    CHANNEL_DELETE_SUCCESS,
    CHANNEL_DELETE_FAIL,
    CHANNEL_DELETE_RESET,
    CHANNEL_ADD_RESET,
    CHANNEL_POSTS_RESET,
    CHANNEL_DETAIL_REQUEST,
    CHANNEL_DETAIL_SUCCESS,
    CHANNEL_DETAIL_FAIL,
} from '../constants/ChannelConstants';

export const channelListReducer = (state = { channels: [] }, action) => {
    switch (action.type) {
        case CHANNEL_LIST_REQUEST:
            return { loading: true };
        case CHANNEL_LIST_SUCCESS:
            return {
                loading: false,
                channels: action.payload,
            };
        case CHANNEL_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const channelPostsReducer = (state = { posts: [] }, action) => {
    switch (action.type) {
        case CHANNEL_POSTS_REQUEST:
            return { loading: true };
        case CHANNEL_POSTS_SUCCESS:
            return {
                loading: false,
                posts: action.payload,
                owner: action.owner,
                results: action.results,
            };
        case CHANNEL_POSTS_RESET:
            return { posts: null };
        case CHANNEL_POSTS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const channelAddReducer = (state = {}, action) => {
    switch (action.type) {
        case CHANNEL_ADD_REQUEST:
            return { loading: true };
        case CHANNEL_ADD_SUCCESS:
            return { loading: false, channel: action.payload };
        case CHANNEL_ADD_FAIL:
            return { loading: false, error: action.payload };
        case CHANNEL_ADD_RESET:
            return {};
        default:
            return state;
    }
};

export const channelPinReducer = (state = {}, action) => {
    switch (action.type) {
        case CHANNEL_PIN_REQUEST:
            return { loading: true };
        case CHANNEL_PIN_SUCCESS:
            return { loading: false, channel: action.payload };
        case CHANNEL_PIN_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const channelDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case CHANNEL_DELETE_REQUEST:
            return { loading: true };
        case CHANNEL_DELETE_SUCCESS:
            return { loading: false, isSuccess: action.payload };
        case CHANNEL_DELETE_FAIL:
            return { loading: false, error: action.payload };
        case CHANNEL_DELETE_RESET:
            return {};
        default:
            return state;
    }
};

export const channelDetailReducer = (state = { channel: null }, action) => {
    switch (action.type) {
        case CHANNEL_DETAIL_REQUEST:
            return { loading: true };
        case CHANNEL_DETAIL_SUCCESS:
            return { loading: false, channel: action.payload };
        case CHANNEL_DETAIL_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
