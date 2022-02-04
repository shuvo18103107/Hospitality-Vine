import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
  'pk_test_51KNu7cHahdodWJaRU6Npk27vb5wTrXMxynONTLCMi7TS1fmnRx4RWMYE27Dbm7FRdhgrYvh7wjejagastQhBluBY00JLR6q59w'
);

export const bookRoom = async roomID => {
  try {
    // 1) Get the sesssion from the server
    const session = await axios({
      method: 'GET',
      url: `/api/v1/bookings/checkout-session/${roomID}`
    });

    // 2) Create checkout form + charge the credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });

  } catch (err) {
    showAlert('error', 'Something went wrong');
  }
};