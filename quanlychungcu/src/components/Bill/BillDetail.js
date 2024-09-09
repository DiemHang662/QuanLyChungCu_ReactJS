import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import CustomNavbar from '../../components/Navbar/Navbar';
import { authApi, endpoints } from '../../configs/API';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import './BillDetail.css';

const BillDetail = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const api = authApi();

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const response = await api.get(endpoints.billDetail(id)); 
        setBill(response.data);
      } catch (error) {
        console.error('Error fetching bills:', error.response?.data || error.message);
      }
    };

    fetchBill();
  }, [id, api]);

  if (!bill) return <div>Bill not found</div>;

  return (
    <>
      <CustomNavbar />
      <Container className="bill-detail-container">
        <Row>
          <Col>
            <img src={bill.avatar_url} alt={`${bill.first_name} ${bill.last_name}`} className="avatar" />
          </Col>
          <Col>
            <div className="bill-details">
              <h2>{bill.bill_type}</h2>
              <p>
                <strong>Cư dân:     </strong>{bill.first_name} {bill.last_name} <br />
                <strong>Số điện thoại:      </strong>{bill.phone} <br />
                <strong>Số tiền:    </strong>{bill.amount} VNĐ<br />
                <strong>Ngày phát hành:     </strong>{bill.issue_date} <br />
                <strong>Ngày hết hạn:       </strong>{bill.due_date} <br />
                <strong>Tình trạng thanh toán:      </strong> {bill.payment_status}
              </p>
              <Button onClick={() => window.history.back()}>
                <KeyboardBackspaceIcon /> Quay về
            </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BillDetail;