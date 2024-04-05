import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Label, TextInput, Button, Alert, Modal } from "flowbite-react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { useNavigate,Link } from 'react-router-dom';
import { updateStart, updateFailure, updateSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutSuccess } from '../reduxstore/user/userSlice';
import { HiOutlineExclamationCircle } from "react-icons/hi";
function DashProfile() {
  const { currentUser, error,loading} = useSelector(state => state.user);
  const initialUsername = currentUser?.rest?.username;
  const initialEmail = currentUser?.rest?.email;
  const [username, setUserName] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState(null);
  const [imageFile, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null)
  const [imageFileUrl, setImageUrl] = useState(currentUser?.rest?.profilePicture);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadSuccess, setImageFileUploadSuccess] = useState(null);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
  const [updateUserError, setUpdateUserError] = useState(null)
  const [formData, setFormData] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [signOut, setSignOut] = useState(false)
  const filePickerRef = useRef();
  const dispatch = useDispatch()
  const navigate = useNavigate();
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setUploadInProgress(true);
    console.log("upload", uploadInProgress)
    setImageFileUploadError(null);
    setImageFileUploadSuccess(null)
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '_' + imageFile.name; // Ensure unique file names
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadingProgress(progress.toFixed(0));
      },
      (error) => {
        setUploadInProgress(null);
        setImageFileUploadSuccess(null)
        setImageFileUploadError("There was an error while uploading the image: Only images up to 2 MB can be uploaded!");
        setTimeout(() => {
          setImageFileUploadError(null);
        }, 3000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          console.log("downloadurl", downloadUrl)
          setImageUrl(downloadUrl);
          setUploadInProgress(null);
          setImageFileUploadError(null);
          setImageFileUploadSuccess(true)
          setTimeout(() => {
            setImageFileUploadSuccess(null);
          }, 3000);

        }).catch((error) => {
          setUploadInProgress(null);
          setImageFileUploadSuccess(null)
          setImageFileUploadError("There was an error while getting the download URL");
          setTimeout(() => {
            setImageFileUploadError(null);
          }, 3000);
        })
      }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateUserError(null)
    setUpdateUserSuccess(null)
    if (username === initialUsername && email === initialEmail && !password && imageFileUrl === currentUser.rest.profilePicture) {
      return setErrorMessage("No changes made!");
    }
    try {
      dispatch(updateStart())
      const response = await fetch('/api/update/' + currentUser.rest._id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password, profilePicture: imageFileUrl })
      })
      const data = await response.json()
      // console.log(data.message)
      if (!response.ok) {
        dispatch(updateFailure(data.message))
        setUpdateUserError(data.message)
      }
      else {
        dispatch(updateSuccess(data))
        setErrorMessage(null);
        setUpdateUserSuccess('User profile updated successfully');
        setTimeout(() => {
          setUpdateUserSuccess(null);
        }, 2000);
      }
    } catch (error) {
      dispatch(updateFailure(error.message))
      setUpdateUserError(error.message)
    }
  };
  async function handleDeletAccount() {
    setShowModal(false)
    try {
      dispatch(deleteUserStart())
      const response = await fetch('/api/delete/' + currentUser.rest._id, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // body: JSON.stringify({token: currentUser.rest.token})

      })
      const data = await response.json()
      if (!response.ok) {
        dispatch(deleteUserFailure(data.message))
      }
      else {
        dispatch(deleteUserSuccess(data))
        navigate('/signup');
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }
  async function handleSignOut() {
    try {
      const response = await fetch('/api/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json();
      if (!response.ok) {
        setSignOut(data.message)
      }
      else {
        dispatch(signOutSuccess())
      }
    } catch (error) {
      setSignOut(error.message)
    }
  }
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>
        Profile
      </h1>
      <form className='flex flex-col gap-4' onSubmit={handleUpdateProfile}>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} className='hidden' />
        <div className='w-32 h-32 self-center cursor-pointer rounded-full shadow-md overflow-hidden' onClick={() => filePickerRef.current.click()}>
          <img src={imageFileUrl || currentUser.rest?.profilePicture} alt='Profile Picture' className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' />
        </div>
        {uploadInProgress && (
          <Alert color="warning">
            Please wait! Your image is currently being uploaded to our server. This may take a few moments...
          </Alert>
        )}
        {imageFileUploadError && <Alert color='failure'>
          {imageFileUploadError}
        </Alert>
        }
        {imageFileUploadSuccess && (
          <Alert color="success">
            Your profile picture has been updated successfully!
          </Alert>
        )}
        <TextInput placeholder='' type='text' value={username || ''} onChange={e => setUserName(e.target.value)} id='username' />
        <TextInput placeholder='' type='email' value={email || ''} onChange={e => setEmail(e.target.value)} id='email' />
        <TextInput placeholder='Password' type='password' value={password || ''} onChange={e => setPassword(e.target.value)} id='password' />
        <Button outline gradientDuoTone="purpleToBlue" onClick={handleUpdateProfile} disabled={loading}>
          {loading?'loading...':'Update'}
        </Button>
        {currentUser?.rest?.isAdmin && (
          <Link to='/createpost' >
            <Button type='button' className='w-full'  gradientDuoTone="purpleToPink">
              Create Post
            </Button>
          </Link>
        )}
      </form>
      {
        errorMessage && (
          <Alert className='mt-5' color='failure' withBorderAccent>
            {errorMessage}
          </Alert>
        )
      }
      <div className='text-red-500 justify-between flex mt-5'>
        <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess && (
        <Alert color='success' className='mt-5'>{updateUserSuccess}</Alert>
      )}
      {updateUserError && (
        <Alert color='failure' className='mt-5'>{updateUserError}</Alert>
      )}
      {error && (
        <Alert color='failure' className='mt-5'>{error}</Alert>
      )}
      {signOut && (
        <Alert color='success' className='mt-5'>User has been signout successfully</Alert>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletAccount}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default DashProfile;
