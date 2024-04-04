import React, { useState } from 'react'
import { Label, TextInput, Button, Alert, Modal, Select, FileInput } from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import {useNavigate}  from 'react-router-dom';
function CreatePost() {
  const [file, setFile] = useState(null)
  const navigate=useNavigate();
  const [imageUploadProgress, setImageUploadProgress] = useState(null)
  const [imageUploadError, setImageUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const [imageUploadSuccess, setImageUploadSuccess] = useState(null)
  const [imageuploadWait, setImageUploadWait] = useState(false)
  const[publisError,setPublishError]=useState(null)
  const handleUploadImage = async () => {
    setImageUploadWait(true)
    try {
      if (!file) {
        setImageUploadError('Please select an image')
        setImageUploadWait(false)
        return
      }
      setImageUploadError(null)
      const storage = getStorage(app);
      const fileName = new Date() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0))
        },
        (error) => {
          setImageUploadError('There was an error while uploading the image: Only images up to 2 MB can be uploaded!')
          setImageUploadProgress(null)
          setImageUploadWait(false)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadurl => {
            setFormData({ ...formData, image: downloadurl })
            setImageUploadWait(false)
            setImageUploadSuccess('Image uploaded succesfully!')
            setImageUploadError(null)
            setImageUploadProgress(null)
            setTimeout(() => {
              setImageUploadSuccess(null);
            }, 3000);
          })
        }
      )
    } catch (error) {
      setImageUploadWait(false)
      setImageUploadError('There was an error while uploading the image!')
      setImageUploadProgress(null)
    }
  }
  const handleSubmit=async (e)=>{
    e.preventDefault()
  try {
    const response=await fetch('/api/createpost',{
      method:'POST',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(formData)
    })
    const data=await response.json()
    if(!response.ok){
      setPublishError(data.message)
      return
    }
    if(response.ok){
      setPublishError(null)
      navigate('/post/'+data.savedPost.slug)
    }
    
  } catch (error) {
    setPublishError('There was an error while publishing  the data! '+error.message)
  }
  }
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl font-semibold my-7'>Create a Post </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className='flex flex-col sm:flex-row justify-between gap-4'>
          <TextInput id="title"
            type="text" placeholder="Enetr title of post"
            required
            className='flex-1'
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Select id="countries" required onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
            <option value='select'>Select a category</option>
            <option value='reactjs'>ReactJs</option>
            <option value='nextjs'>NextJS</option>
            <option value='redux'>Redux</option>
            <option value='nodejs'>Node Js</option>
          </Select>
        </div>
        {
          imageUploadError && (
            <Alert color='failure' className='mt-2 mb-2'>{imageUploadError}</Alert>
          )
        }
          {imageUploadSuccess && (
          <Alert className='mt-5' color='success'>{imageUploadSuccess}</Alert>
        )}
        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput type='file' accept='images/*' onChange={(e) => setFile(e.target.files[0])} />
          <Button type='button' gradientDuoTone='purpleToBlue' outline size='sm' onClick={handleUploadImage} disabled={imageuploadWait}>
            {
              imageuploadWait ? 'Uploading Image..' : 'Upload Image'

            }</Button>
        </div>
        {
          formData.image && (
            <img src={formData.image} alt='Image not found' className=' mt-5 w-full h-72' />
          )
        }
        <ReactQuill theme='snow' placeholder='write something...' className='h-72 mb-12' required onChange={(value) => setFormData({ ...formData, content: value })} />
        {
          publisError && (
            <Alert color='failure' className='mb-5 mt-2'>{publisError}</Alert>
          )
        }
        <Button type='submit' gradientDuoTone='purpleToPink'>Publish</Button>
      </form>
    </div>
  )
}

export default CreatePost