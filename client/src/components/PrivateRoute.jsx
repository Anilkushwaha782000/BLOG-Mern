import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { Outlet,Navigate } from 'react-router-dom'
function PrivateRoute() {
    const {currentUser}=useSelector(state=>state.user)
  return currentUser?<Outlet/>:<Navigate to='/sigin'/>;
}

export default PrivateRoute