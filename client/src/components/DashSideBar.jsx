import React, { useState, useEffect } from 'react'
import { Badge, Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiViewBoards,HiUser } from "react-icons/hi";
import { FaUser } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom'
import { signOutSuccess } from '../reduxstore/user/userSlice';
import { useSelector, useDispatch } from 'react-redux';
function DashSideBar() {
  const location = useLocation()
  const [tab, setTab] = useState()
  const { currentUser, error, loading } = useSelector(state => state.user);
  const [signOut, setSignOut] = useState(false)
  const dispatch = useDispatch()
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    // console.log("ghj",tabFromUrl)
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])
  async function handleSignOut() {
    try {
      const response = await fetch('/api/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json();
      if (!response.ok) {
        setSignOut(data.message)
      }
      else {
        dispatch(signOutSuccess())
      }
    } catch (error) {
      setSignOut(error.message)
    }
  }
  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          <Link to='/dashboard?tab=profile' as={"div"}>
            <Sidebar.Item icon={FaUser} active={tab === 'profile'} as={"div"} label={currentUser?.rest?.isAdmin ? 'Admin' : 'User'}>
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser?.rest?.isAdmin && (
            <Link to='/dashboard?tab=posts' as={"div"} className='cursor-pointer' >
              <Sidebar.Item icon={HiViewBoards} active={tab === 'posts'} type='button' className='w-full' as={"div"}>
                Posts
              </Sidebar.Item>
            </Link>
          )}
          {currentUser?.rest?.isAdmin && (
            <Link to='/dashboard?tab=users' as={"div"} className='cursor-pointer' >
              <Sidebar.Item icon={HiUser} active={tab === 'users'} type='button' className='w-full' as={"div"}>
                Users
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item className='cursor-pointer' onClick={handleSignOut} icon={HiArrowSmRight}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSideBar