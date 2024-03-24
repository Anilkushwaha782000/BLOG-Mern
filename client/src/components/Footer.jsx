import { Footer,Button,Modal } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram, FaTwitter, FaTimes, FaGithub } from 'react-icons/fa';
import { useState } from "react";
function FooterComponent() {
    const [openModal, setOpenModal] = useState(false);
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
                                <Footer.Link href="#" onClick={() => setOpenModal(true)} className='hover:text-blue-500'>Term of Service</Footer.Link>
                                <Footer.Link href="#" className='hover:text-blue-500'>Privacy Policy</Footer.Link>
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
            <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Terms of Service</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              With less than a month to go before the European Union enacts new consumer privacy laws for its citizens,
              companies around the world are updating their terms of service agreements to comply.
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant
              to ensure a common set of data rights in the European Union. It requires organizations to notify users as
              soon as possible of high-risk data breaches that could personally affect them.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>I accept</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
        </Footer>
    )
}

export default FooterComponent