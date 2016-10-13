import request from 'superagent';
import fetch from 'isomorphic-fetch';
import { API_PREFIX, API_USERS, TOKEN_KEY, processResponse } from 'core';

export function doFetchMembers() {
  return request
    .get(`${API_USERS}`);
}

export function doUpdateMember(userData) {
  const payload = {
    display_name: userData.display_name,
    first_name: userData.first_name,
    last_name: userData.last_name,
    roleId: userData.roleId
  };
  return request
    .put(`${API_USERS}/${userData.id}`)
    .set('Authorization', `Bearer ${localStorage.getItem(TOKEN_KEY)}`)
    .send(payload);
}
