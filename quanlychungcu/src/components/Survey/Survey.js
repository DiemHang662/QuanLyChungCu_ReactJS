import React, { useState, useEffect } from 'react';
import { authApi, endpoints } from '../../configs/API';
import CustomNavbar from '../../components/Navbar/Navbar';
import './Survey.css';

const Survey = () => {
  const [surveys, setSurveys] = useState([]);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [cleanlinessRating, setCleanlinessRating] = useState('');
  const [facilitiesRating, setFacilitiesRating] = useState('');
  const [servicesRating, setServicesRating] = useState('');
  const [error, setError] = useState(null);
  const [resident] = useState('1'); // Placeholder resident ID

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const api = authApi(); // Initialize authenticated API
      const response = await api.get(endpoints.survey);
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
      const api = authApi(); // Initialize authenticated API
      const response = await api.post(endpoints.surveyresult, {
        survey: selectedSurvey.id,
        cleanliness_rating: cleanlinessRating,
        facilities_rating: facilitiesRating,
        services_rating: servicesRating,
        resident: resident,
      });

      console.info('Survey submitted successfully:', response.data);
      setCleanlinessRating(''); // Reset form fields
      setFacilitiesRating('');
      setServicesRating('');
    } catch (error) {
      console.error('Error submitting survey:', error);
      setError(`Error submitting survey: ${error.message}`);
    }
  };

  return (
    <>
      <CustomNavbar />
      <div className="survey-container">
        <h2 className="text-primary">Khảo sát dành cho cư dân</h2>
        <div className="survey-content">
          <div className="survey-list-container">
            <ul className="survey-list">
              {surveys.map((survey) => (
                <li
                  key={survey.id}
                  className={`survey-item ${selectedSurvey === survey ? 'selected' : ''}`}
                  onClick={() => handleSurveySelection(survey)}
                >
                  {survey.title}
                </li>
              ))}
            </ul>
          </div>

          {selectedSurvey && (
            <div className="survey-form">
              <h1>{selectedSurvey.title}</h1>

              <div className="form-group">
                <label htmlFor="cleanliness">Đánh giá mức độ vệ sinh:</label>
                <input
                  type="number"
                  id="cleanliness"
                  placeholder="1 - 100"
                  className="input"
                  value={cleanlinessRating}
                  onChange={(e) => setCleanlinessRating(e.target.value)}
                  min="1"
                  max="100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="facilities">Đánh giá cơ sở vật chất:</label>
                <input
                  type="number"
                  id="facilities"
                  placeholder="1 - 100"
                  className="input"
                  value={facilitiesRating}
                  onChange={(e) => setFacilitiesRating(e.target.value)}
                  min="1"
                  max="100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="services">Đánh giá dịch vụ:</label>
                <input
                  type="number"
                  id="services"
                  placeholder="1 - 100"
                  className="input"
                  value={servicesRating}
                  onChange={(e) => setServicesRating(e.target.value)}
                  min="1"
                  max="100"
                />
              </div>

              <button className="submit-btn" onClick={submitSurvey}>Gửi khảo sát</button>
            </div>
          )}
        </div>

        {error && <p className="error-text">{error}</p>}
      </div>
    </>
  );
};

export default Survey;
