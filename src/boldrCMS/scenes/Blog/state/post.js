import request from 'superagent';
import { push } from 'react-router-redux';
import fetch from '../../../core/fetch';
import { API_BASE, API_POSTS } from '../../../core/config';
import { notificationSend } from '../../Boldr/state/notifications';
import { processResponse } from '../../../core/api/helpers';
import * as types from './constants';

const requestPosts = () => {
  return { type: types.FETCH_POSTS_REQUEST };
};
const receivePosts = (json) => ({
  type: types.FETCH_POSTS_SUCCESS,
  data: json.data,
  pagination: json.pagination
});
const receivePostsFailed = (err) => ({
  type: types.FETCH_POSTS_FAILURE, error: err
});

/**
 * @function fetchPostsIfNeeded
 * @description Function that determines whether or not posts need to be
 * fetched from the api. Dispatches either the fetchPosts Function
 * or returns the resolved promise if the posts are up to date.
 * @return {Promise} Posts Promise that resolves when posts are fetched
 * or they arent required to be refreshed.
 */
export function fetchPostsIfNeeded() {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState())) {
      return dispatch(fetchPosts());
    }

    return Promise.resolve();
  };
}
/**
 * Called by fetchPostsIfNeeded to retrieve the state containing posts
 * @param  {Object} state   The blog state which contains posts
 */
function shouldFetchPosts(state) {
  const posts = state.posts;
  if (!posts.data) {
    return true;
  }
  if (posts.isLoading) {
    return false;
  }
  return posts;
}
/**
 * Function to retrieve posts from the api.
 * @return {Array} Posts returned as an array of post objects.
 */
export function fetchPosts() {
  return dispatch => {
    dispatch(requestPosts());
    return fetch(`${API_BASE}/posts`)
      .then(response => processResponse(response))
      .then(json => dispatch(receivePosts(json)))
      .catch(err => {
        dispatch(receivePostsFailed(err));
      });
  };
}

/**
 * CREATE ARTICLE ACTIONS
 */
const beginCreatePost = () => {
  return { type: types.CREATE_POST_REQUEST };
};

const createPostSuccess = (response) => {
  return {
    type: types.CREATE_POST_SUCCESS,
    payload: response.body
  };
};
const errorCreatingPost = (err) => {
  return {
    type: types.CREATE_POST_FAIL,
    error: err
  };
};

/**
 * Create a new article takes the submitted form-data as articleData and
 * sends the information to the api.
 * @param  {Object} articleData The data from the form / article editor
 * @return {Object}             Response object.
 */
export function createPost(postData) {
  return (dispatch) => {
    dispatch(beginCreatePost());
    return request
      .post(API_POSTS)
      .set('Authorization', `Bearer ${localStorage.getItem('token')}`)
      .send({
        title: postData.title,
        content: postData.content,
        tags: postData.tags,
        status: postData.status,
        excerpt: postData.excerpt
      })
      .then(response => {
        if (response.status === 201) {
          dispatch(createPostSuccess(response));
          dispatch(notificationSend({
            message: 'Post created successfully.',
            kind: 'info',
            dismissAfter: 3000
          }));
        }
      })
      .catch(err => {
        dispatch(errorCreatingPost(err));
      });
  };
}

/**
 * Select Post
 * @description Used when on the article list state.
 */
const requestTag = (articleId) => {
  return {
    type: types.LOAD_TAG_REQUEST,
    id: articleId
  };
};

const receiveTag = (response) => ({
  type: types.LOAD_TAG_SUCCESS,
  payload: response.body
});

const failedToReceiveTag = (err) => ({
  type: types.LOAD_TAG_FAILURE,
  error: err
});

/**
 * Takes the user selected article and fetches the data from
 * the api.
 * @param  {String} articleId Technically its the uuid, but for all
 * intents and purposes its a String
 * @return {Object}           The post object.
 */
export function selectPost(postId) {
  return (dispatch) => {
    dispatch(postSelected(postId));
    return request
      .get(`${API_POSTS}/id/${postId}`)
      .then(response => {
        if (response.status === 200) {
          dispatch(receiveSelectedPost(response));
        }
      })
      .catch(err => {
        dispatch(receiveSelectedPostFailed(err));
      });
  };
}


export const INITIAL_STATE = {
  isLoading: false,
  error: null,
  data: [],
  pagination: {}
};

/**
 * Blog Reducer
 * @param  {Object} state       The initial state
 * @param  {Object} action      The action object
 */
export default function postsReducer(state = INITIAL_STATE, action = {}) {
  switch (action.type) {
    case types.FETCH_POSTS_REQUEST:
    case types.LOAD_POST_REQUEST:
    case types.CREATE_POST_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case types.FETCH_POSTS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        pagination: action.pagination,
        data: action.data
      };
    case types.LOAD_POST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        selectedPost: action.payload
      };
    case types.CREATE_POST_SUCCESS:
      return {
        ...state,
        isLoading: false
      };
    case types.FETCH_POSTS_FAILURE:
    case types.LOAD_POST_FAILURE:
    case types.CREATE_POST_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    case types.SELECT_POST:
      return {
        ...state,
        isLoading: false,
        id: action.id,
        isEditing: true
      };
    case types.SELECT_POST_SUCCESS:
      return {
        ...state,
        isLoading: false,
        current: action.current,
        isEditing: true
      };
    case types.SELECT_POST_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.error,
        isEditing: true
      };
    default:
      return state;
  }
}