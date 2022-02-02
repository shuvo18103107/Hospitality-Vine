import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
  'pk_test_51KLTd7H8sgj2uK7STubrqwSOcH54qsOBph8n5cxupUthiRcHT0H9IQ7urpap42EXc2TWEK0LK9ji657Q73uTh8RS0083ZJffND'
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