import axios from 'axios';
import {
    POST_SUBMIT_REQUEST,
    POST_SUBMIT_SUCCESS,
    POST_SUBMIT_FAIL,
    POST_LIST_REQUEST,
    POST_LIST_SUCCESS,
    POST_LIST_FAIL,
    POST_DETAILS_REQUEST,
    POST_DETAILS_SUCCESS,
    POST_DETAILS_FAIL,
    MENU_BAR_REQUEST,
    MENU_BAR_SUCCESS,
    MENU_BAR_FAIL,
    POST_LIST_PROFILE_REQUEST,
    POST_LIST_PROFILE_SUCCESS,
    POST_LIST_PROFILE_FAIL,
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
} from '../constants/PostConstants';

export const submitPost =
    (content, audio, reply_post, photo, url, video, channel_id) =>
    async (dispatch, getState) => {
        try {
            dispatch({
                type: POST_SUBMIT_REQUEST,
            });
            const {
                userLogin: { userInfo },
                userCode: { userInfo: userInfoCode },
            } = getState();
            const formData = new FormData();
            formData.append('content', content);
            if (video) {
                formData.append('video', video);
            }
            if (audio) {
                formData.append('audio', audio);
            }
            if (reply_post) {
                formData.append('reply_post', reply_post);
            }
            if (url) {
                formData.append('url', url);
            }
            if (channel_id) {
                formData.append('channel_id', channel_id);
            }
            const config = {
                headers: {
                    'x-cypher-token': userInfo?.token ?? userInfoCode?.token,
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await axios.post(
                `https://talkie.transtechvietnam.com/post-status`,
                formData,
                config,
            );
            if (photo) {
                const id_post = data?.id;
                uploadImage(photo, id_post)(dispatch, getState);
            }
            // setTimeout(() => {

            // }, 1000);
            dispatch({
                type: POST_SUBMIT_SUCCESS,
                payload: {
                    ...data?.detail[0],
                    img: photo,
                },
            });
        } catch (error) {
            const message =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            if (message === 'Not authorized, token failed') {
                // dispatch(logout());
            }
            dispatch({
                type: POST_SUBMIT_FAIL,
                payload: message,
            });
        }
    };

export const listPost =
    (redirect, limit, offset, channel_id = null, trending = 0) =>
    async (dispatch, getState) => {
        try {
            dispatch({
                type: POST_LIST_REQUEST,
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
                `https://talkie.transtechvietnam.com/${redirect}`,
                { limit, offset, channel_id },
                config,
            );
            dispatch({
                type: POST_LIST_SUCCESS,
                payload: data.data,
            });
        } catch (error) {
            dispatch({
                type: POST_LIST_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };

export const detailsPost =
    (post_id, user_reply) => async (dispatch, getState) => {
        try {
            dispatch({
                type: POST_DETAILS_REQUEST,
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
                `https://talkie.transtechvietnam.com/detail-post-reply`,
                { post_id, user_reply },
                config,
            );
            dispatch({
                type: POST_DETAILS_SUCCESS,
                payload: data.data[0],
            });
        } catch (error) {
            dispatch({
                type: POST_DETAILS_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };

export const barMenu = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: MENU_BAR_REQUEST,
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
            'https://talkie.transtechvietnam.com/menu-bar',
            config,
        );
        dispatch({
            type: MENU_BAR_SUCCESS,
            payload: data.data,
        });
    } catch (error) {
        dispatch({
            type: MENU_BAR_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const getReplyAll = (post_id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: POST_REPLY_ALL_REQUEST,
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
            'https://talkie.transtechvietnam.com/all-reply-post',
            { post_id },
            config,
        );
        dispatch({
            type: POST_REPLY_ALL_SUCCESS,
            payload: data?.data?.[0],
        });
    } catch (error) {
        dispatch({
            type: POST_REPLY_ALL_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const listPostProfile =
    (status, limit, offset) => async (dispatch, getState) => {
        try {
            dispatch({
                type: POST_LIST_PROFILE_REQUEST,
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
                `https://talkie.transtechvietnam.com/get-profile-${status}`,
                { limit, offset },
                config,
            );
            dispatch({
                type: POST_LIST_PROFILE_SUCCESS,
                payload: data.data,
            });
        } catch (error) {
            dispatch({
                type: POST_LIST_PROFILE_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };

export const bookMark = (post_id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: POST_BOOKMARK_REQUEST,
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
            'https://talkie.transtechvietnam.com/bookmark',
            { post_id },
            config,
        );
        dispatch({
            type: POST_BOOKMARK_SUCCESS,
            payload: data.results,
        });
    } catch (error) {
        dispatch({
            type: POST_BOOKMARK_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const heart = (post_id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: POST_HEART_REQUEST,
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
            'https://talkie.transtechvietnam.com/heart',
            { post_id },
            config,
        );
        dispatch({
            type: POST_HEART_SUCCESS,
            payload: data.results,
        });
    } catch (error) {
        dispatch({
            type: POST_HEART_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const deletePost = (post_id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: POST_DELETE_REQUEST,
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
            'https://talkie.transtechvietnam.com/remove-post',
            { post_id },
            config,
        );
        dispatch({
            type: POST_DELETE_SUCCESS,
            payload: data.results,
        });
    } catch (error) {
        dispatch({
            type: POST_DELETE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const reportPost = (post_id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: POST_REPORT_REQUEST,
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
            'https://talkie.transtechvietnam.com/report-post',
            { post_id },
            config,
        );
        dispatch({
            type: POST_REPORT_SUCCESS,
            payload: data.results,
        });
    } catch (error) {
        dispatch({
            type: POST_REPORT_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const unReportPost = (post_id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: POST_REPORT_REQUEST,
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
            'https://talkie.transtechvietnam.com/unreport-post',
            { post_id },
            config,
        );
        dispatch({
            type: POST_REPORT_SUCCESS,
            payload: data.results,
        });
    } catch (error) {
        dispatch({
            type: POST_REPORT_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const uploadImage = (photo, id_post) => async (dispatch, getState) => {
    try {
        dispatch({
            type: POST_UPLOAD_IMAGE_REQUEST,
        });
        const {
            userLogin: { userInfo },
            userCode: { userInfo: userInfoCode },
        } = getState();
        const formData = new FormData();
        formData.append('photo', photo);
        formData.append('id_post', id_post);
        const config = {
            headers: {
                'x-cypher-token': userInfo?.token ?? userInfoCode?.token,
                'Content-Type': 'multipart/form-data',
            },
        };
        const { data } = await axios.post(
            `https://talkie.transtechvietnam.com/upload-photo-status`,
            formData,
            config,
        );
        dispatch({
            type: POST_UPLOAD_IMAGE_SUCCESS,
            payload: data.results,
        });
    } catch (error) {
        dispatch({
            type: POST_UPLOAD_IMAGE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const deletePhoto = (id_post) => async (dispatch, getState) => {
    try {
        dispatch({
            type: POST_DELETE_PHOTO_REQUEST,
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
            'https://talkie.transtechvietnam.com/delete-photo',
            { id_post },
            config,
        );
        dispatch({
            type: POST_DELETE_PHOTO_SUCCESS,
            payload: data.results,
        });
    } catch (error) {
        dispatch({
            type: POST_DELETE_PHOTO_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const updatePost = (id_post, __data) => async (dispatch, getState) => {
    try {
        dispatch({
            type: POST_UPDATE_REQUEST,
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
            `https://talkie.transtechvietnam.com/post-status-update`,
            { id_post, ...__data },
            config,
        );
        dispatch({
            type: POST_UPDATE_SUCCESS,
            payload: data.results,
        });
    } catch (error) {
        dispatch({
            type: POST_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const setPostActive = (post) => async (dispatch) => {
    dispatch({
        type: SET_POST_ACTIVE,
        payload: post,
    });
};
