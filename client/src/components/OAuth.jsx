import { Button } from 'flowbite-react'
import React from 'react'
import { AiFillGoogleCircle } from 'react-icons/ai';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch,useSelector } from 'react-redux'
import { signInFailuer,signInStart,signInSuccess } from '../reduxstore/user/userSlice'
import { useNavigate } from 'react-router-dom';
function OAuth() {
  const auth = getAuth(app);
  const dispatch=useDispatch();
  const navigate=useNavigate()
  const handleGoogleClick=async()=>{
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const resultFromGoogle=await  signInWithPopup(auth,provider)
      // console.log("result",resultFromGoogle.user)
      const response= await fetch("/api/google",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          name:resultFromGoogle.user?.displayName || "",
          email:resultFromGoogle.user?.email||"" ,
          image:resultFromGoogle.user?.photoURL||""
        })
      })
      const data=await  response.json();
      console.log("dtata",data);
      if(response.ok){
        dispatch(signInSuccess(data))
        navigate('/')
      }
    } catch (error) {
      console.log("error",error)
    }
  }
  return (
    <Button type='button' gradientDuoTone='pinkToOrange' outline onClick={handleGoogleClick}>
      <AiFillGoogleCircle className='w-6 h-6 mr-2'/>
      <span>Continue with Google</span>
    </Button>
  )
}

export default OAuth