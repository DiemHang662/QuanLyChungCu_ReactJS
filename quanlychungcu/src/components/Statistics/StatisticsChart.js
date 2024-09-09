import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { authApi, endpoints } from '../../configs/API';
import CustomNavbar from '../../components/Navbar/Navbar';
import { Alert } from 'react-bootstrap';
import './StatisticsChart.css';

// Register all necessary components
Chart.register(...registerables);

const StatisticsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [surveyId, setSurveyId] = useState('');
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const fetchStatistics = async () => {
    try {
      const api = authApi();
      const response = await api.get(endpoints.statistics(surveyId));

      console.log('API Response:', response.data);

      if (response.data && response.data.maximum_cleanliness !== undefined) {
        const data = {
          labels: ['Vệ sinh', 'Cơ sở vật chất', 'Dịch vụ'],
          datasets: [
            {
              label: 'Số % cao nhất',
              data: [
                response.data.maximum_cleanliness,
                response.data.maximum_facilities,
                response.data.maximum_services,
              ],
              backgroundColor: [
                '#FFC1C1',
                '#B0E2FF',
                '#C1FFC1',
              ],
              borderColor: [
                'red',
                'blue',
                'green',
              ],
              borderWidth: 1,
            },
          ],
        };
        setChartData(data);
        setError('');
        setAlertMessage('Đã tìm thấy mã khảo sát');
        setShowAlert(true);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching statistics:', err);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Unauthorized: Please check your token.');
        } else if (err.response.status === 404) {
          setError('Không tìm thấy mã khảo sát này. Vui lòng thử lại');
        } else {
          setError(`Failed to fetch statistics. Status: ${err.response.status}`);
        }
      } else {
        setError('Failed to fetch statistics. Please try again later.');
      }
      setAlertMessage('Không tìm thấy mã khảo sát này. Vui lòng thử lại');
      setShowAlert(true);
      setChartData(null);
    }
  };

  return (
    <>
      <CustomNavbar />
      <div className="statistics-chart-container">
        <div className="form-container">
          <h1>Thống Kê Khảo Sát</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchStatistics();
            }}
          >
            <label htmlFor="survey_id">Nhập mã khảo sát:</label>
            <input
              type="number"
              id="survey_id"
              name="survey_id"
              value={surveyId}
              onChange={(e) => setSurveyId(e.target.value)}
              min="1"
              required
            />
            <button type="submit" >Xem</button>
          </form>
          {showAlert && (
            <Alert variant={error ? "danger" : "success"} style={{ width: '100%', margin: '25px 0' }}>
              {alertMessage}
            </Alert>
          )}
        </div>
        <div className="chart-container">
          {chartData && (
            <Bar data={chartData} options={{ scales: { y: { beginAtZero: true } } }} />
          )}
        </div>
      </div>
    </>
  );
};

export default StatisticsChart;