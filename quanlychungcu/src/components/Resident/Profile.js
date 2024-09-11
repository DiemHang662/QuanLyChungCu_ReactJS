import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Image, Spinner, Navbar } from 'react-bootstrap';
import { MyDispatchContext } from '../../configs/Contexts';
import { authApi, endpoints } from '../../configs/API';
import CustomNavbar from '../../components/Navbar/Navbar';
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

    const handleChangeAvatar = () => {
        navigate('/change-avatar');
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
        <>
        <CustomNavbar />
        <Container className="profile-container">
            <Row>
                <Col md={5} className="avatar-container">
                    {user.avatar_url && (
                        <Image
                            src={user.avatar_url}
                            className="avatar-image"
                            roundedCircle
                        />
                    )}
                    <Button variant="link" onClick={handleChangeAvatar} className="icon-button">
                        <AddPhotoAlternateIcon /> Đổi ảnh
                    </Button>
                </Col>

                <Col md={7} className="profile-content">
                    <h1 className="hello">Chào, {user.first_name} {user.last_name}</h1>
                    <div className="profile-details">
                        <p><strong>Họ và tên:</strong> {user.first_name} {user.last_name}</p>
                        <p><strong>Tên tài khoản:</strong> {user.username}</p>
                        <p><strong>Số điện thoại:</strong> {user.phone}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                    </div>
                    
                    <div className="btn-group">
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
        </>
    );
};

export default Profile;
