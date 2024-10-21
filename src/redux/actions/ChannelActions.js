import axios from 'axios';
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
} from '../constants/ChannelConstants';

export const listChannel = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: CHANNEL_LIST_REQUEST,
        });
        const {
            userLogin: { userInfo },
            userCode: { userInfo: userInfoCode },
        } = getState();
        const config = {
            headers: {
                'x-cypher-token': userInfo?.token ?? userInfoCode?.token,
            },
        };
        const { data } = await axios.get(
            'https://talkie.transtechvietnam.com/see-all',
            config,
        );
        dispatch({
            type: CHANNEL_LIST_SUCCESS,
            payload: data.data[0],
        });
    } catch (error) {
        dispatch({
            type: CHANNEL_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const postsChannel =
    (channel_id, limit = 100, offset = 0, trending = 1) =>
    async (dispatch, getState) => {
        try {
            dispatch({
                type: CHANNEL_POSTS_REQUEST,
            });
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
                `https://talkie.transtechvietnam.com/group-channel`,
                { limit, offset, channel_id },
                config,
            );
            dispatch({
                type: CHANNEL_POSTS_SUCCESS,
                payload: data.data,
                owner: data?.owner,
            });
        } catch (error) {
            dispatch({
                type: CHANNEL_POSTS_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };

export const addChannel =
    (name, photo, channel_id = null) =>
    async (dispatch, getState) => {
        try {
            dispatch({
                type: CHANNEL_ADD_REQUEST,
            });
            const {
                userLogin: { userInfo },
                userCode: { userInfo: userInfoCode },
            } = getState();
            const config = {
                headers: {
                    'x-cypher-token': userInfo?.token ?? userInfoCode?.token,
                },
            };
            const formData = new FormData();
            formData.append('photo', photo);
            formData.append('name', name);
            if (channel_id) {
                formData.append('channel_id', channel_id);
            }
            const { data } = await axios.post(
                'https://talkie.transtechvietnam.com/add-channel',
                formData,
                config,
            );
            dispatch({
                type: CHANNEL_ADD_SUCCESS,
                payload: data,
            });
        } catch (error) {
            dispatch({
                type: CHANNEL_ADD_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };

export const pinChannel = (channel_id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CHANNEL_PIN_REQUEST,
        });
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
            'https://talkie.transtechvietnam.com/pinned-channel',
            { channel_id },
            config,
        );
        dispatch({
            type: CHANNEL_PIN_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: CHANNEL_PIN_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const deleteChannel = (channel_id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CHANNEL_DELETE_REQUEST,
        });
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
            'https://talkie.transtechvietnam.com/delete-channel',
            { channel_id },
            config,
        );
        dispatch({
            type: CHANNEL_DELETE_SUCCESS,
            payload: data?.results,
        });
    } catch (error) {
        dispatch({
            type: CHANNEL_DELETE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};
