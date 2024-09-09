// Profile.js

import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Container, Row, Col, Image, Spinner } from 'react-bootstrap';
import { MyDispatchContext, MyUserContext } from '../../configs/Contexts';
import { authApi, endpoints } from '../../configs/API';
import LogoutIcon from '@mui/icons-material/Logout';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import './Profile.css';

const Profile = () => {
    const [resident, setResident] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useContext(MyDispatchContext);
    const navigate = useNavigate();

    const fetchProfile = useCallback(async () => {
        try {
            const api = await authApi();
            const response = await api.get(endpoints.residents);
            console.log('API response:', response.data);
            setResident(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleLogout = () => {
        dispatch({ type: "logout" });
        navigate('/');
    };

    const handleChangePassword = () => {
        navigate('/change-password');
    };

    const handleChangeAvatar = async () => {
        navigate('/change-avatar');
        await fetchProfile();
    };

    if (loading) {
        return (
            <div className="spinner-container">
                <Spinner animation="border" variant="success" />
            </div>
        );
    }

    if (!resident || !Array.isArray(resident) || resident.length === 0) {
        return (
            <div className="container">
                <h2 className="error">Không thể tải thông tin cư dân.</h2>
            </div>
        );
    }

    const user = resident[0];

    return (
        <Container className="profile-container">
            <Row>
                <Col md={5} className="avatar-container">
                    {user.avatar_url && (
                        <Image
                            src={user.avatar_url}
                            className="avatar-image"
                        />
                    )}
                    <Button variant="link" onClick={handleChangeAvatar} className="icon-button">
                        <AddPhotoAlternateIcon /> Đổi ảnh
                    </Button>
                </Col>

                <Col md={6} className="profile-content">
                    <h1 className="hello">Chào, {user.first_name} {user.last_name}</h1>
                    <Card>
            <Card.Header as="h2" className="text-center text-danger">HỒ SƠ CÁ NHÂN</Card.Header>
            <Card.Body>
              <Card.Text>
                <strong className="text-success">Họ và tên:</strong> {user.first_name} {user.last_name}
              </Card.Text>
              <Card.Text>
                <strong className="text-success">Tên tài khoản:</strong> {user.username}
              </Card.Text>
              <Card.Text>
                <strong className="text-success">Số điện thoại:</strong> {user.phone}
              </Card.Text>
              <Card.Text>
                <strong className="text-success">Email:</strong> {user.email}
              </Card.Text>
            </Card.Body>
          </Card>
                    
                    <div className="btn">
                        <Button variant="primary" onClick={handleChangePassword}>
                            <ChangeCircleIcon /> Đổi mật khẩu?
                        </Button>

                        <Button variant="danger" onClick={handleLogout}>
                            <LogoutIcon /> Đăng xuất
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;