import { push } from 'react-router-redux';
import * as api from '../../../../core/api';
import { notificationSend } from '../../notifications/notifications';
import * as t from './constants';

const fetchMediaStart = () => {
  return { type: t.GET_ATTACHMENT_REQUEST };
};

export function fetchMediaSuccess(response) {
  return {
    type: t.GET_ATTACHMENT_SUCCESS,
    payload: response.body,
  };
}

export function fetchMediaFail(err) {
  return {
    type: t.GET_ATTACHMENT_FAILURE,
    error: err,
  };
}

export function fetchMedia() {
  return (dispatch) => {
    dispatch(fetchMediaStart());
    return api.getAllAttachments()
      .then(response => {
        if (response.status !== 200) {
          dispatch(fetchMediaFail());
        }
        dispatch(fetchMediaSuccess(response));
      })
      .catch(err => {
        dispatch(fetchMediaFail(err));
      });
  };
}

const beginUpload = () => {
  return { type: t.UPLOAD_ATTACHMENT_REQUEST };
};

function uploadSuccess(response) {
  return {
    type: t.UPLOAD_ATTACHMENT_SUCCESS,
    payload: response.body,
  };
}

function uploadFail(err) {
  return {
    type: t.UPLOAD_ATTACHMENT_FAILURE,
    error: err,
  };
}

export function uploadFiles(payload) {
  return (dispatch) => {
    dispatch(beginUpload());
    return api.doUpload(payload)
      .then(response => {
        if (response.status === 201) {
          dispatch(uploadSuccess(response));
        }
      })
      .catch(err => {
        dispatch(uploadFail(err));
      });
  };
}
const beginUploadPostImage = () => {
  return { type: t.UPLOAD_POST_IMG_REQUEST };
};

function uploadPostImageSuccess(response) {
  return {
    type: t.UPLOAD_POST_IMG_SUCCESS,
    payload: response.body,
  };
}

function uploadPostImageFail(err) {
  return {
    type: t.UPLOAD_POST_IMG_FAILURE,
    error: err,
  };
}

export function uploadPostImage(payload) {
  return (dispatch) => {
    dispatch(beginUploadPostImage());
    return api.doUpload(payload)
      .then(response => {
        if (response.status === 201) {
          dispatch(uploadPostImageSuccess(response));
        }
      })
      .catch(err => {
        dispatch(uploadPostImageFail(err));
      });
  };
}
const deleteMediaFail = (err) => ({
  type: t.DELETE_ATTACHMENT_FAILURE,
  error: err,
});

export function deleteMedia(id) {
  return (dispatch) => {
    dispatch({
      type: t.DELETE_ATTACHMENT_REQUEST,
    });
    return api.delAttachment(id)
      .then(response => {
        dispatch({
          type: t.DELETE_ATTACHMENT_SUCCESS,
          id,
        });
      })
      .catch(err => {
        dispatch(deleteMediaFail(err));
      });
  };
}

export function updateAttachment(attachmentData) {
  return (dispatch: Function) => {
    console.log('action', attachmentData);
    dispatch(updateAttachmentReq());
    return api.updateFileProperties(attachmentData)
      .then(response => {
        dispatch(updateAttachmentSuccess(response));
        dispatch(notificationSend({
          message: 'Updated article.',
          kind: 'info',
          dismissAfter: 3000,
        }));
      })
      .catch(
        err => {
          dispatch(errorUpdateAttachment(err.message));
          dispatch(notificationSend({
            message: 'There was a problem updating the article.',
            kind: 'error',
            dismissAfter: 3000,
          }));
        });
  };
}
const updateAttachmentReq = () => {
  return { type: t.UPDATE_ATTACHMENT_REQUEST };
};
const updateAttachmentSuccess = (response) => {
  return { type: t.UPDATE_ATTACHMENT_SUCCESS };
};
const errorUpdateAttachment = (err) => {
  return {
    type: t.UPDATE_ATTACHMENT_FAILURE,
    error: err,
  };
};
// updateFileProperties

export function selectedFile(file: Object) {
  return {
    type: t.SELECT_FILE,
    file,
  };
}

export function selectFile(file) {
  return (dispatch) => {
    dispatch(selectedFile(file));
    return dispatch(push(`/admin/filemanager/${file.id}/editor`));
  };
}