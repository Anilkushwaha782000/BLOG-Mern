import React, { useState, useEffect } from 'react'
import { Badge, Sidebar } from "flowbite-react";
import { HiArrowSmRight } from "react-icons/hi";
import { FaUser } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom'
import { signOutSuccess } from '../reduxstore/user/userSlice';
import { useSelector,useDispatch } from 'react-redux';
function DashSideBar() {
  const location = useLocation()
  const [tab, setTab] = useState()
  const [signOut,setSignOut]=useState(false)
  const dispatch=useDispatch()
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    // console.log("ghj",tabFromUrl)
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])
  async function handleSignOut(){
    try {
      const  response= await fetch('/api/signout',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        }
      })
      const data=await  response.json();
      if(!response.ok){
        setSignOut(data.message)
      }
      else{
        dispatch(signOutSuccess())
      }
    } catch (error) {
      setSignOut(error.message)
    }
    }
  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to='/dashboard?tab=profile' as={"div"}>
            <Sidebar.Item icon={FaUser} active={tab === 'profile'} as={"div"}>
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item className='cursor-pointer' onClick={handleSignOut} icon={HiArrowSmRight}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSideBar