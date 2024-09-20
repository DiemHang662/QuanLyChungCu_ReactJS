import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Table, ButtonGroup, Image, Modal } from 'react-bootstrap';
import CustomNavbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { authApi, endpoints } from '../../configs/API';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import './ResidentList.css';

const ResidentList = () => {
  const api = authApi();
  const [residents, setResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // 'all', 'resident', or 'superuser'
  const [editResident, setEditResident] = useState(null); // Resident being edited
  const [showEditModal, setShowEditModal] = useState(false); // Modal visibility
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await api.get(endpoints.residents);
        setResidents(response.data);
      } catch (error) {
        console.error('Error fetching residents:', error.response?.data || error.message);
      }
    };

    fetchResidents();
  }, []);

  // Filter residents based on search term and selected role
  const filteredResidents = residents
    .filter(resident =>
      (resident.first_name + ' ' + resident.last_name)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .filter(resident => {
      if (filterRole === 'superuser') return resident.is_superuser;
      if (filterRole === 'resident') return !resident.is_superuser;
      return true; // Show all residents when filter is 'all'
    });

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cư dân này không?')) {
      try {
        await api.delete(endpoints.deleteResident(id));
        // Remove the deleted resident from the list
        setResidents(residents.filter(resident => resident.id !== id));
      } catch (error) {
        console.error('Error deleting resident:', error.response?.data || error.message);
      }
    }
  };

  const handleLock = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn khóa tài khoản này không?')) {
      try {
        await api.post(endpoints.lockAccount(id));
        const response = await api.get(endpoints.residents);
        setResidents(response.data);
      } catch (error) {
        console.error('Error locking resident:', error);
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editResident) {
      try {
        if (editResident.id) {
          await api.patch(endpoints.updateResident(editResident.id), editResident);
        } else {
          await api.post(endpoints.createResident, editResident);
        }
        const response = await api.get(endpoints.residents);
        setResidents(response.data);
        setShowEditModal(false);
        setEditResident(null);
      } catch (error) {
        console.error('Error saving resident:', error.response?.data || error.message);
      }
    }
  };

  return (
    <>
      <CustomNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h1 className="title-list text-primary">DANH SÁCH NGƯỜI DÙNG</h1>
      <div className="container">
        <Form className="filter-form">
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm cư dân"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '550px', marginLeft: '30px' }}
            />
          </Form.Group>
          <Button 
            className="add-resident-button"
            onClick={() => {
             navigate('/register')
            }} 
            variant="success"
          >
            <AddIcon /> Thêm
          </Button>
        </Form>

        {/* Filter Buttons for Role */}
        <ButtonGroup className="filter-role-buttons" style={{ marginTop: '20px' }}>
          <Button 
            variant={filterRole === 'all' ? 'primary' : 'outline-primary' }
            onClick={() => setFilterRole('all')}
          >
            Tất cả
          </Button>
          <Button 
            variant={filterRole === 'resident' ? 'primary' : 'outline-primary'}
            onClick={() => setFilterRole('resident')}
          >
            Cư dân
          </Button>
          <Button 
            variant={filterRole === 'superuser' ? 'primary' : 'outline-primary'}
            onClick={() => setFilterRole('superuser')}
          >
            Quản trị viên
          </Button>
        </ButtonGroup>
      </div>

      <div className="resident-list-table">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Ảnh đại diện</th>
              <th>Họ và tên</th>
              <th>Tên tài khoản</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Tác vụ</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.map(resident => (
              <tr key={resident.id}>
                <td>
                  {resident.avatar_url && (
                    <Image src={resident.avatar_url} className="avatar-user" />
                  )}
                </td>
                <td>{resident.first_name} {resident.last_name}</td>
                <td>{resident.username}</td>
                <td>{resident.phone || 'Chưa cập nhật'}</td>
                <td>{resident.email}</td>
                <td>
                  {resident.is_superuser ? 'Quản trị viên' : 'Cư dân'}
                </td>
                <td className="action-buttons">
                  <Button variant="primary"
                    className="resident-button-primary"
                    onClick={() => navigate(`/resident/${resident.id}`)}
                  >
                    <KeyboardDoubleArrowRightIcon />
                  </Button>
                  <Button variant ="danger"
                    className="resident-button-danger"
                    onClick={() => handleDelete(resident.id)}
                  >
                    <DeleteIcon />
                  </Button>
                  <Button variant ="warning"
                    className="resident-button-warning"
                    onClick={() => {
                      setEditResident(resident);
                      setShowEditModal(true);
                    }}
                  >
                    <EditIcon />
                  </Button>
                  <Button variant="secondary"
                    className="resident-button-secondary"
                    onClick={() => handleLock(resident.id)}
                  >
                    <LockIcon />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Edit Resident Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editResident?.id ? 'Chỉnh sửa cư dân' : 'Thêm cư dân'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group controlId="first_name">
              <Form.Label>Họ</Form.Label>
              <Form.Control
                type="text"
                value={editResident?.first_name || ''}
                onChange={(e) => setEditResident({ ...editResident, first_name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="last_name">
              <Form.Label>Tên</Form.Label>
              <Form.Control
                type="text"
                value={editResident?.last_name || ''}
                onChange={(e) => setEditResident({ ...editResident, last_name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="username">
              <Form.Label>Tên tài khoản</Form.Label>
              <Form.Control
                type="text"
                value={editResident?.username || ''}
                onChange={(e) => setEditResident({ ...editResident, username: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="phone">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                value={editResident?.phone || ''}
                onChange={(e) => setEditResident({ ...editResident, phone: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editResident?.email || ''}
                onChange={(e) => setEditResident({ ...editResident, email: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="is_superuser">
              <Form.Check
                type="checkbox"
                label="Quản trị viên"
                checked={editResident?.is_superuser || false}
                onChange={(e) => setEditResident({ ...editResident, is_superuser: e.target.checked })}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editResident?.id ? 'Lưu' : 'Thêm'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Footer/>
    </>
  );
};

export default ResidentList;
