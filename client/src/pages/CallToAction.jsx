import React from 'react'
import { Button, Spinner } from "flowbite-react";
function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className='flex-1 justify-center items-center flex flex-col'>
            <h2 className='text-2xl'>Want to learn more</h2>
            <p className='text-gray-500 my-2'>Let's connect on linkedin</p>
            <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none mb-5 '>
                <a href='https://www.linkedin.com/in/anil-kushwaha-843689215' target='_blank' rel='noopener noreffer'>Let's connect</a>
            </Button>
        </div>
        <div className='p-7 flex-1'>
            <img src='https://sbr-technologies.com/wp-content/uploads/2021/07/Mern-Stack-Developer.png'/>
        </div>

    </div>
  )
}

export default CallToAction