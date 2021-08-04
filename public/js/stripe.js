import axios from 'axios';
import { showAlert } from './alert';
const stripe = Stripe(
  'pk_test_51JJDXRGXhbwVVFOkQYoUJkr9nm18Cx61S250j3yh6nWXCAiVRxOYtlkOFM72lXM0AFPLJOIttxtypoEthicAHkzO00YOICHa0C'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get the checkout from the server(API)
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2) Create checkout fom + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('err', err.response.data.message);
  }
};
