import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Label, TextInput, Button, Alert, Modal, Table, TableBody } from "flowbite-react";
import { useNavigate, Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from "react-icons/hi";
function DashBoardPost() {
  const [postError, setPostError] = useState(false)
  const [userPost, setUserPost] = useState([])
  const { currentUser } = useSelector(state => state.user)
  const [showMore, setShowMore] = useState(true)
  const [openModal, setOpenModal] = useState(false);
  const [postIdToDelete,setPostIdToDelete]=useState(null)
  const [deletePostError,setDeletePostError]=useState(null)
  const [postdeletemessage,setPostDeleteMessage]=useState(null)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/getpost?userId=${currentUser.rest._id}`)
        const data = await response.json()
        if (!response.ok) {
          setPostError(data.message)
        }
        if (response.ok) {
          setUserPost(data.posts)
          if (data.posts.length < 9) {
            setShowMore(false)
          }
        }
      } catch (error) {
        setPostError(error.message)
      }
    }
    if (currentUser.rest.isAdmin) {
      fetchPost()
    }
  }, [currentUser.rest._id])
  const handleShowMore = async () => {
    const startIndex = userPost.length
    try {
      const response = await fetch(`/api/getpost?userId=${currentUser.rest._id}&startIndex= ${startIndex}`)
      const data = await response.json()
      if (!response.ok) {
        setPostError(data.message)
      }
      if (response.ok) {
        setUserPost(prev => [...prev, ...data.posts])
        if (data.posts.length < 9) {
          setShowMore(false)
        }
      }
    } catch (error) {
      setPostError(error.message)
    }
  }
  const handleDeletePost = async () => {
    setOpenModal(false)
    try {
  const response=await fetch(`/api/deletepost/${postIdToDelete}/${currentUser.rest._id}`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  const data=await response.json()
  if(!response.ok){
    setDeletePostError(data.message)
  }
  else{
    setUserPost(prev => prev.filter(val => val._id !== postIdToDelete));
    setPostIdToDelete(null)
    setPostDeleteMessage('Post has been deleted successfully!')
    setTimeout(()=>{
      setPostIdToDelete(null)
      setPostDeleteMessage(null)
    },3000)
  }

    } catch (error) {
      setDeletePostError(error.message)
    }
  }
  return (
    <div className='table-auto w-full md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-800 dark:scrollbar-thumb-slate-500'>
        {postdeletemessage && (
        <Alert color='success' className='mt-5 mb-5'>{postdeletemessage}</Alert>
      )}
      {currentUser.rest.isAdmin && userPost.length > 0 ? (
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
              userPost.map((post) => (
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
                      <span
                        className='text-red-500 cursor-pointer hover:underline'
                        onClick={() => {
                          setOpenModal(true);
                          setPostIdToDelete(post._id);
                        }}
                      >
                        Delete
                      </span>
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
          {showMore && (
            <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7' style={{ cursor: 'pointer' }}>Show more</button>
          )}
        </div>
      ) : (
        <p>You have no post yet, please add some post!</p>
      )
      }
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => {setOpenModal(false),handleDeletePost()}}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {postError && (
        <Alert color='failure' className='mt-5'>{postError}</Alert>
      )}
    </div>
  )
}

export default DashBoardPost