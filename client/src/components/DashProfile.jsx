import React, { useEffect, useRef, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { Label, TextInput, Button, Alert } from "flowbite-react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateStart,updateFailure,updateSuccess } from '../reduxstore/user/userSlice';
function DashProfile() {
  const { currentUser } = useSelector(state => state.user);
  const initialUsername = currentUser.rest.username;
  const initialEmail = currentUser.rest.email;
  const [username, setUserName] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [imageFile, setImage] = useState(null);
  const[errorMessage,setErrorMessage]=useState(null)
  const [imageFileUrl, setImageUrl] = useState(currentUser.rest.profilePicture);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadSuccess, setImageFileUploadSuccess] = useState(null);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  const [updateUserSuccess,setUpdateUserSuccess]=useState(null)
  const [updateUserError,setUpdateUserError]=useState(null)
  const [formData,setFormData]=useState({})
  const filePickerRef = useRef();
  const dispatch=useDispatch()
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setUploadInProgress(true);
    console.log("upload",uploadInProgress)
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
        setImageFileUploadError("There was an error while uploading the image: Only images up to 2 MB can be uploaded");
        setTimeout(() => {
          setImageFileUploadError(null);
        }, 3000);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          console.log("downloadurl",downloadUrl)
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

  const handleUpdateProfile = async(e) => {
    e.preventDefault();
    setUpdateUserError(null)
    setUpdateUserSuccess(null)
    if (username === initialUsername && email === initialEmail && !password && !imageFileUrl) {
      return setErrorMessage("No changes made!");
    }
  try {
    const response=await fetch('/api/update/'+currentUser.rest._id,{
      method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({username,email,password,profilePicture:imageFileUrl})
     })
    //  console.log(response);
    const data=await response.json()
    console.log(data.message)
    if(!response.ok){
      dispatch(updateFailure(data.message))
      setUpdateUserError(data.message)
    }
    else{
      dispatch(updateSuccess(data))
      setErrorMessage(null);
      setUpdateUserSuccess('User profile updated successfully');
    }
  } catch (error) {
    dispatch(updateFailure(error.message))
    setUpdateUserError(error.message)
  }
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>
        Profile
      </h1>
      <form className='flex flex-col gap-4' onSubmit={handleUpdateProfile}>
        <input type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} className='hidden' />
        <div className='w-32 h-32 self-center cursor-pointer rounded-full shadow-md overflow-hidden' onClick={() => filePickerRef.current.click()}>
          <img src={imageFileUrl || currentUser.rest.profilePicture} alt='Profile Picture' className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' />
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
        <TextInput placeholder='Password' type='password' value={password} onChange={e => setPassword(e.target.value)} id='password' />
        <Button outline gradientDuoTone="purpleToBlue" onClick={handleUpdateProfile}>
          Update
        </Button>
      </form>
      {
            errorMessage && (
              <Alert className='mt-5' color='failure' withBorderAccent>
                {errorMessage}
              </Alert>
            )
          }
      <div className='text-red-500 justify-between flex mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
      {updateUserSuccess &&(
        <Alert color='success' className='mt-5'>{updateUserSuccess}</Alert>
      )}
       {updateUserError &&(
        <Alert color='failure' className='mt-5'>{updateUserError}</Alert>
      )}
    </div>
  );
}

export default DashProfile;
