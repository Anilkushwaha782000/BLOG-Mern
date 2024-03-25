import React, { useState }  from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Label, TextInput,Button } from "flowbite-react";
function DashProfile() {
  const { currentUser } = useSelector(state => state.user)
  console.log("hj",currentUser)
  const [username, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>
        Profile
      </h1>
      <form className='flex flex-col gap-4'>
        <div className='w-32 h-32 self-center cursor-pointer rounded-full shadow-md overflow-hidden'>
          <img src={currentUser.rest.profilePicture} alt='image not found' className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' />
        </div>
        <TextInput placeholder='' type='text' defaultValue={currentUser.rest.username} onChange={e => setUserName(e.target.value)} id='username' />
        <TextInput placeholder='' type='email' defaultValue={currentUser.rest.email}onChange={e => setEmail(e.target.value)} id='email' />
        <TextInput placeholder='password' type='password' onChange={e => setPassword(e.target.value)} id='password' />
        <Button outline gradientDuoTone="purpleToBlue">
        Update
      </Button>
      </form>
      <div className='text-red-500 justify-between flex mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}

export default DashProfile