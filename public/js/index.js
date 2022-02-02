
import '@babel/polyfill';
import { showAlert } from './alert';
import { auth, logout } from './auth.js';
import { createReview, deleteReview, editReview } from './createReview';
import { forgotPassword, resetPassword } from './forgotPassword';
// import { bookRoom } from './stripe';
import { updateSettings } from './updateSettings';
//Dom Elements
const LoginForm = document.querySelector('.form');
const signupForm = document.querySelector('.form--signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPassForm = document.querySelector('.form-user-password');
const forgotSubmit = document.querySelector('.forgotSubmit');
const ResetBtn = document.querySelector('.resetPassword');
const bookBtn = document.querySelector('#book-room');
const reviewBtn = document.getElementById('submitReview');
const deleteReviewBtn = document.querySelectorAll('.delete-icon');
const editReviewBtn = document.querySelectorAll('.edit-icon');
const saveReviewBtn = document.querySelectorAll('.save-icon');

//Login functionality
if (LoginForm) {
  LoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    auth('login', {
      email: email,
      password: password
    })
  });
}
//signup
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#password-confirm').value;
    auth('signup', {
      name: name,
      email: email,
      password: password,
      passwordConfirm: passwordConfirm
    });
  });
}

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (userDataForm) {
  userDataForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-data').textContent = 'Updating...⌛';
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    await updateSettings(form, 'data');
    document.querySelector('.btn--save-data').textContent = 'Save settings';
  });
}
if (userPassForm) {
  userPassForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...⌛';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (forgotSubmit) {
  forgotSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    console.log(email)
    forgotPassword(email);
  });
}

if (ResetBtn) {
  ResetBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const token = document.querySelector('.tokenH').dataset.token;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    resetPassword(token, password, passwordConfirm);
  });
}
if (bookBtn) {
  bookBtn.addEventListener('click', async e => {
    bookBtn.textContent = 'processing...⌛';
    const roomID = e.target.dataset.roomId;
    await bookRoom(roomID);
    bookBtn.textContent = 'Book Now';
  });
}

if (reviewBtn) {
  reviewBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const { room } = e.target.dataset;
    const user = document.getElementById('reviewTextarea').dataset.user;
    const rating = document.getElementById('number').value;
    const review = document.getElementById('reviewTextarea').value;
    await createReview(review, rating, user, room);
  });
}
if (deleteReviewBtn) {
  deleteReviewBtn.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const { reviewId } = e.target.dataset;
      e.target
        .closest('.reviews-card')
        .querySelector('.deleting')
        .classList.add('active');
      await deleteReview(reviewId);
      e.target.closest('.reviews-card').remove();
    });
  });
}
if (saveReviewBtn) {
  saveReviewBtn.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const { reviewtoken } = e.target.dataset;
      const review = e.target
        .closest('.reviews-card')
        .querySelector('.review-card__review').textContent;
      const rating = e.target
        .closest('.reviews-card')
        .querySelector('.review-number').textContent;
      const data = {
        rating,
        review,
      };
      await editReview(reviewtoken, data);
    });
  });
}
if (editReviewBtn) {
  editReviewBtn.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.target
        .closest('.reviews-card')
        .querySelector('.review-card__review')
        .setAttribute('contenteditable', 'true');
      e.target
        .closest('.reviews-card')
        .querySelector('.review-number')
        .setAttribute('contenteditable', 'true');
      // highlight
      e.target
        .closest('.reviews-card')
        .querySelector('.review-card__review').style.outline = 'solid #777 2px';
      e.target
        .closest('.reviews-card')
        .querySelector('.review-number').style.outline = 'solid #777 2px';
      // show save icon button
      e.target
        .closest('.reviews-card')
        .querySelector('.save-icon').style.display = 'block';
    });
  });
}

const alertMessage= document.querySelector('body').dataset.alert;
if(alertMessage) showAlert('success', alertMessage, 7)