import React, { useState } from 'react';
import { Button, Container, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../configs/API';
import './ChangeAvatar.css';

const ChangeAvatar = () => {
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  const handleChooseAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  // Function to handle avatar upload
  const handleUploadAvatar = async () => {
    if (!avatar) {
      window.alert('Error: No avatar selected');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('avatar', avatar, 'avatar.jpg');
  
      const api = await authApi();
  
      const res = await api.patch('/api/residents/change-avatar/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Avatar updated successfully:', res.data);
      window.alert('Success: Avatar updated successfully');
      navigate('/profile');
    } catch (error) {
      console.error('Error updating avatar', error);
      window.alert('Error: Failed to update avatar');
    }
  };

  return (
    <Container className="change-avatar-container">
      {avatar && <Image src={URL.createObjectURL(avatar)} rounded className="avatar-image" />}
      <div className="button-container">
        <input type="file" accept="image/*" onChange={handleChooseAvatar} className="file-input" />
        <Button variant="success" onClick={handleUploadAvatar}>Đổi ảnh đại diện</Button>
      </div>
    </Container>
  );
};

export default ChangeAvatar;