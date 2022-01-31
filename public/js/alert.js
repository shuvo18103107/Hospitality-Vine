//type is 'success' or 'error' depending on this css style will change 
//base template e sob kicu inject hoi tai css o ek jaigai ace 
export const hideAlert = () =>{
  const el = document.querySelector('.alert');
  if(el) el.parentElement.removeChild(el);
}


export const showAlert = (type,msg)=>{
  //whenever we show the alert first hide the alert that exist on the body 
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`
  //now we insert this markup on the body ,afterbegin means body er vitor first e
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup)
  //ekhn 5 sec por alert ta hide korbo 
  window.setTimeout(hideAlert,4000);
}

