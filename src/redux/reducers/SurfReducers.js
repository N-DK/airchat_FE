import {
    SET_OBJECT_ACTIVE,
    SET_OBJECT_AUDIO_CURRENT,
} from '../constants/SurfConstants';

export const setObjectActiveReducer = (state = {}, action) => {
    switch (action.type) {
        case SET_OBJECT_ACTIVE:
            return { object: action.payload };
        default:
            return state;
    }
};

export const setObjectAudioCurrentReducer = (state = {}, action) => {
    switch (action.type) {
        case SET_OBJECT_AUDIO_CURRENT:
            return { audioCurrent: action.payload };
        default:
            return state;
    }
};
