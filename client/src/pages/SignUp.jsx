import { Button, Label, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
function SignUp() {
  const [username,setUserName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
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
          <form className='flex flex-col gap-4'>
            <div>
              <Label>Username</Label>
              <TextInput placeholder='enter username' type='text' value={username} onChange={e=>setUserName(e.target.value)} id='username'/>
            </div>
            <div>
            <Label value='Email'/>
              <TextInput placeholder='your@gmail.com' type='text' value={email} onChange={e=>setEmail(e.target.value)} id='email'/>
            </div>
            <div>
            <Label>Password</Label>
              <TextInput placeholder='enter password' value={password} type='password' onChange={e=>setPassword(e.target.value)} id='password'/>
            </div>
            <Button gradientDuoTone="purpleToPink" type='submit'>Sign up</Button>
          </form>
          <div className='flex gap-2 text-sm mt-4'>
            <span>Already have an account?</span>
            <Link to='/signin' className='text-blue-500'>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp