import React, { useEffect, useState } from 'react'
import { useSelector,useDispatch } from 'react-redux';
import { Link,useNavigate } from 'react-router-dom';
import { Alert, Button, Checkbox, Label, TextInput, Textarea } from "flowbite-react";
import Comments from './Comments';
function CommentSection({postId}) {
    const { currentUser } = useSelector(state => state.user)
    const [commentError,setCommentError]=useState(null)
    const[commentSuccess,setCommentSuccess]=useState(null)
    const[comment,setComment]=useState('')
    console.log("postId postId postId of likes",postId)
    const[fetchComment,setFetchComment]=useState([])
    const navigate=useNavigate()
    const [likeError,setLikeError]=useState(null)
    const handleSubmitComment=async (e)=>{
     e.preventDefault()
     if(comment.length>200){
        return
     }
    try {
        const response=await fetch('/api/createcomment',{
            method:'POST',
            headers:{
            'Content-Type':'application/json'
            },
            body:JSON.stringify({content:comment,postId,userId:currentUser.rest._id})
         })
         const data=await response.json();
         if(!response.ok){
            setCommentError(data.message)
         }
         else{
            setCommentError(null)
            setComment('')
            setCommentSuccess('Thanks for your comment! Let me know if you have any more questions or thoughts!')
            setTimeout(()=>{
              setCommentSuccess(null)
            },3000)
            setFetchComment([data.commentDoc,...fetchComment]);
         }
    } catch (error) {
        setCommentError(error.message)
    }
    }
useEffect(()=>{
  const fetchPostComments=async()=>{
   try {
    const response=await fetch('/api/getpostcomments/'+postId);
    const  data= await response.json()
    if(!response.ok){
      setCommentError(data.messssage)
    }
    else{
      setCommentError(null)
      setFetchComment(data.comments)
    }
    
   } catch (error) {
    setCommentError(error.message)
   }
  }
  fetchPostComments()
},[postId])

const handleLike=async (commentId)=>{
try {
  if(!currentUser.rest.username){
    navigate('/signin');
    return 
  }
  const response=await fetch('/api/likecomment/'+commentId,{
    method:'PUT',
    headers:{
      'Content-Type':'application/json'
    },
    body:JSON.stringify({content:comment,postId,userId:currentUser.rest._id})
  })
  const data=await response.json();
  console.log("comment  response data",data)
  if(!response.ok){
    setLikeError(data.message)
  }
  if(response.ok){
    setComment(comment.map((comment) => {
      return comment._id === commentId
        ? {
            ...comment,
            likes: data.likes,
            noOfLikes: data.likes.length,
          }
        : comment;
    }));
  }
  
} catch (error) {
  setLikeError(error.message)
}
}
  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
        {currentUser?.rest?.username?
        (
        <div className='flex items-center gap-1 my-5 text-gray-500 text-xs'>
            <p>
                Signed as:
            </p>
            <img className='h-5 w-5 rounded-full object-cover' src={currentUser?.rest?.profilePicture}/>
            <Link className='text-cyan-500 hover:underline' to={`/dashboard?tab=profile`}>
            @{currentUser?.rest?.email}
            </Link>
        </div>):(
           <div className='text-sm text-teal-500 my-5 flex gap-2'>
            You must be signed to comment!
            <Link className='text-blue-500 hover:underline' to={'/signin'}>Sign in</Link>
           </div>
        )}
        {
          currentUser?.rest?.username &&(
            <form onSubmit={handleSubmitComment} className='border border-teal-500 rounded-md p-3'>
                <Textarea placeholder='Add a comment here..' rows='3' maxLength='200' onChange={(e)=>setComment(e.target.value)} value={comment}/>
                <div className='flex justify-between items-center mt-5'>
                    <p className='text-gray-500 text-xs'>{200-comment.length }character left</p>
                    <Button gradientDuoTone='purpleToPink' outline onClick={handleSubmitComment}>Submit</Button>
                </div>
                {commentError && (
                  <Alert color='failure' className='mt-5'>{commentError}</Alert>
                )}
                  {commentSuccess && (
                  <Alert color='success' className='mt-5'>{commentSuccess}</Alert>
                )}
            </form>
          )  
        }
        {fetchComment.length===0?(
          <p className='text-xm my-5'>No comments yet!</p>
        ):(
           <>
           <div className='text-sm flex items-center my-5 gap-2'>
             <p>Comments</p>
             <div className='border border-gray-500 py-1 px-2 rounded-md'>
             <p>{fetchComment.length}</p>
             </div>
           </div>
           {fetchComment.map((comment)=>(
            <Comments key={comment._id} comment={comment} onLike={handleLike}/>
           ))}
           </>
        )}
    </div>
  )
}

export default CommentSection