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
} from '../constants/UserConstants';
import axios from 'axios';

const preset_key = 'hu9yg0hm';
const cloud_name = 'dfavmxigs';

export const login = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });
        // const config = {
        //     headers: {
        //         Content_type: 'application/json',
        //     },
        // };
        // const { data } = await axios.post(
        //     'https://talkie.transtechvietnam.com/login',
        //     { email, password },
        //     config,
        // );
        const token = {
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwLCJwaG9uZSI6bnVsbCwiZW1haWwiOiJuZGsyNzExMDNAZ21haWwuY29tIiwiaWF0IjoxNzI3MjY0MzE4LCJleHAiOjE3Mjk4NTYzMTh9.6ksM56hJbicDGZlO34_jhuRKam3ZBFc33NH-6HBU6aM',
        };
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
        type: USER_LOGOUT,
    });
    dispatch({
        type: CHECK_ACCOUNT_RESET,
    });
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST,
        });
        const {
            userLogin: { userInfo },
        } = getState();
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
                Content_type: 'application/json',
            },
        };
        const { data } = await axios.put(
            `https://talkie.transtechvietnam.com/users/profile`,
            user,
            config,
        );
        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
        });
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data,
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

export const checkUserAccount = (email) => async (dispatch) => {
    try {
        dispatch({
            type: CHECK_ACCOUNT_REQUEST,
        });
        const { data } = await axios.post(
            `https://talkie.transtechvietnam.com/check-account`,
            { email },
        );
        dispatch({
            type: CHECK_ACCOUNT_SUCCESS,
            payload: data,
        });
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
    (numberphone, isSuccess = false) =>
    async (dispatch) => {
        try {
            dispatch({
                type: CHECK_NUMBER_PHONE_REQUEST,
            });
            const { data } = await axios.post(
                `https://talkie.transtechvietnam.com/users/checknumberphone`,
                {
                    numberphone,
                    isSuccess,
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

        console.log('token: data.token', data);

        const token = { token: data.token };

        localStorage.setItem('userInfo', JSON.stringify(token));
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

        console.log(data);

        dispatch({
            type: USER_CODE_SUCCESS,
            payload: data,
        });
        // dispatch({
        //   type: USER_LOGIN_SUCCESS,
        //   payload: data.token,
        // });
        // localStorage.setItem("userInfo", JSON.stringify(data.token));
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
        } = getState();
        const config = {
            headers: {
                'x-cypher-token': userInfo.token,
            },
        };
        const { data } = await axios.get(
            'https://talkie.transtechvietnam.com/get-profile',
            config,
        );
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
    }
};

export const updateUser = (user) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST,
        });
        const {
            userLogin: { userInfo },
        } = getState();
        const config = {
            headers: {
                'x-cypher-token': userInfo.token,
            },
        };
        const { data } = await axios.post(
            'https://talkie.transtechvietnam.com/update-user',
            user,
            config,
        );
        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
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
            } = getState();
            const config = {
                headers: {
                    'x-cypher-token': userInfo.token,
                },
            };
            const { data } = await axios.post(
                'https://talkie.transtechvietnam.com/get-profile-stranger',
                { stranger_id },
                config,
            );
            dispatch({
                type: USER_PROFILE_STRANGER_SUCCESS,
                payload: data.data[0],
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
        } = getState();
        const config = {
            headers: {
                'x-cypher-token': userInfo.token,
            },
        };
        const { data } = await axios.post(
            'https://talkie.transtechvietnam.com/follow',
            { stranger_id },
            config,
        );
        dispatch({
            type: USER_FOLLOW_SUCCESS,
            payload: data,
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
        } = getState();
        const config = {
            headers: {
                'x-cypher-token': userInfo.token,
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
            } = getState();
            const config = {
                headers: {
                    'x-cypher-token': userInfo.token,
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
        } = getState();
        const config = {
            headers: {
                'x-cypher-token': userInfo.token,
            },
        };
        const { data } = await axios.post(
            `https://talkie.transtechvietnam.com/${type}-acc`,
            { block_id },
            config,
        );
        dispatch({
            type: USER_BLOCK_SUCCESS,
            payload: data,
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
        } = getState();
        const config = {
            headers: {
                'x-cypher-token': userInfo.token,
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
        } = getState();
        const config = {
            headers: {
                'x-cypher-token': userInfo.token,
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
        } = getState();
        const config = {
            headers: {
                'x-cypher-token': userInfo.token,
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
        } = getState();
        const config = {
            headers: {
                'x-cypher-token': userInfo.token,
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
