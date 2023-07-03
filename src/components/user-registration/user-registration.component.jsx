import React, { useState, useRef } from 'react';
import './user-registration.style.css';
import { auth, firestore, storage } from '../../config/firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';

function UserRegistration() {
  const [userImage, setUserImage] = useState(null);
  const [userImageUrl, setUserImageUrl] = useState('');
  const [RUserEmail, setRUserEmail] = useState('');
  const [RUserPassword, setRUserPassword] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageText, setImageText] = useState('');
  const formRef = useRef(null);

  const selectImage = (e) => {
    if (e.target.files[0]) {
      setUserImage(e.target.files[0]);
      setUserImageUrl(URL.createObjectURL(e.target.files[0]));
    }
    setImageText(
      'The image can only be uploaded once and cannot be changed later.'
    );
  };

  const createUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const addNewUser = async (e) => {
    e.preventDefault();

    const URForm = formRef.current;
    const URFormData = URForm.querySelectorAll('input, select');
    const formData = {};

    const userEmail = RUserEmail;
    const userPassword = RUserPassword;

    try {
      await createUser(userEmail, userPassword);

      const newUserId = auth.currentUser.uid;
      const imgRef = ref(storage, `lecturerProfileImg/${newUserId}`);
      const uploadTask = uploadBytesResumable(imgRef, userImage);

      uploadTask.on('state_changed', (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      });

      uploadTask
        .then(() => getDownloadURL(imgRef))
        .then((url) => {
          URFormData.forEach((d) => {
            if (d.type === 'checkbox') {
              formData[d.name] = d.checked;
            } else if (d.type === 'file') {
              formData[d.name] = url;
            } else {
              formData[d.name] = d.value;
            }
          });
          return setDoc(doc(firestore, 'lecturers', newUserId), formData);
        })
        .then(() => {
          alert('New user successfully added');
          URForm.reset();
          setUserImage(null);
          setUserImageUrl('');
          setUploadProgress(0);
        })
        .catch((error) => {
          console.error('Error adding new user:', error);
        });
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className='user-registration'>
      <form action='submit' onSubmit={addNewUser} id='user-register-form' ref={formRef}>
        {/* name */}
        <div className="registration-form-data-field">
          <label htmlFor="RUserName">Name</label>
          <input type="text" name='RUserName' id='RUserName' />
        </div>
        {/* email */}
        <div className="registration-form-data-field">
          <label htmlFor="REmail">Email</label>
          <input type="email" name='REmail' id='REmail' onChange={(e) => { setRUserEmail(e.target.value) }} />
        </div>
        {/* password */}
        <div className="registration-form-data-field">
          <label htmlFor="RPassword">Password</label>
          <input type="password" name='RPassword' id='RPassword' onChange={(e) => { setRUserPassword(e.target.value) }} />
        </div>
        {/* number */}
        <div className="registration-form-data-field">
          <label htmlFor="RMobileNumber">Number</label>
          <input type="number" name='RMobileNumber' id='RMobileNumber' />
        </div>
        {/* department */}
        <div className="registration-form-data-field">
          <label htmlFor="RDepartment">Department</label>
          <select name="RDepartment" id="RDepartment">
            <option value="hndit">HND-IT</option>
            <option value="hnde">HND-E</option>
            <option value="hndba">HND-BA</option>
            <option value="hnda">HND-A</option>
            <option value="hndthm">HND-THM</option>
          </select>
        </div>
        {/* state */}
        <div className="registration-form-data-field">
          <label htmlFor="RVisitOrPerm">State</label>
          <select name='RVisitOrPerm' id='RVisitOrPerm'>
              <option value='permanent'>Permanent</option>
              <option value='visiting'>Visiting</option>
            </select>
        </div>
        {/* image */}
        <div className="registration-form-data-field">
          <label htmlFor="RProfilePicture">Upload Image</label>
          <input type="file" name='RProfilePicture' id='RProfilePicture' onChange={selectImage} />
        </div>
        {/* admin state */}
        <div className="registration-form-data-field">
          <label htmlFor="RAdminState">Set Admin</label>
          <input type="checkbox" name="RAdminState" id="RAdminState" />
        </div>
        {/* submit button */}
        <div className="registration-form-data-field">
          <button type='submit' className='RBtn'>ADD NEW LECTURER</button>
        </div>
      </form>
      <div className="upload-img-wrapper">
        <div className="display-select-img">
          <img src={userImageUrl} alt="" />
        </div>
        <p>
          {uploadProgress > 0 && <progress value={uploadProgress} max="100" />}
        </p>
        <samp>{imageText}</samp>
      </div>
    </div>
  );
}

export default UserRegistration;
