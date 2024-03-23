import { Footer } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter, FaTimes, FaGithub } from 'react-icons/fa';
function FooterComponent() {
    return (
        <Footer container className='border border-t-8 border-blue-500'>
            <div className='w-full max-w-7xl mx-auto'>
                <div className=''>
                    <div className='mb-4'>
                        <Link to={"/"} className=' self-center whitespace-nowrap text-lg font-semibold dark:text-white sm:text-xl'>
                            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Anil's</span> Blog
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-8 sm:grid-cols-3 sm:gap-6">
                        <div>
                            <Footer.Title title="about" />
                            <Footer.LinkGroup col>
                                <Footer.Link 
                                href="#" className='hover:text-blue-500'
                                target='_blank'
                                rel='noopener noreferrer'
                                >
                                Portfolio</Footer.Link>
                                <Footer.Link href="#" className='hover:text-blue-500'>Explore</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Follow Us" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="#" className='hover:text-blue-500'>Twitter</Footer.Link>
                                <Footer.Link href="#" className='hover:text-blue-500'>Facebook</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title="Legal" />
                            <Footer.LinkGroup col>
                                <Footer.Link href="#" className='hover:text-blue-500'>Privacy Policy</Footer.Link>
                                <Footer.Link href="#" className='hover:text-blue-500'>Term of Service</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                    <Footer.Divider />
                    <div className="w-full sm:flex sm:items-center sm:justify-between">
                        <Footer.Copyright href="#" by="HustleHub™" year={new Date().getFullYear()} />
                        <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                            <Footer.Icon href="#" icon={FaFacebook} />
                            <Footer.Icon href="#" icon={FaInstagram} />
                            <Footer.Icon href="#" icon={FaTwitter} />
                            <Footer.Icon href="#" icon={FaGithub} />
                        </div>
                    </div>
                </div>
            </div>
        </Footer>
    )
}

export default FooterComponent