import {
    SET_OBJECT_ACTIVE,
    SET_OBJECT_AUDIO_CURRENT,
    SET_OBJECT_VIDEO_CURRENT,
} from '../constants/SurfConstants';

export const setObjectActive = (data) => async (dispatch) => {
    dispatch({
        type: SET_OBJECT_ACTIVE,
        payload: data,
    });
};

export const setObjectAudioCurrent = (data) => async (dispatch) => {
    dispatch({
        type: SET_OBJECT_AUDIO_CURRENT,
        payload: data,
    });
};

export const setObjectVideoCurrent = (data) => async (dispatch) => {
    dispatch({
        type: SET_OBJECT_VIDEO_CURRENT,
        payload: data,
    });
};
