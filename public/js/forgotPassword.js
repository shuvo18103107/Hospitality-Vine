import axios from 'axios';
import { showAlert } from './alert';
export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        // email:email
        email,
      },
    });
    
    //now check we get the data back successfully or not
    if (res.data.status === 'success') {
      showAlert('success', 'A Password Reset Token is Sent to Your Email📧');
      window.setTimeout(() => {
        //load another page(home page) we use location.assign
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err)
    // alert(err.response.data.message)
    showAlert('error', err.response.data.message);
  }
};
export const resetPassword = async (token, password, passwordConfirm) => {
  // console.log(token, password, passwordConfirm);

  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm,
      },
    });
    //now check we get the data back successfully or not
    if (res.data.status === 'success') {
      showAlert(
        'success',
        'your Password is changed. Welcome back to the application 🎉'
      );
      window.setTimeout(() => {
        //load another page(home page) we use location.assign
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    // alert(err.response.data.message)
    showAlert('error', err.response.data.message);
  }
};
