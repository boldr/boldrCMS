import { beforeEach, describe, it } from 'mocha';
import sinon from 'sinon';
import expect from 'expect';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import request from 'supertest';
import reducer, {
LOGIN_REQUEST,
LOGIN_SUCCESS,
LOGIN_FAIL,
LOGOUT_USER, doLogin } from './auth';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
// request = request('http://localhost:8000/api/v1/articles');


describe('authReducer', () => {
  const initialState = {
    loaded: false,
    isLoading: false,
    role: '',
    token: '',
    hydrated: true
  };

  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(initialState);
  });

  it('should handle LOGIN_REQUEST', () => {
    expect(
      reducer(undefined, { type: LOGIN_REQUEST })
    ).toEqual(Object.assign({}, initialState, {
      isLoading: true,
      loaded: false,
      isAuthenticated: false,
      role: '',
      token: '',
      hydrated: true
    }));
  });

  it('should handle LOGIN_SUCCESS', () => {
    expect(
      reducer(undefined, { type: LOGIN_SUCCESS })
    ).toEqual(Object.assign({}, initialState, {
      isLoading: false,
      loaded: true,
      isAuthenticated: true,
      token: undefined,
      role: undefined,
      hydrated: true
    }));
  });

  it('should handle LOGIN_FAIL', () => {
    const message = 'Success';
    expect(
      reducer(undefined, { type: LOGIN_FAIL })
    ).toEqual(Object.assign({}, initialState, {
      isLoading: false,
      loaded: false,
      isAuthenticated: false,
      hydrated: true
    }));
  });
});
