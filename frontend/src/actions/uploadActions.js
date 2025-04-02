// uploadActions.js
import axios from 'axios';
import { 
  UPLOAD_FILE_REQUEST, 
  UPLOAD_FILE_SUCCESS, 
  UPLOAD_FILE_FAIL 
} from '../constants/uploadConstants';

export const uploadFileAction = (file) => async (dispatch, getState) => {
  try {
    dispatch({ type: UPLOAD_FILE_REQUEST });
    
    const {
      userLogin: { userInfo },
    } = getState();

    const formData = new FormData();
    formData.append('file', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post('/api/upload/uploadfile', formData, config);

    dispatch({
      type: UPLOAD_FILE_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: UPLOAD_FILE_FAIL,
      payload: error.response?.data?.message || 'File upload failed',
    });
  }
};
