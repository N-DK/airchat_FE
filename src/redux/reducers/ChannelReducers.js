import {
  CHANNEL_LIST_REQUEST,
  CHANNEL_LIST_SUCCESS,
  CHANNEL_LIST_FAIL,
  CHANNEL_POSTS_REQUEST,
  CHANNEL_POSTS_SUCCESS,
  CHANNEL_POSTS_FAIL,
} from "../constants/ChannelConstants";

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
      };
    case CHANNEL_POSTS_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
