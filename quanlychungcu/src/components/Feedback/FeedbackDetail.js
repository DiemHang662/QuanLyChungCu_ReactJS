import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { authApi, endpoints } from '../../configs/API';

const FeedbackDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const api = authApi(); 

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await api.get(endpoints.feedbackDetail(id));
        setFeedback(response.data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    fetchFeedback();
  }, [id, api]);

  const handleToggleResolved = async () => {
    try {
      await api.patch(endpoints.updateResolved(feedback.id));
      navigate('/feedback');
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  if (!feedback) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="feedback-detail-card">
      <Card.Header>Feedback Detail</Card.Header>
      <Card.Body>
        <Card.Title>{feedback.title}</Card.Title>
        <Card.Text>{feedback.content}</Card.Text>
        <Card.Text>
          <small className="text-muted">By: {feedback.first_name} {feedback.last_name}</small>
        </Card.Text>
        <Card.Text>
          <small className="text-muted">Status: {feedback.resolved ? 'Resolved' : 'Unresolved'}</small>
        </Card.Text>
        {!feedback.resolved && (
          <Button variant="success" onClick={handleToggleResolved}>
            Mark as Resolved
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default FeedbackDetail;