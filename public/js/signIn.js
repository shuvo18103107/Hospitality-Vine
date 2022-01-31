import axios from 'axios';
import { showAlert } from './alert';
//the export here work diff from node common js module export style 
export const signin =async (name,email,password,passwordConfirm)=>{
  //2 ta way te node e data pathano jai 1. using axios or using html form to directly send form data to server
  try{
    const res = await axios({
      method: 'POST',
      url:'http://127.0.0.1:8000/api/v1/users/signup',
      data:{
        // email:email
        name,
        email,
        password,
        passwordConfirm
      }
    })
    //now check we get the data back successfully or not 
    if(res.data.status === 'success'){
      // alert('Logged in successfully')
      showAlert('success','Logged in successfully' )
      window.setTimeout(()=>{
        //load another page(home page) we use location.assign
        location.assign('/');
      },1500)
    }
  }catch(err)
  {
    // alert(err.response.data.message)
    showAlert('error',err.response.data.message )

  }

}


//axios automatic through a error when we find an error from our api endpoint