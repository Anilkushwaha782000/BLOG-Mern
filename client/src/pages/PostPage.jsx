import React, { useEffect, useState } from 'react'
import {Link, useParams} from  "react-router-dom";
import { Button, Spinner } from "flowbite-react";
import CallToAction from './CallToAction';
function PostPage() {
    const{postslug}=useParams()
    const[postError,setPostError]=useState(null)
    const[loading,setLoading]=useState(true)
    const[post,setPost]=useState(null)
    useEffect(()=>{
     const fetchPost=async ()=>{
      try {
        setLoading(true)
        const response=await fetch(`/api/getpost?slug= ${postslug}`);
        const data=await response.json()
        if(!response.ok){
            setPostError(data.message)
            setLoading(false)
            return;
        }
        if(response.ok){
            setPost(data.posts[0])
            setLoading(false)
            setPostError(null)
        }
      } catch (error) {
        setPostError(error.message)
        setLoading(false)
      }
     }
     fetchPost()
    },[postslug])
if(loading){
    return (
        <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl'/>
        </div>
    )
} 
  return (
    <main className='flex flex-col p-3 max-w-6xl mx-auto min-h-screen'>
        <h1 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>
        <Link className='self-center mt-5' to={`/search?category=${post && post.category}`}>
        <Button color='gray' pill size='xs'>{post && post.category}</Button>
        </Link>
        <img src={post && post.image} alt={post && post.title} className='mt-10 p-3 max-h-[600px] w-full object-cover'/>
        <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
            <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
            <span>{post && (post.content.length/1000).toFixed(0)} mins read</span>
        </div>
        <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{__html:post && post.content}}>

        </div>
        <div className='max-w-4xl mx-auto w-full'>
            <CallToAction/>
        </div>
    </main>
  )
}

export default PostPage