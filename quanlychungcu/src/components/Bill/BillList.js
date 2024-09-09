import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';
import CustomNavbar from '../../components/Navbar/Navbar';
import { authApi, endpoints } from '../../configs/API';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import './BillList.css';

const BillList = () => {
  const api = authApi();
  const [bills, setBills] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

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
  }, [filter, api]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const filteredBills = bills.filter(bill =>
    bill.bill_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <CustomNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h1 className="title-list">DANH SÁCH HÓA ĐƠN</h1>
      <div className="container">
        <Form className="filter-form">
          <Form.Check
            type="radio"
            label="Tất cả"
            name="filterOptions"
            value="all"
            checked={filter === 'all'}
            onChange={handleFilterChange}
            className="radio-filter"
          />
          <Form.Check
            type="radio"
            label="Đã thanh toán"
            name="filterOptions"
            value="paid"
            checked={filter === 'paid'}
            onChange={handleFilterChange}
            className="radio-filter"
          />
          <Form.Check
            type="radio"
            label="Chưa thanh toán"
            name="filterOptions"
            value="unpaid"
            checked={filter === 'unpaid'}
            onChange={handleFilterChange}
            className="radio-filter"
          />
        </Form>
      </div>

      <div className="bill-list-cards">
        {filteredBills.map(bill => (
          <div key={bill.id} className="bill-item">
            <img src={bill.image_url} alt={`${bill.first_name} ${bill.last_name}`} className="bill-image" />
            <div className="bill-info">
              <div className="bill-type">{bill.bill_type}</div>
              <div className="bill-amount">Số tiền thanh toán: {bill.amount} VNĐ</div>
              <div className="bill-status">Tình trạng thanh toán: {bill.payment_status}</div>
            </div>
            <Button className="bill-button-primary" onClick={() => navigate(`/bill/${bill.id}`)}>
              <KeyboardDoubleArrowRightIcon />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
};

export default BillList;