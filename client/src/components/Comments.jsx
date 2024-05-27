import React, { useEffect, useState } from 'react'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux';
import { FaThumbsUp } from 'react-icons/fa';
function Comments({ comment, onLike }) {
    console.log("comment component",comment)
    const [error, setError] = useState(null)
    const [user, setUser] = useState({})
    const { currentUser } = useSelector(state => state.user)
    console.log("currentUser?.rest?._id", currentUser?.rest?._id)
    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await fetch('/api/' + comment.userId)
                const data = await response.json();
                if (!response.ok) {
                    setError(data.message)
                }
                else {
                    setUser(data);
                }
            } catch (error) {
                setError(error.message)
            }
        }
        getUser();
    }, [comment])
    return (
        <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
            <div className='flex-shrink-0 mr-3'>
                <img className='w-10 h-10 rounded-full bg-gray-200' src={user && user?.rest?.profilePicture} alt={user && user?.rest?.username} />
            </div>
            <div className='flex-1'>
                <div className='flex items-center mb-2'>
                    <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user?.rest?.username}` : 'anonymous user '}</span>
                    <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
                </div>
                <p className='text-gray-500 mb-2'>{comment.content}</p>
                <div className='d-flex'>
                    <button type='button' onClick={() => onLike(comment._id)} style={{
                        color: comment.likes.includes(currentUser._id) ? 'blue' : 'gray',
                    }}>
                        <FaThumbsUp className='text-sm' />
                    </button>
                    <span className='ml-2'>{comment.likes.length} likes</span>
                </div>
            </div>
        </div>
    )
}

export default Comments