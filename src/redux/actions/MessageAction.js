import axios from 'axios';
import {
    LIST_MESSAGE_REQUEST,
    LIST_MESSAGE_SUCCESS,
    LIST_MESSAGE_FAIL,
    DETAIL_MESSAGE_REQUEST,
    DETAIL_MESSAGE_SUCCESS,
    DETAIL_MESSAGE_FAIL,
    SEARCH_USER_REQUEST,
    SEARCH_USER_SUCCESS,
    SEARCH_USER_FAIL,
    DISCONNECT_SOCKET,
    CONNECT_SOCKET_FAIL,
    CONNECT_SOCKET_SUCCESS,
    CONNECT_SOCKET_REQUEST,
} from '../constants/MessageConstants';
import { io } from 'socket.io-client';

export const listMessageRecent =
    (limit = 10, offset = 0) =>
    async (dispatch, getState) => {
        try {
            dispatch({ type: LIST_MESSAGE_REQUEST });
            const {
                userLogin: { userInfo },
                userCode: { userInfo: userInfoCode },
            } = getState();
            const config = {
                headers: {
                    'x-cypher-token': userInfo?.token ?? userInfoCode?.token,
                },
            };
            const { data } = await axios.post(
                'https://talkie.transtechvietnam.com/list-message-recent',
                { limit, offset },
                config,
            );
            dispatch({ type: LIST_MESSAGE_SUCCESS, payload: data.data });
        } catch (error) {
            dispatch({
                type: LIST_MESSAGE_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };

export const detailMessage =
    (friend_id, limit = 10, offset = 0) =>
    async (dispatch, getState) => {
        try {
            dispatch({ type: DETAIL_MESSAGE_REQUEST });
            const {
                userLogin: { userInfo },
                userCode: { userInfo: userInfoCode },
            } = getState();
            const config = {
                headers: {
                    'x-cypher-token': userInfo?.token ?? userInfoCode?.token,
                },
            };
            const { data } = await axios.post(
                'https://talkie.transtechvietnam.com/detail-conversation',
                { friend_id, limit, offset },
                config,
            );
            dispatch({ type: DETAIL_MESSAGE_SUCCESS, payload: data.data });
        } catch (error) {
            dispatch({
                type: DETAIL_MESSAGE_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };

export const searchUser = (key) => async (dispatch, getState) => {
    try {
        dispatch({ type: SEARCH_USER_REQUEST });
        const {
            userLogin: { userInfo },
            userCode: { userInfo: userInfoCode },
        } = getState();
        const config = {
            headers: {
                'x-cypher-token': userInfo?.token ?? userInfoCode?.token,
            },
        };
        const { data } = await axios.post(
            'https://talkie.transtechvietnam.com/search-friends-chat',
            { key },
            config,
        );
        dispatch({ type: SEARCH_USER_SUCCESS, payload: data.data });
    } catch (error) {
        dispatch({
            type: SEARCH_USER_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const connectSocket = () => async (dispatch, getState) => {
    try {
        dispatch({ type: CONNECT_SOCKET_REQUEST });

        const {
            userLogin: { userInfo },
            userCode: { userInfo: userInfoCode },
        } = getState();

        const token = userInfo?.token ?? userInfoCode?.token;

        const socket = io('https://talkie.transtechvietnam.com', {
            query: { token },
        });

        socket.on('connect', () => {
            dispatch({ type: CONNECT_SOCKET_SUCCESS, payload: socket });
        });

        socket.on('disconnect', () => {
            dispatch({ type: DISCONNECT_SOCKET });
        });

        socket.on('connect_error', (error) => {
            dispatch({ type: CONNECT_SOCKET_FAIL, payload: error.message });
        });
    } catch (error) {
        console.log(error);
        dispatch({
            type: CONNECT_SOCKET_FAIL,
            payload: error.message,
        });
    }
};

export const disconnectSocket = () => (dispatch, getState) => {
    const { socket } = getState().socket;
    if (socket) {
        socket.disconnect();
    }
    dispatch({ type: DISCONNECT_SOCKET });
};
