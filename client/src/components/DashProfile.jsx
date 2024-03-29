import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Label, TextInput, Button, Alert } from "flowbite-react";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';

function DashProfile() {
  const { currentUser } = useSelector(state => state.user);
  const [username, setUserName] = useState(currentUser.rest.username);
  const [email, setEmail] = useState(currentUser.rest.email);
  const [password, setPassword] = useState('');
  const [imageFile, setImage] = useState(null);
  const [imageFileUrl, setImageUrl] = useState(currentUser.rest.profilePicture);
  const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadSuccess, setImageFileUploadSuccess] = useState(null);
  const [uploadInProgress, setUploadInProgress] = useState(false);
  console.log(imageFileUploadError, imageFileUploadingProgress)
  const filePickerRef = useRef();
  console.log("imageFile", imageFile)
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

  const handleUpdateProfile = () => {
    // Implement update profile logic here, including updating user information and image URL in the database
  };

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>
        Profile
      </h1>
      <form className='flex flex-col gap-4'>
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
        <TextInput placeholder='' type='text' value={username} onChange={e => setUserName(e.target.value)} id='username' />
        <TextInput placeholder='' type='email' value={email} onChange={e => setEmail(e.target.value)} id='email' />
        <TextInput placeholder='Password' type='password' value={password} onChange={e => setPassword(e.target.value)} id='password' />
        <Button outline gradientDuoTone="purpleToBlue" onClick={handleUpdateProfile}>
          Update
        </Button>
      </form>
      <div className='text-red-500 justify-between flex mt-5'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign Out</span>
      </div>
    </div>
  );
}

export default DashProfile;
