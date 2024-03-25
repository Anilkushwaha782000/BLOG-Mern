import React, { useState, useEffect } from 'react'
import { Badge, Sidebar } from "flowbite-react";
import { HiArrowSmRight } from "react-icons/hi";
import { FaUser } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom'
function DashSideBar() {
  const location = useLocation()
  const [tab, setTab] = useState()
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    // console.log("ghj",tabFromUrl)
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])
  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to='/dashboard?tab=profile' as={"div"}>
            <Sidebar.Item icon={FaUser} active={tab === 'profile'} as={"div"}>
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item icon={HiArrowSmRight}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  )
}

export default DashSideBar