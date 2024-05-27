import React, { useEffect, useState } from 'react'
import { useLocation,Link } from 'react-router-dom'
import { Button, Spinner } from "flowbite-react";
import CallToAction from './CallToAction';
const stripHtmlTags = (html) => {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};
function Home() {
  const location=useLocation()
  const urlParams=new URLSearchParams(location.search)
  const [posts,setAllpost]=useState([])
  const[loading,setLoading]=useState(true)
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/getpost`)
        const data = await response.json()
        if (!response.ok) {
          setLoading(false)
          setAllpost(data.message)
        }
        if (response.ok) {
          setLoading(false)
          setAllpost(data.posts)
        }
      } catch (error) {
        setLoading(false)
        setAllpost(error.message)
      }
    }
    
      fetchPost();
  }, [location.search])

  if(loading){
    return (
        <div className='flex justify-center items-center min-h-screen'>
        <Spinner size='xl'/>
        </div>
    )
} 
  return (
 <>
    <section className="container mx-auto p-8">
      <h2 className="text-2xl font-bold mb-4">Recent Posts</h2>
      <div className="grid grid-cols-2 gap-4">
        {posts.map((post, index) => (
          <div key={index} className="border border-teal-500 rounded-tl-3xl rounded-br-3xl p-4 bg-white shadow-md">
            <h3 className="text-xl font-semibold mb-2">{post?.title}</h3>
            <p className="text-gray-700 mb-4">{stripHtmlTags(post?.content)}</p>
            <Link  to={`/post/${post.slug}`} className="text-blue-500 hover:underline">
            Read more</Link>
          </div>
        ))}
      </div>
    </section>
    <div className='container1 mx-auto p-4 w-2xl'>
            <CallToAction/>
      </div>
 </>
)}

export default Home