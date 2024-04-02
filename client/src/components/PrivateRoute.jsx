import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { Outlet,Navigate } from 'react-router-dom'
function PrivateRoute() {
    const {currentUser}=useSelector(state=>state.user)
  return currentUser?.rest?.username?<Outlet/>:<Navigate to='/signin'/>;
}
export default PrivateRoute