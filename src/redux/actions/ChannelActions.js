import axios from "axios";
import {
  CHANNEL_LIST_REQUEST,
  CHANNEL_LIST_SUCCESS,
  CHANNEL_LIST_FAIL,
  CHANNEL_POSTS_REQUEST,
  CHANNEL_POSTS_SUCCESS,
  CHANNEL_POSTS_FAIL,
} from "../constants/ChannelConstants";

export const listChannel = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: CHANNEL_LIST_REQUEST,
    });
    const {
      userLogin: { userInfo },
    } = getState();
    const config = {
      headers: {
        "x-cypher-token": userInfo.token,
      },
    };
    const { data } = await axios.get(
      "https://talkie.transtechvietnam.com/see-all",
      config
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

export const postsChannel = (id) => async (dispatch) => {
  try {
    dispatch({
      type: CHANNEL_POSTS_REQUEST,
    });
    const { data } = await axios.get(
      `https://talkie.transtechvietnam.com/channels/${id}`
    );
    dispatch({
      type: CHANNEL_POSTS_SUCCESS,
      payload: data,
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
