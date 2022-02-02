import axios from 'axios';
import { showAlert } from './alert';
export const createReview = async (review, rating, user, room) => {
    if(!user || !review || !rating )
    {
      return showAlert('error', "Review create Failed!")
    }
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/reviews/',
      data: {
        // email:email
        review,
        rating,
        user,
        room,
      },
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Review added successfully');
      window.setTimeout(() => {
        location.reload();
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
export const deleteReview = async (reviewID) => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/reviews/${reviewID}`,
    });

    if (res.data === '') showAlert('success', 'Review deleted successfully!');
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
export const editReview = async (token, data) => {

  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/reviews/${token}`,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Review Updated Successfully');
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert('error', "wait untill it process");
  }
};
