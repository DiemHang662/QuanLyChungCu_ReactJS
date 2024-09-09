// Survey.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Use axios for HTTP requests
import { useNavigate } from 'react-router-dom'; // Use useNavigate for routing
import './Survey.css'; // Import the CSS file

const Survey = () => {
  const navigate = useNavigate(); // Hook to access navigation object

  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [cleanlinessRating, setCleanlinessRating] = useState('');
  const [facilitiesRating, setFacilitiesRating] = useState('');
  const [servicesRating, setServicesRating] = useState('');
  const [error, setError] = useState(null);
  const [resident] = useState('1');

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await axios.get('http://192.168.0.101:8000/api/survey');
      setSurveys(response.data);
    } catch (error) {
      console.error('Error fetching surveys:', error);
      setError('Error fetching surveys. Please try again later.');
    }
  };

  const handleSurveySelection = (survey) => {
    setSelectedSurvey(survey);
  };

  const submitSurvey = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch("http://192.168.127.124:8000/api/surveyresult/", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          survey: selectedSurvey.id,
          cleanliness_rating: cleanlinessRating,
          facilities_rating: facilitiesRating,
          services_rating: servicesRating,
          resident: resident,
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.info(data);
      setCleanlinessRating('');
      setFacilitiesRating('');
      setServicesRating('');
    } catch (error) {
      console.error('There was a problem with your fetch operation:', error);
      setError(`Error submitting survey. ${error.message}`);
    }
  };

  return (
    <div className="container">
      <h2>Chọn khảo sát:</h2>

      <ul className="list">
        {surveys.map(survey => (
          <li
            key={survey.id}
            className={`surveyItem ${selectedSurvey === survey ? 'selected' : ''}`}
            onClick={() => handleSurveySelection(survey)}
          >
            {survey.title}
          </li>
        ))}
      </ul>

      {selectedSurvey && (
        <div className="surveyDetail">
          <h1>{selectedSurvey.title}</h1>

          <label>
            Nhập mức độ khảo sát cho tình hình vệ sinh
            <input
              placeholder="Vệ sinh"
              value={cleanlinessRating}
              onChange={e => setCleanlinessRating(e.target.value)}
              className="input"
            />
          </label>

          <label>
            Nhập mức độ khảo sát cho tình hình cơ sở vật chất
            <input
              placeholder="Cơ sở vật chất"
              value={facilitiesRating}
              onChange={e => setFacilitiesRating(e.target.value)}
              className="input"
            />
          </label>

          <label>
            Nhập mức độ khảo sát cho tình hình dịch vụ
            <input
              placeholder="Dịch vụ"
              value={servicesRating}
              onChange={e => setServicesRating(e.target.value)}
              className="input"
            />
          </label>

          <button onClick={submitSurvey}>Gửi khảo sát</button>
        </div>
      )}
      {error && <p className="errorText">{error}</p>}
    </div>
  );
};

export default Survey;