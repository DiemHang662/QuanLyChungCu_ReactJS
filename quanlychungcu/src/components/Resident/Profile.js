import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col, Image, Spinner, Form, Modal } from 'react-bootstrap';
import { MyDispatchContext } from '../../configs/Contexts';
import { authApi, endpoints } from '../../configs/API';
import CustomNavbar from '../../components/Navbar/Navbar';
import LogoutIcon from '@mui/icons-material/Logout';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import './Profile.css';

const Profile = () => {
    const [resident, setResident] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // For change password modal
    const [oldPassword, setOldPassword] = useState(''); // Old password state
    const [newPassword, setNewPassword] = useState(''); // New password state
    const [confirmPassword, setConfirmPassword] = useState(''); // Confirm password state
    const [passwordError, setPasswordError] = useState(null); // Error for password mismatch

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
        dispatch({ type: 'logout' });
        navigate('/');
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordError('Mật khẩu không khớp!');
            return;
        }

        try {
            const api = await authApi();
            await api.post(endpoints.changePassword, {
                old_password: oldPassword,
                new_password: newPassword,
            });
            alert('Mật khẩu đã được thay đổi thành công!');
            setShowModal(false); // Close the modal on success
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Đã xảy ra lỗi khi đổi mật khẩu!');
        }
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
                            <Button variant="primary" onClick={() => setShowModal(true)}>
                                <ChangeCircleIcon /> Đổi mật khẩu?
                            </Button>
                            <Button variant="danger" onClick={handleLogout}>
                                <LogoutIcon /> Đăng xuất
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>

            {/* Change Password Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Đổi mật khẩu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="oldPassword">
                            <Form.Label>Mật khẩu cũ</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Nhập mật khẩu cũ"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="newPassword">
                            <Form.Label>Mật khẩu mới</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Nhập mật khẩu mới"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="confirmPassword">
                            <Form.Label>Nhập lại mật khẩu</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Nhập lại mật khẩu mới"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </Form.Group>
                        {passwordError && <p className="error">{passwordError}</p>}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleChangePassword}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Profile;
