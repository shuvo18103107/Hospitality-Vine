import axios from 'axios';
import { showAlert } from './alert';
//the export here work diff from node common js module export style 
export const login =async (email,password)=>{
  //2 ta way te node e data pathano jai 1. using axios or using html form to directly send form data to server
  try{
    const res = await axios({
      method: 'POST',
      url:'http://127.0.0.1:8000/api/v1/users/login',
      data:{
        // email:email
        email,
        password 
      }
    })
    //now check we get the data back successfully or not 
    if(res.data.status === 'success'){
      //ekhane future e admin hoile conditionally admin panel hoile niya giya admin er kaj korabo  r user hoile as usual home page e redirect korai dibo 
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
export const logout =async ()=>{
try{
  const res = await axios({
    method: 'GET',
    url:'http://127.0.0.1:8000/api/v1/users/logout',
  });
  //ekhn server theke amra token chara jwt pabo tai user na thakai isloggedinroute / route e jaowar age dekhbe user nai tai logout hoye jabe signin r login dekhabe
  if(res.data.status === 'success'){
    // alert('Logged in successfully')
    showAlert('success','Logged out successfully' )
    location.reload(true) //it will force reload from the server not from the browser cache cg we want a fresh page coming down from the server
    location.assign('/');
  }

}catch(err)

{
  // console.log(err.response)
  //in case internet connection off then this err will apperar 
  showAlert('error', 'Error Logging Out! Try again')
}
}

//axios automatic through a error when we find an error from our api endpoint