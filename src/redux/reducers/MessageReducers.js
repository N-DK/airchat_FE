import {
    CONNECT_SOCKET_FAIL,
    CONNECT_SOCKET_REQUEST,
    CONNECT_SOCKET_SUCCESS,
    DETAIL_MESSAGE_FAIL,
    DETAIL_MESSAGE_REQUEST,
    DETAIL_MESSAGE_SUCCESS,
    DISCONNECT_SOCKET,
    LIST_MESSAGE_FAIL,
    LIST_MESSAGE_REQUEST,
    LIST_MESSAGE_SUCCESS,
    SEARCH_USER_FAIL,
    SEARCH_USER_REQUEST,
    SEARCH_USER_SUCCESS,
} from '../constants/MessageConstants';

export const listMessageReducers = (state = { messages: [] }, action) => {
    switch (action.type) {
        case LIST_MESSAGE_REQUEST:
            return { loading: true, messages: [] };
        case LIST_MESSAGE_SUCCESS:
            return { loading: false, listMessageRecent: action.payload };
        case LIST_MESSAGE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const detailMessageReducers = (state = { message: {} }, action) => {
    switch (action.type) {
        case DETAIL_MESSAGE_REQUEST:
            return { loading: true, message: {} };
        case DETAIL_MESSAGE_SUCCESS:
            return { loading: false, detailMessage: action.payload };
        case DETAIL_MESSAGE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const searchUserReducers = (state = { users: [] }, action) => {
    switch (action.type) {
        case SEARCH_USER_REQUEST:
            return { loading: true, users: [] };
        case SEARCH_USER_SUCCESS:
            return { loading: false, users: action.payload };
        case SEARCH_USER_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const socketReducer = (
    state = { socket: null, isConnected: false },
    action,
) => {
    switch (action.type) {
        case CONNECT_SOCKET_REQUEST:
            return { ...state, loading: true };
        case CONNECT_SOCKET_SUCCESS:
            return {
                loading: false,
                socket: action.payload,
                isConnected: true,
            };
        case CONNECT_SOCKET_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
                isConnected: false,
            };
        case DISCONNECT_SOCKET:
            return { ...state, socket: null, isConnected: false };
        default:
            return state;
    }
};
