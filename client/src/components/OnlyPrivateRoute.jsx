import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import { Outlet,Navigate } from 'react-router-dom'
function OnlyPrivateRoute() {
    const {currentUser}=useSelector(state=>state.user)
    return currentUser?.rest?.isAdmin?<Outlet/>:<Navigate to='/signin'/>;
}

export default OnlyPrivateRoute