import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { signInFailuer,signInStart,signInSuccess } from '../reduxstore/user/userSlice'
import { useDispatch,useSelector } from 'react-redux'
import OAuth from '../components/OAuth'
function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const[redirect,setRedirect]=useState(false);
  const {loading,error:errorMessage}=useSelector(state=>state.user)
  const dispatch=useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!email|| !password){
      return  dispatch(signInFailuer("Please fill out all the fields"))
    }
    try {
      dispatch(signInStart())
      const response=await fetch("/api/signin",{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({email,password})
      })
      const data=await response.json();
      // console.log('data',data);
      if(data.success===false){
        dispatch(signInFailuer(data.message));
      }
      if(response.ok){
        dispatch(signInSuccess(data));
      }
      setRedirect(response.ok);
    } catch (error) {
      dispatch(signInFailuer(error.message))
    }
  }
  if(redirect){
    return <Navigate to="/"/>
  }
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        <div className='flex-1'>
          <Link to={"/"} className='text-4xl font-bold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Anil's</span> Blog
          </Link>
          <p className='text-sm mt-5'>
            This is a demo project. You can sign in with your email and password or with Google.
          </p>
        </div>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Email' />
              <TextInput placeholder='your@gmail.com' type='email' value={email} onChange={e => setEmail(e.target.value)} id='email' />
            </div>
            <div>
              <Label>Password</Label>
              <TextInput placeholder='enter password' value={password} type='password' onChange={e => setPassword(e.target.value)} id='password' />
            </div>
            <Button gradientDuoTone="purpleToPink" type='submit' disabled={loading}>
              {
                loading ?(
                  <>
                  <Spinner size='sm'/>
                  <span className='pl-3'>loading..</span></>
                ) : 'Sign In'
              }     
              </Button>
              <OAuth/>
          </form>
          <div className='flex gap-2 text-sm mt-4'>
            <span>Don't have an account?</span>
            <Link to='/signup' className='text-blue-500'>Sign Up</Link>
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default SignIn