import React from 'react'

function About() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md border border-teal-500 rounded-tl-3xl rounded-br-3xl mt-10 mb-10">
      <h1 className="text-4xl font-bold mb-4 text-center">About Me</h1>
      <p className="text-lg text-gray-700 text-center"> Welcome to my blog! Here, I share my journey and insights as a full-stack developer.</p>
      <div className="mt-10 flex flex-col md:flex-row items-center">
        {/* <img src="your-image-url.jpg" alt="Your Name" className="w-40 h-40 rounded-full mb-4 md:mb-0 md:mr-6 shadow-lg" /> */}
        <div className="text-left">
          <h2 className="text-2xl font-bold mb-2">Anil Kushwaha</h2>
          <p className="text-lg text-gray-700">
          Hi! I'm Anil, a dedicated full-stack developer with expertise in both front-end and back-end technologies. With a passion for creating efficient, scalable web applications, I enjoy tackling complex problems and staying up-to-date with the latest industry trends. Thanks for visiting my blog, where I share my projects, tips, and tutorials on full-stack development.
          </p>
          <div className="mt-4 flex space-x-4">
            <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Twitter</a>
            <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">LinkedIn</a>
            <a href="https://github.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">GitHub</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About