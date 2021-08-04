import axios from 'axios';
import { showAlert } from './alert';

// Type is data or Password
export const updateSettings = async (type, data) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });

    if (res.data.status) {
      showAlert('success', `${type.toUpperCase()} updated successfully.`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
