//this index.js file is our entry file we get the data from user interface and based on this we perform action basically others module function like login mapbox etc , so ekhane ui er interaction gula handle korbo like form submit dile action gula module gulai pathabo cg this file is more to get data from user interface and delegate the action 
//jodi es6 style e default export likhe export kortam taile {} lagto na ekhn eta named import hisave ace ch we use export
 import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { signin } from './signIn';
import { updateSettings } from './updateSettings';
// console.log('Hello From parcel');
//Dom Elements
const mapbox = document.getElementById('map');
const LoginForm = document.querySelector('.form');
const SignupForm = document.querySelector('.signup');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPassForm = document.querySelector('.form-user-password');


// Display map 
//jesob page e map id nei se sob page e dataset null dekhabe so we have to fix it 
if(mapbox)
{
  const locations =JSON.parse(mapbox.dataset.locations);
  displayMap(locations);
}
//Login functionality
if(LoginForm)
{

  LoginForm.addEventListener('submit', e=>{
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
    e.preventDefault();
    login(email,password)
  })
}
//signup 
if(SignupForm)
{
SignupForm.addEventListener('submit', e=>{
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('password-confirm').value;
  e.preventDefault();
    signin(name,email,password,passwordConfirm)
  })
}

if(logOutBtn) logOutBtn.addEventListener('click', logout)

if(userDataForm)
{
  userDataForm.addEventListener('submit',async e =>{
    e.preventDefault();
    document.querySelector('.btn--save-data').textContent='Updating...⌛'
    //form element create korbo for uploading photos,name,email
    const form = new FormData();
    //for uploading photo we do like form way other wise simple we can pass the obj of selected field value
    form.append('name',document.getElementById('name').value);
    form.append('email',document.getElementById('email').value);
    form.append('photo',document.getElementById('photo').files[0]);
    console.log(form);
    
    // const email = document.getElementById('email').val )
    // const name = document.getElementById('name').value;
    // const email = document.getElementById('email').value;
  //  await updateSettings({name,email}, 'data')
  //form obj akare pathacii
   await updateSettings(form, 'data')
    document.querySelector('.btn--save-data').textContent='Save settings'

  })
}
if(userPassForm)
{
  userPassForm.addEventListener('submit', async e =>{
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent='Updating...⌛';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    //we want to clear the field after updating the password
  await updateSettings({passwordCurrent,password,passwordConfirm}, 'password');
  document.querySelector('.btn--save-password').textContent='Save password';
  document.getElementById('password-current').value = '';
  document.getElementById('password').value= '';
  document.getElementById('password-confirm').value='';
  })
}

