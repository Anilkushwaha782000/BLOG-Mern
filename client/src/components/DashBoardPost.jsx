import React, { useEffect, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { Label, TextInput, Button, Alert, Modal,Table, TableBody} from "flowbite-react";
import { useNavigate,Link } from 'react-router-dom';
function DashBoardPost() {
  const[postError, setPostError] = useState(false)
  const[userPost,setUserPost]=useState([])
  const { currentUser } = useSelector(state => state.user)
  useEffect(()=>{
    const fetchPost=async()=>{
    try {
      const response=await fetch(`/api/getpost?userId=${currentUser.rest._id}`)
      const data=await response.json()
      if(!response.ok){
       setPostError(data.message)
      }
      if(response.ok){
        setUserPost(data.posts)
      }
    } catch (error) {
      setPostError(error.message)
    }
    }
    if(currentUser.rest.isAdmin){
      fetchPost()
    }
  },[currentUser.rest._id])
  return (
    <div className='table-auto  md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-800 dark:scrollbar-thumb-slate-500'>
      { currentUser.rest.isAdmin && userPost.length>0?(
        <div className='overflow-x-auto'>
         <Table hoverable className='shadow-md'>
         <Table.Head>
          <Table.HeadCell>Date Updated</Table.HeadCell>
          <Table.HeadCell>Post Image</Table.HeadCell>
          <Table.HeadCell>Post Title</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
          <Table.HeadCell>
            <span className="">Edit</span>
          </Table.HeadCell>
        </Table.Head>
        {
          userPost.map((post)=>(
           <Table.Body className="divide-y" key={post._id}>
            <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800' key={post._id}>
              <Table.Cell>
                {new Date(post.createdAt).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>
               <Link to={`/post/${post.slug}`}>
                <img src={post.image} alt={post.title} className='w-20 h-10 object-cover bg-gray-500' />
               </Link>
              </Table.Cell>
              <Table.Cell>
               <Link className='font-medium text-gray-900 dark:text-white ' to={`/post/${post.slug}`}>
                {post.title}
               </Link>
              </Table.Cell>
              <Table.Cell>
                {post.category}
              </Table.Cell>
              <Table.Cell>
                <span className='text-red-500 cursor-pointer hover:underline'>Delete</span>
              </Table.Cell>
              <Table.Cell>
                <Link className='text-teal-500 cursor-pointer' to={`/updatepost/${post._id}`}>
                <span>Edit</span>
                </Link>
              </Table.Cell>
            </Table.Row>
           </Table.Body>
          ))
        }
         </Table>
        </div>
      ):(
        <p>You have no post yet, please add some post!</p>
      )
      }
    {postError && (
      <Alert color='failure' className='mt-5'>{postError}</Alert>
    )}
    </div>
  )
}

export default DashBoardPost