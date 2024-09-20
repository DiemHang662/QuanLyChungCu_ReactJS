import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Table, Image, Modal } from 'react-bootstrap';
import CustomNavbar from '../../components/Navbar/Navbar';
import { authApi, endpoints } from '../../configs/API';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import './BillList.css';

const BillList = () => {
  const api = authApi();
  const navigate = useNavigate();

  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [editBill, setEditBill] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [residents, setResidents] = useState([]);

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

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const params = filter === 'all' ? {} : { payment_status: filter.toUpperCase() };
        const response = await api.get(endpoints.bills, { params });
        setBills(response.data);
      } catch (error) {
        console.error('Error fetching bills:', error.response?.data || error.message);
      }
    };

    fetchBills();
  }, [filter]);

  const filteredBills = bills.filter(bill =>
    bill.bill_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hóa đơn này không?')) {
      try {
        await api.delete(endpoints.deleteBill(id));
        setBills(bills.filter(bill => bill.id !== id));
      } catch (error) {
        console.error('Error deleting bill:', error.response?.data || error.message);
      }
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editBill) {
      try {
        if (editBill.id) {
          await api.patch(endpoints.updateBill(editBill.id), editBill);
        } else {
          await api.post(endpoints.createBill, editBill);
        }
        const response = await api.get(endpoints.bills);
        setBills(response.data);
        setShowEditModal(false);
        setEditBill(null);
      } catch (error) {
        console.error('Error saving bill:', error.response?.data || error.message);
      }
    }
  };


  return (
    <>
      <CustomNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h1 className="title-list text-primary">DANH SÁCH HÓA ĐƠN</h1>
      <div className="container1">
        <Form className="filter-form">
          <Form.Group style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <Form.Control
              type="text"
              placeholder="Tìm kiếm hóa đơn"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '750px', marginLeft: '200px', marginRight: '20px' }}
            />
            <Button
              className="add-bill-button"
              onClick={() => {
                setEditBill(null);
                setShowEditModal(true);
              }}
              variant="success"
            >
              <AddIcon /> Thêm
            </Button>
          </Form.Group>
        </Form>

        <div className="bill-list-table1">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Ảnh đơn vị</th>
                <th>Loại hóa đơn</th>
                <th>Số tiền</th>
                <th>Trạng thái thanh toán</th>
                <th>Tác vụ</th>
              </tr>
            </thead>
            <tbody>
              {filteredBills.map(bill => (
                <tr key={bill.id}>
                  <td>
                    {bill.image_url && (
                      <Image src={bill.image_url} className="image-bill" />
                    )}
                  </td>
                  <td>{bill.bill_type}</td>
                  <td>{bill.amount}</td>
                  <td>{bill.payment_status}</td>
                  <td className="action-buttons">
                    <Button
                      className="bill-button-primary"
                      onClick={() => navigate(`/bill/${bill.id}`)}
                    >
                      <KeyboardDoubleArrowRightIcon />
                    </Button>
                    <Button variant="danger"
                      className="bill-button-danger"
                      onClick={() => handleDelete(bill.id)}
                    >
                      <DeleteIcon />
                    </Button>
                    <Button variant="warning"
                      className="bill-button-warning"
                      onClick={() => {
                        setEditBill(bill);
                        setShowEditModal(true);
                      }}
                    >
                      <EditIcon />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editBill?.id ? 'Chỉnh sửa hóa đơn' : 'Thêm hóa đơn'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group controlId="bill_type">
              <Form.Label>Loại hóa đơn</Form.Label>
              <Form.Control
                type="text"
                value={editBill?.bill_type || ''}
                onChange={(e) => setEditBill({ ...editBill, bill_type: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="amount">
              <Form.Label>Số tiền</Form.Label>
              <Form.Control
                type="number"
                value={editBill?.amount || ''}
                onChange={(e) => setEditBill({ ...editBill, amount: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="payment_status">
              <Form.Label>Trạng thái thanh toán</Form.Label>
              <Form.Select
                value={editBill?.payment_status || ''}
                onChange={(e) => setEditBill({ ...editBill, payment_status: e.target.value })}
                required
              >
                <option value="">Chọn trạng thái</option>
                <option value="PAID">Đã thanh toán</option>
                <option value="UNPAID">Chưa thanh toán</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="due_date">
              <Form.Label>Ngày đến hạn</Form.Label>
              <Form.Control
                type="date"
                value={editBill?.due_date || ''}
                onChange={(e) => setEditBill({ ...editBill, due_date: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="issue_date">
              <Form.Label>Ngày phát hành</Form.Label>
              <Form.Control
                type="date"
                value={editBill?.issue_date || ''}
                onChange={(e) => setEditBill({ ...editBill, issue_date: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="resident">
    <Form.Label>Cư dân</Form.Label>
    <Form.Select
        value={editBill?.resident || ''}
        onChange={(e) => setEditBill({ ...editBill, resident: e.target.value })}
        required
    >
        <option value="">Chọn cư dân</option>
        {residents.map((resident) => (
            <option key={resident.id} value={resident.id}>
                {resident.first_name} {resident.last_name} - {resident.id}
            </option>
        ))}
    </Form.Select>
</Form.Group>


            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Đóng
              </Button>
              <Button variant="primary" type="submit">
                {editBill?.id ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default BillList;
