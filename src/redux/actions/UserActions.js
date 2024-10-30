// import { initSocket } from '../../services/socket.service';
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    CHECK_NUMBER_PHONE_REQUEST,
    CHECK_NUMBER_PHONE_SUCCESS,
    CHECK_NUMBER_PHONE_FAIL,
    USER_UPDATE_AVATAR_REQUEST,
    USER_UPDATE_AVATAR_SUCCESS,
    USER_UPDATE_AVATAR_FAIL,
    USER_THEME_SUCCESS,
    USER_THEME_RESET,
    CHECK_USER_EMAIL_REQUEST,
    CHECK_USER_EMAIL_SUCCESS,
    CHECK_USER_EMAIL_FAIL,
    USER_CODE_REQUEST,
    USER_CODE_SUCCESS,
    USER_CODE_FAIL,
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
    USER_GET_FOLLOWER_REQUEST,
    USER_GET_FOLLOWER_SUCCESS,
    USER_GET_FOLLOWER_FAIL,
    USER_GET_FOLLOWER_STRANGER_REQUEST,
    USER_GET_FOLLOWER_STRANGER_SUCCESS,
    USER_GET_FOLLOWER_STRANGER_FAIL,
    USER_GET_FOLLOWING_REQUEST,
    USER_GET_FOLLOWING_SUCCESS,
    USER_GET_FOLLOWING_FAIL,
    USER_GET_FOLLOWING_STRANGER_REQUEST,
    USER_GET_FOLLOWING_STRANGER_SUCCESS,
    USER_GET_FOLLOWING_STRANGER_FAIL,
    USER_SHARE_POST_REQUEST,
    USER_SHARE_POST_SUCCESS,
    USER_SHARE_POST_FAIL,
    USER_ADD_VIEW_POST_REQUEST,
    USER_ADD_VIEW_POST_SUCCESS,
    USER_ADD_VIEW_POST_FAIL,
    USER_REPORT_ACC_REQUEST,
    USER_REPORT_ACC_SUCCESS,
    USER_REPORT_ACC_FAIL,
    USER_SEARCH_REQUEST,
    USER_SEARCH_SUCCESS,
    USER_SEARCH_FAIL,
    USER_DELETE_ACCOUNT_REQUEST,
    USER_DELETE_ACCOUNT_SUCCESS,
    USER_DELETE_ACCOUNT_FAIL,
    USER_ADD_RECENT_SEARCH_REQUEST,
    USER_ADD_RECENT_SEARCH_SUCCESS,
    USER_ADD_RECENT_SEARCH_FAIL,
    USER_GET_RECENT_SEARCH_REQUEST,
    USER_GET_RECENT_SEARCH_SUCCESS,
    USER_GET_RECENT_SEARCH_FAIL,
    USER_CLEAR_RECENT_SEARCH_REQUEST,
    USER_CLEAR_RECENT_SEARCH_SUCCESS,
    USER_CLEAR_RECENT_SEARCH_FAIL,
    USER_GET_NOTIFICATION_REQUEST,
    USER_GET_NOTIFICATION_SUCCESS,
    USER_GET_NOTIFICATION_FAIL,
    USER_SETTING_NOTIFICATION_REQUEST,
    USER_SETTING_NOTIFICATION_SUCCESS,
    USER_SETTING_NOTIFICATION_FAIL,
    USER_CHANGE_PASSWORD_REQUEST,
    USER_CHANGE_PASSWORD_SUCCESS,
    USER_CHANGE_PASSWORD_FAIL,
    USER_LIST_NOTIFICATION_REQUEST,
    USER_LIST_NOTIFICATION_SUCCESS,
    USER_LIST_NOTIFICATION_FAIL,
    USER_CODE_RESET,
    USER_PROFILE_RESET,
    USER_LANGUAGE_SUCCESS,
    USER_BLOCKED_YOU_REQUEST,
    USER_BLOCKED_YOU_SUCCESS,
    USER_BLOCKED_YOU_FAIL,
} from '../constants/UserConstants';
import axios from 'axios';

const preset_key = 'hu9yg0hm';
const cloud_name = 'dfavmxigs';

export const login = (__data) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });
        const config = {
            headers: {
                Content_type: 'application/json',
            },
        };
        const { data } = await axios.post(
            'https://talkie.transtechvietnam.com/login',
            __data,
            config,
        );

        const token = { token: data.token };

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: token,
        });
        localStorage.setItem('userInfo', JSON.stringify(token));
    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo');
    dispatch({
        type: CHECK_ACCOUNT_RESET,
    });
    dispatch({
        type: USER_LOGOUT,
    });
    dispatch({
        type: USER_PROFILE_RESET,
    });
    dispatch({
        type: USER_CODE_RESET,
    });
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST,
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
        const { data } = await axios.put(
            `https://talkie.transtechvietnam.com/update-user`,
            user,
            config,
        );
        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
        });
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data?.results,
        });
        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        const message =
            error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        if (message === 'Not authorized, token failed') {
            dispatch(logout());
        }
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: message,
        });
    }
};

export const checkUserAccount = (__data) => async (dispatch) => {
    try {
        dispatch({
            type: CHECK_ACCOUNT_REQUEST,
        });
        const { data } = await axios.post(
            `https://talkie.transtechvietnam.com/check-account`,
            __data,
        );
        dispatch({
            type: CHECK_ACCOUNT_SUCCESS,
            payload: data,
        });
        if (data?.login === 2) {
            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: data,
            });
            localStorage.setItem('userInfo', JSON.stringify(data));
        }
    } catch (error) {
        dispatch({
            type: CHECK_ACCOUNT_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const checkUserNumberPhone =
    (phone, isSuccess = false) =>
    async (dispatch) => {
        try {
            dispatch({
                type: CHECK_NUMBER_PHONE_REQUEST,
            });
            const { data } = await axios.post(
                `https://talkie.transtechvietnam.com/check-phone`,
                {
                    phone,
                },
            );
            dispatch({
                type: CHECK_NUMBER_PHONE_SUCCESS,
                payload: data,
            });
        } catch (error) {
            dispatch({
                type: CHECK_NUMBER_PHONE_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };

export const checkUserEmail = (email) => async (dispatch) => {
    try {
        dispatch({
            type: CHECK_USER_EMAIL_REQUEST,
        });
        const { data } = await axios.post(
            `https://talkie.transtechvietnam.com/send-email`,
            {
                email,
            },
        );
        dispatch({
            type: CHECK_USER_EMAIL_SUCCESS,
            payload: data,
        });

        // console.log('token: data.token', data);

        // const token = { token: data.token };

        // localStorage.setItem('userInfo', JSON.stringify(token));
    } catch (error) {
        dispatch({
            type: CHECK_USER_EMAIL_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const checkUserCode = (email, otp) => async (dispatch) => {
    try {
        dispatch({
            type: USER_CODE_REQUEST,
        });
        const { data } = await axios.post(
            `https://talkie.transtechvietnam.com/verify-email`,
            {
                email,
                otp,
            },
        );

        dispatch({
            type: USER_CODE_SUCCESS,
            payload: data,
        });

        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_CODE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const verifyOTP = (uid, token) => async (dispatch) => {
    try {
        dispatch({
            type: USER_CODE_REQUEST,
        });

        const { data } = await axios.post(
            `https://talkie.transtechvietnam.com/verify-otp`,
            { uid, token },
        );

        dispatch({
            type: USER_CODE_SUCCESS,
            payload: data,
        });

        localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_CODE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const updateUserAvatar = (url) => async (dispatch) => {
    try {
        dispatch({
            type: USER_UPDATE_AVATAR_REQUEST,
        });
        const formData = new FormData();
        formData.append('file', url);
        formData.append('upload_preset', preset_key);
        const response = await axios.post(
            `https:/https://talkie.transtechvietnam.com.cloudinary.com/v1_1/${cloud_name}/image/upload`,
            formData,
        );
        dispatch({
            type: USER_UPDATE_AVATAR_SUCCESS,
        });
        dispatch(updateUserProfile({ avatar: `${response.data.url}` }));
    } catch (error) {
        dispatch({
            type: USER_UPDATE_AVATAR_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const themeDarkUser = () => async (dispatch) => {
    dispatch({
        type: USER_THEME_SUCCESS,
        payload: 'dark',
    });
    localStorage.setItem('theme', JSON.stringify('dark'));
};

export const languageUser = (language) => async (dispatch) => {
    dispatch({
        type: USER_LANGUAGE_SUCCESS,
        payload: language,
    });
    localStorage.setItem('language', JSON.stringify(language));
};

export const themeResetUser = () => async (dispatch) => {
    localStorage.removeItem('theme');
    dispatch({
        type: USER_THEME_RESET,
    });
};

export const profile = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_PROFILE_REQUEST,
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
            'https://talkie.transtechvietnam.com/get-profile',
            config,
        );
        if (!data.data[0]) {
            localStorage.removeItem('userInfo');
            window.location.href = '/';
        }
        dispatch({
            type: USER_PROFILE_SUCCESS,
            payload: data.data[0],
        });
    } catch (error) {
        dispatch({
            type: USER_PROFILE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
        if (
            error?.response?.status === 401 ||
            error?.response?.status === 403
        ) {
            localStorage.removeItem('userInfo');
            window.location.href = '/';
        }
    }
};

export const updateUser = (user) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST,
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
            'https://talkie.transtechvietnam.com/update-user',
            user,
            config,
        );
        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data?.results,
        });
        // localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const getProfileStranger =
    (stranger_id) => async (dispatch, getState) => {
        try {
            dispatch({
                type: USER_PROFILE_STRANGER_REQUEST,
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
                'https://talkie.transtechvietnam.com/get-profile-stranger',
                { stranger_id },
                config,
            );
            dispatch({
                type: USER_PROFILE_STRANGER_SUCCESS,
                payload: data.data[0] ?? [],
            });
        } catch (error) {
            dispatch({
                type: USER_PROFILE_STRANGER_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };

export const follow = (stranger_id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_FOLLOW_REQUEST,
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
            'https://talkie.transtechvietnam.com/follow',
            { stranger_id },
            config,
        );
        dispatch({
            type: USER_FOLLOW_SUCCESS,
            payload: stranger_id,
            results: data.results,
        });
    } catch (error) {
        dispatch({
            type: USER_FOLLOW_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const listFollow = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_LIST_FOLLOW_REQUEST,
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
            'https://talkie.transtechvietnam.com/get-following',
            config,
        );
        dispatch({
            type: USER_LIST_FOLLOW_SUCCESS,
            payload: data.data,
        });
    } catch (error) {
        dispatch({
            type: USER_LIST_FOLLOW_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const listPostProfileStranger =
    (stranger_id, status, limit, offset) => async (dispatch, getState) => {
        try {
            dispatch({
                type: POST_LIST_PROFILE_STRANGER_REQUEST,
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
            // get-profile-posts-stranger
            const { data } = await axios.post(
                `https://talkie.transtechvietnam.com/get-profile-${status}-stranger`,
                { stranger_id, limit, offset },
                config,
            );
            dispatch({
                type: POST_LIST_PROFILE_STRANGER_SUCCESS,
                payload: data.data,
            });
        } catch (error) {
            dispatch({
                type: POST_LIST_PROFILE_STRANGER_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };

export const block = (block_id, type) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_BLOCK_REQUEST,
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
            `https://talkie.transtechvietnam.com/${type}-acc`,
            { block_id },
            config,
        );
        dispatch({
            type: USER_BLOCK_SUCCESS,
            payload: data?.results,
            message: data?.message,
        });
    } catch (error) {
        dispatch({
            type: USER_BLOCK_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const mute = (mute_id, type) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_MUTE_REQUEST,
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
            `https://talkie.transtechvietnam.com/${type}-acc`,
            { mute_id },
            config,
        );
        dispatch({
            type: USER_MUTE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_MUTE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const listBlock = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_LIST_BLOCK_REQUEST,
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
            'https://talkie.transtechvietnam.com/list-blocked',
            config,
        );
        dispatch({
            type: USER_LIST_BLOCK_SUCCESS,
            payload: data.data,
        });
    } catch (error) {
        dispatch({
            type: USER_LIST_BLOCK_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const listMute = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_LIST_MUTE_REQUEST,
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
            'https://talkie.transtechvietnam.com/list-muted',
            config,
        );
        dispatch({
            type: USER_LIST_MUTE_SUCCESS,
            payload: data.data,
        });
    } catch (error) {
        dispatch({
            type: USER_LIST_MUTE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const uploadAvatar = (avatar) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPLOAD_AVATAR_REQUEST,
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
        formData.append('avatar', avatar);
        const { data } = await axios.post(
            'https://talkie.transtechvietnam.com/upload-avatar',
            formData,
            config,
        );
        setTimeout(() => {
            dispatch({
                type: USER_UPLOAD_AVATAR_SUCCESS,
            });
        }, 1500);
    } catch (error) {
        dispatch({
            type: USER_UPLOAD_AVATAR_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const getFollower = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_GET_FOLLOWER_REQUEST,
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
            'https://talkie.transtechvietnam.com/get-follower',
            config,
        );
        dispatch({
            type: USER_GET_FOLLOWER_SUCCESS,
            payload: data.data,
        });
    } catch (error) {
        dispatch({
            type: USER_GET_FOLLOWER_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const getFollowerStranger =
    (stranger_id) => async (dispatch, getState) => {
        try {
            dispatch({
                type: USER_GET_FOLLOWER_STRANGER_REQUEST,
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
                'https://talkie.transtechvietnam.com/get-follower-stranger',
                { stranger_id },
                config,
            );
            dispatch({
                type: USER_GET_FOLLOWER_STRANGER_SUCCESS,
                payload: data.data,
            });
        } catch (error) {
            dispatch({
                type: USER_GET_FOLLOWER_STRANGER_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };

export const getFollowing = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_GET_FOLLOWING_REQUEST,
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
            'https://talkie.transtechvietnam.com/get-following',
            config,
        );
        dispatch({
            type: USER_GET_FOLLOWING_SUCCESS,
            payload: data.data,
        });
    } catch (error) {
        dispatch({
            type: USER_GET_FOLLOWING_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const getFollowingStranger =
    (stranger_id) => async (dispatch, getState) => {
        try {
            dispatch({
                type: USER_GET_FOLLOWING_STRANGER_REQUEST,
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
                'https://talkie.transtechvietnam.com/get-following-stranger',
                { stranger_id },
                config,
            );
            dispatch({
                type: USER_GET_FOLLOWING_STRANGER_SUCCESS,
                payload: data.data,
            });
        } catch (error) {
            dispatch({
                type: USER_GET_FOLLOWING_STRANGER_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };

export const sharePost = (post_id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_SHARE_POST_REQUEST,
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
            'https://talkie.transtechvietnam.com/share',
            { post_id },
            config,
        );
        dispatch({
            type: USER_SHARE_POST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_SHARE_POST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const addViewPost = (post_id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_ADD_VIEW_POST_REQUEST,
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
            'https://talkie.transtechvietnam.com/add-view',
            { post_id },
            config,
        );
        dispatch({
            type: USER_ADD_VIEW_POST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_ADD_VIEW_POST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const reportAcc = (stranger_id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_REPORT_ACC_REQUEST,
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
            'https://talkie.transtechvietnam.com/report-acc',
            { stranger_id },
            config,
        );
        dispatch({
            type: USER_REPORT_ACC_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_REPORT_ACC_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

// post localhost:9999/search
export const search = (key) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_SEARCH_REQUEST,
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
            'https://talkie.transtechvietnam.com/search',
            { key },
            config,
        );
        dispatch({
            type: USER_SEARCH_SUCCESS,
            payload: data.data[0],
        });
    } catch (error) {
        dispatch({
            type: USER_SEARCH_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const deleteAccount = (_data) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_DELETE_ACCOUNT_REQUEST,
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
            'https://talkie.transtechvietnam.com/delete-account',
            _data,
            config,
        );
        dispatch({
            type: USER_DELETE_ACCOUNT_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_DELETE_ACCOUNT_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const addRecentSearch = (__data) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_ADD_RECENT_SEARCH_REQUEST,
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
            'https://talkie.transtechvietnam.com/add-recent-search',
            __data,
            config,
        );
        dispatch({
            type: USER_ADD_RECENT_SEARCH_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_ADD_RECENT_SEARCH_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const getRecentSearch =
    (limit = 100, offset = 0) =>
    async (dispatch, getState) => {
        try {
            dispatch({
                type: USER_GET_RECENT_SEARCH_REQUEST,
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
                'https://talkie.transtechvietnam.com/recent-search',
                { limit, offset },
                config,
            );
            dispatch({
                type: USER_GET_RECENT_SEARCH_SUCCESS,
                payload: data?.data,
            });
        } catch (error) {
            dispatch({
                type: USER_GET_RECENT_SEARCH_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };

export const clearRecentSearch = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_CLEAR_RECENT_SEARCH_REQUEST,
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
            'https://talkie.transtechvietnam.com/clear-recent-search',
            config,
        );
        dispatch({
            type: USER_CLEAR_RECENT_SEARCH_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: USER_CLEAR_RECENT_SEARCH_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const getNotification = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_GET_NOTIFICATION_REQUEST,
        });
        const {
            userLogin: { userInfo },
            userCode: { userInfo: userInfoCode },
        } = getState();
        const config = {
            headers: {
                'x-cypher-token': userInfo.token ?? userInfoCode.token,
            },
        };
        const { data } = await axios.get(
            'https://talkie.transtechvietnam.com/get-setting-notification',
            config,
        );
        dispatch({
            type: USER_GET_NOTIFICATION_SUCCESS,
            payload: data?.data?.[0],
        });
    } catch (error) {
        dispatch({
            type: USER_GET_NOTIFICATION_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const settingNotification = (data) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_SETTING_NOTIFICATION_REQUEST,
        });
        const {
            userLogin: { userInfo },
            userCode: { userInfo: userInfoCode },
        } = getState();
        const config = {
            headers: {
                'x-cypher-token': userInfo.token ?? userInfoCode.token,
            },
        };
        const { data: _data } = await axios.post(
            'https://talkie.transtechvietnam.com/setting-notification',
            data,
            config,
        );
        dispatch({
            type: USER_SETTING_NOTIFICATION_SUCCESS,
            payload: _data.results,
        });
    } catch (error) {
        dispatch({
            type: USER_SETTING_NOTIFICATION_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const changePassword = (data) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_CHANGE_PASSWORD_REQUEST,
        });
        const {
            userLogin: { userInfo },
            userCode: { userInfo: userInfoCode },
        } = getState();
        const config = {
            headers: {
                'x-cypher-token': userInfo.token ?? userInfoCode.token,
            },
        };
        const { data: _data } = await axios.post(
            'https://talkie.transtechvietnam.com/change-password',
            data,
            config,
        );
        dispatch({
            type: USER_CHANGE_PASSWORD_SUCCESS,
            payload: _data.results,
        });
    } catch (error) {
        dispatch({
            type: USER_CHANGE_PASSWORD_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const getBlockedYou = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_BLOCKED_YOU_REQUEST,
        });
        const {
            userLogin: { userInfo },
            userCode: { userInfo: userInfoCode },
        } = getState();
        const config = {
            headers: {
                'x-cypher-token': userInfo.token ?? userInfoCode.token,
            },
        };
        const { data } = await axios.get(
            'https://talkie.transtechvietnam.com/blocked-you',
            config,
        );
        dispatch({
            type: USER_BLOCKED_YOU_SUCCESS,
            payload: data?.data,
        });
    } catch (error) {
        dispatch({
            type: USER_BLOCKED_YOU_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const getListNotification =
    (key, limit = 10, offset = 0) =>
    async (dispatch, getState) => {
        try {
            dispatch({
                type: USER_LIST_NOTIFICATION_REQUEST,
            });
            const {
                userLogin: { userInfo },
                userCode: { userInfo: userInfoCode },
            } = getState();
            const config = {
                headers: {
                    'x-cypher-token': userInfo.token ?? userInfoCode.token,
                },
            };
            const { data } = await axios.post(
                `https://talkie.transtechvietnam.com/${
                    key ? `list-notification-${key}` : 'list-notification'
                }`,
                { limit, offset },
                config,
            );
            dispatch({
                type: USER_LIST_NOTIFICATION_SUCCESS,
                payload: data?.data,
                key,
            });
        } catch (error) {
            dispatch({
                type: USER_LIST_NOTIFICATION_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };
