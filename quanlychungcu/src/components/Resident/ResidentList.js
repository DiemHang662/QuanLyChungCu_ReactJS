import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Form, Table } from 'react-bootstrap';
import CustomNavbar from '../../components/Navbar/Navbar';
import { authApi, endpoints } from '../../configs/API';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import './ResidentList.css';

const ResidentList = () => {
  const api = authApi();
  const [residents, setResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
  }, [api]);

  const filteredResidents = residents.filter(resident =>
    (resident.first_name + ' ' + resident.last_name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <CustomNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h1 className="title-list">DANH SÁCH CƯ DÂN</h1>
      <div className="container">
      <Form className="filter-form">
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm cư dân"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Form>
      </div>

      <div className="resident-list-table">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Họ và tên</th>
              <th>Tên tài khoản</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.map(resident => (
              <tr key={resident.id}>
                <td>{resident.first_name} {resident.last_name}</td>
                <td>{resident.username}</td>
                <td>{resident.phone || 'Chưa cập nhật'}</td>
                <td>{resident.email}</td>
                <td>
                    {resident.is_superuser ? 'Quản trị viên' : 'Cư dân'}
                </td>

                <td>
                  <Button 
                    className="resident-button-primary"
                    onClick={() => navigate(`/resident/${resident.id}`)}
                  >
                    <KeyboardDoubleArrowRightIcon />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default ResidentList;
