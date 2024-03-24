import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import OAuth from '../components/OAuth'
import { signInFailuer,signInStart,signInSuccess, signUpFailuer } from '../reduxstore/user/userSlice'
import { useDispatch,useSelector } from 'react-redux'
function SignUp() {
  const [username, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const dispatch=useDispatch();
  const [password, setPassword] = useState('')
  const[errorMessage,setErrorMessage]=useState(null)
  const[redirect,setRedirect]=useState(false);
  const[loading,setLoading]=useState(false)
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(username + ",," + email + "<<" + password)
    if(!username || !email|| !password){
      return  setErrorMessage("Please fill out all the fields");
    }
    try {
      setLoading(true);
      setErrorMessage(null)
      const response=await fetch("/api/signup",{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({username,email,password})
      })
      const data=await response.json();
      console.log('data',data);
      if(data.success===false){
        dispatch(signUpFailuer(data))
        return setErrorMessage(data.message)
      }
      setLoading(false)
      setRedirect(response.ok);
    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
    }
  }
  if(redirect){
    return <Navigate to="/signin"/>
  }
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        <div className='flex-1'>
          <Link to={"/"} className='text-4xl font-bold dark:text-white'>
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Anil's</span> Blog
          </Link>
          <p className='text-sm mt-5'>
            This is a demo project. You can sign up with your email and password or with Google.
          </p>
        </div>
        <div className='flex-1'>
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label>Username</Label>
              <TextInput placeholder='enter username' type='text' value={username} onChange={e => setUserName(e.target.value)} id='username' />
            </div>
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
                ) : 'Sign Up'
              }     
              </Button>
              <OAuth/>
          </form>
          <div className='flex gap-2 text-sm mt-4'>
            <span>Already have an account?</span>
            <Link to='/signin' className='text-blue-500'>Sign In</Link>
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color='failure' withBorderAccent>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default SignUp