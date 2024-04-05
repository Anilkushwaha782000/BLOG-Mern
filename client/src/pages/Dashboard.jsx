import React, { useState,useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import DashSideBar from '../components/DashSideBar'
import DashProfile from '../components/DashProfile'
import DashBoardPost from '../components/DashBoardPost'
function Dashboard() {
  const location=useLocation()
  const [tab,setTab]=useState()
  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search)
    const tabFromUrl=urlParams.get('tab')
    // console.log("ghj",tabFromUrl)
    if(tabFromUrl){
      setTab(tabFromUrl)
    }
  },[location.search])
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        <DashSideBar/>
      </div>
        {tab==='profile'?<DashProfile />:null}
        {tab==='posts' ? <DashBoardPost/>:null}
    </div>
  )
}

export default Dashboard