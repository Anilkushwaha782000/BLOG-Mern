import React, { useState } from 'react'
import { Link, useLocation,useNavigate } from 'react-router-dom'
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon,FaSun } from 'react-icons/fa';
import { useSelector,useDispatch } from 'react-redux';
import { HiCog, HiCurrencyDollar, HiLogout, HiViewGrid } from "react-icons/hi";
import { FaUser } from 'react-icons/fa';
import { signOutSuccess } from '../reduxstore/user/userSlice';
import { toggleTheme } from '../reduxstore/theme/themeSlice';
function Header() {
    const path = useLocation().pathname;
    const { currentUser } = useSelector(state => state.user)
    const {theme}=useSelector(state=>state.theme);
    const[signOut,setSignOut]=useState(false)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const handleTheme=()=>{
        dispatch(toggleTheme())
    }
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
            navigate('/signin')
          }
        } catch (error) {
          setSignOut(error.message)
        }
        }
    return (
        <Navbar className='border-b-2'>
            <Link to={"/"} className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Anil's</span> Blog
            </Link>
            <form>
                <TextInput type='text' placeholder='serach...' rightIcon={AiOutlineSearch} className='hidden lg:inline' />
            </form>
            <Button className="w-12 h-10 lg:hidden" color="gray" pill>
                <AiOutlineSearch />
            </Button>
            <div className='flex gap-2 md:order-2'>
                <Button className='w-12 h-10 hidden sm:inline' color='gray' pill onClick={handleTheme}>
                  {
                    theme==="light"?<FaMoon/>:(<FaSun/>)
                  }
                </Button>
                {currentUser?.rest?.username ? (
                    <Dropdown arrowIcon={false} inline
                    label={currentUser ? <Avatar alt='user'  img={currentUser?.rest?.profilePicture || 'sign in'}  rounded /> : null}
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">{currentUser?.rest?.username}</span>
                            <span className="block truncate text-sm font-medium ">{currentUser?.rest?.email}</span>
                        </Dropdown.Header>
                        <Link to="/dashboard?tab=profile">
                        <Dropdown.Item icon={FaUser}>Profile</Dropdown.Item>
                        </Link>
                        <Dropdown.Item icon={HiViewGrid}>Settings</Dropdown.Item>
                        <Dropdown.Item icon={HiCurrencyDollar}>Earnings</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item  className='cursor-pointer' onClick={handleSignOut} icon={HiLogout}>Sign out</Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to="/signin">
                        <Button className='' gradientDuoTone="purpleToBlue" outline>Sign In</Button>
                    </Link>
                )}


                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === '/'} as={"div"}>
                    <Link to="/">Home</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/about'} as={"div"}>
                    <Link to="/about">About</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/projects'} as={"div"}>
                    <Link to="/projects">Projects</Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default Header