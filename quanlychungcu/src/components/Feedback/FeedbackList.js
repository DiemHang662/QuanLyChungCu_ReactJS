import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Tabs, Tab, Container, Row, Col } from 'react-bootstrap';
import CustomNavbar from '../../components/Navbar/Navbar';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { authApi, endpoints } from '../../configs/API';
import './FeedbackList.css';

const FeedbackList = () => {
  const [feedback, setFeedback] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const api = authApi();

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const params = filter === 'all' ? {} : { resolved: filter === 'resolved' ? 'true' : 'false' };
        const response = await api.get(endpoints.feedback, { params });
        setFeedback(response.data);
      } catch (error) {
        console.error('Error fetching feedback:', error.response?.data || error.message);
      }
    };

    fetchFeedback();
  }, [filter, api]);

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const filteredFeedback = feedback.filter(fb =>
    fb.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <CustomNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h1 className="title-list">DANH SÁCH PHẢN HỒI</h1>
      <Container className="feedback-list-container">
        <Tabs
          id="filter-tabs"
          activeKey={filter}
          onSelect={(value) => handleFilterChange(value)}
          className="flex"
        >
          <Tab eventKey="all" title="Tất cả" className="nav-link" />
          <Tab eventKey="resolved" title="Đã giải quyết" className="nav-link" />
          <Tab eventKey="unresolved" title="Chưa giải quyết" className="nav-link" />
        </Tabs>

        <Row className="justify-content-center">
          <Col xs={15} sm={15} md={15}>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th>Chủ đề</th>
                  <th>Người viết</th>
                  <th>Tình trạng</th>
                  <th>Chi tiết</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedback.map(fb => (
                  <tr key={fb.id}>
                    <td>{fb.title}</td>
                    <td>{fb.first_name} {fb.last_name}</td>
                    <td>{fb.resolved ? 'Đã giải quyết' : 'Chưa giải quyết'}</td>
                    <td>
                      <Button variant="primary" onClick={() => navigate(`/feedback/${fb.id}`)}>
                        <KeyboardDoubleArrowRightIcon />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
      <Button variant="primary" onClick={() => navigate('/feedback/new')} className="add-feedback-btn">
        Add Feedback
      </Button>
    </>
  );
};

export default FeedbackList;