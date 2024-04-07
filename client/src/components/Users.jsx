import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Label, TextInput, Button, Alert, Modal, Table, TableBody } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
function Users() {
    const [user, setUser] = useState([]);
    const [userError, setUserError] = useState(null)
    const [showMore, setShowMore] = useState(true)
    const [deleteUserId, setDeleteUserId] = useState(false)
    const [deleteUserError, setDeleteUserError] = useState(null)
    const { currentUser } = useSelector(state => state.user)
    const [deleteusermessage,setDeleteUserMessage]=useState(null)
    const [openModal, setOpenModal] = useState(false);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/getusers')
                const data = await response.json();
                if (!response.ok) {
                    setUserError(data.message)
                }
                else {
                    // console.log('userdata', data.users)
                    setUser(data.users)
                    if (data.users.length > 9) {
                        setShowMore(false)
                    }
                }
            } catch (error) {
                setUserError(error.message)
            }
        }
        if (currentUser.rest.isAdmin) {
            fetchUser()
        }
    }, [currentUser.rest._id])

    async function handleDeletUser() {
        try {
            const response = await fetch('/api/delete/' + deleteUserId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },

            })
            const data = await response.json()
            if (!response.ok) {
                setDeleteUserError(data.message)
            }
            else {
                setDeleteUserError(null)
                setUser(prev => prev.filter(val => val._id !== deleteUserId));
                setDeleteUserMessage('User has been deleted successfully!')
                setTimeout(()=>{
                    setDeleteUserMessage(null)  
                },3000)
            }
        } catch (error) {
            setDeleteUserError(error.message)
        }
    }
    return (
        <div className="overflow-x-auto w-full">
            {deleteusermessage && (
                <Alert color='success' className='mt-5 mb-5'>{deleteusermessage}</Alert>
            )}
            {
                currentUser.rest.isAdmin && user.length > 0 ? (
                    <Table striped>
                        <Table.Head>
                            <Table.HeadCell>User Name</Table.HeadCell>
                            <Table.HeadCell>Profile Picture</Table.HeadCell>
                            <Table.HeadCell>Updated At</Table.HeadCell>
                            <Table.HeadCell>IsAdmin</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell >Delete</Table.HeadCell>
                        </Table.Head>
                        {
                            user.map((user) => (
                                <Table.Body className="divide-y" key={user._id}>
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {user.username}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <img src={user.profilePicture} alt={user.username} className='w-10 h-10 object-cover bg-gray-500 rounded-full' />
                                        </Table.Cell>
                                        <Table.Cell>{new Date(user.updatedAt).toLocaleDateString()}</Table.Cell>
                                        <Table.Cell><span className='font-bold '>{user.isAdmin ? 'Yes' : 'No'}</span></Table.Cell>
                                        <Table.Cell><span className='font-bold '>{user.email}</span></Table.Cell>
                                        <Table.Cell>
                                            <span onClick={() => {setOpenModal(true); setDeleteUserId(user._id)}} className="font-medium cursor-pointer text-red-500 hover:underline dark:text-red-500">
                                                Delete
                                            </span>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))
                        }
                    </Table>
                ) : (
                    <p>There are no users to fetch!</p>
                )
            }
            <Modal show={openModal} size="md" onClose={() => {setOpenModal(false)}} popup>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this user?
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="failure" onClick={() => {setOpenModal(false),handleDeletUser()}}>
                                {"Yes, I'm sure"}
                            </Button>
                            <Button color="gray" onClick={() => setOpenModal(false)}>
                                No, cancel
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Users