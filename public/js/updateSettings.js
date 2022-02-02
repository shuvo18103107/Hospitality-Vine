import axios from 'axios';
import { showAlert } from './alert';
//the export here work diff from node common js module export style 
//cg same req ei hit korbo server e so type either password or data pass hole name email update korbe password hole oi user er password field update korbe r data er vitor obj akare data ta pathai dibe 
export const updateSettings =async (data,type)=>{
  //2 ta way te node e data pathano jai 1. using axios or using html form to directly send form data to server
  try{
    const url = type==='password'?'/api/v1/users/updateMyPassword': '/api/v1/users/updateMe'
    const res = await axios({
      method: 'PATCH',
      url,
      data
      
    })
    //now check we get the data back successfully or not 
    if(res.data.status === 'success'){
      //ekhane future e admin hoile conditionally admin panel hoile niya giya admin er kaj korabo  r user hoile as usual home page e redirect korai dibo 
      // alert('Logged in successfully')
      showAlert('success',`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully` )
      location.reload();
     
    } 
  }catch(err)
  {
    // console.log(err)
    // alert(err.response.data.message)
    showAlert('error',err.response.data.message )

  }

} 

//axios automatic through a error when we find an error from our api endpoint