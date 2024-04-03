import React from 'react'
import { Label, TextInput, Button, Alert, Modal,Select, FileInput } from "flowbite-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
function CreatePost() {
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl font-semibold my-7'>Create a Post </h1>
      <form className="flex flex-col gap-4">
      <div className='flex flex-col sm:flex-row justify-between gap-4'>
      <TextInput id="title" type="text" placeholder="Enetr title of post" required className='flex-1' />
      <Select id="countries" required>
        <option value='select'>Select a category</option>
        <option value='reactjs'>ReactJs</option>
        <option value='nextjs'>NextJS</option>
        <option value='redux'>Redux</option>
        <option value='nodejs'>Node Js</option>
      </Select>
      </div>
      <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
      <FileInput type='file' accept='images/*' />
      <Button type='button' gradientDuoTone='purpleToBlue' outline  size='sm'>Upload Image</Button>
      </div>
      <ReactQuill theme='snow' placeholder='write something...' className='h-72 mb-12' required/>
      <Button type='submit' gradientDuoTone='purpleToPink'>Publish</Button>
    </form>
    </div>
  )
}

export default CreatePost