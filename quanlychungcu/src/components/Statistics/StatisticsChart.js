import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { authApi, endpoints } from '../../configs/API';
import CustomNavbar from '../../components/Navbar/Navbar';
import { Button, Alert } from 'react-bootstrap';
import Footer from '../../components/Footer/Footer';
import './StatisticsChart.css';

Chart.register(...registerables);

const StatisticsChart = () => {
  const [chartData, setChartData] = useState(null);
  const [surveys, setSurveys] = useState([]); // Initialize as an empty array
  const [selectedSurveyId, setSelectedSurveyId] = useState('');
  const [error, setError] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [chartValues, setChartValues] = useState({});

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const api = authApi();
        const response = await api.get(endpoints.survey); // Ensure this endpoint returns an array
        if (Array.isArray(response.data)) { // Check if response.data is an array
          setSurveys(response.data);
        } else {
          throw new Error('Expected an array from surveys endpoint');
        }
      } catch (err) {
        console.error('Error fetching surveys:', err);
        setError('Failed to fetch surveys. Please try again later.');
        setShowAlert(true);
      }
    };

    fetchSurveys();
  }, []);

  const fetchStatistics = async () => {
    if (!selectedSurveyId) {
      setError('Vui lòng chọn khảo sát.');
      setShowAlert(true);
      return;
    }

    try {
      const api = authApi();
      const response = await api.get(endpoints.statistics(selectedSurveyId));

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
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
              fill: true,
            },
          ],
        };
        setChartData(data);
        setChartValues({
          'Vệ sinh': response.data.maximum_cleanliness,
          'Cơ sở vật chất': response.data.maximum_facilities,
          'Dịch vụ': response.data.maximum_services,
        });
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
      setChartValues({});
    }
  };

  return (
    <>
      <CustomNavbar />
      <div className="statistics-chart-container">
        <div className="form-container">
          <h1 className="title-bctk text-primary">Thống Kê Khảo Sát</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchStatistics();
            }}
          >
            <label htmlFor="survey_id">Chọn khảo sát:</label>
            <select className="input-list"
              id="survey_id"
              name="survey_id"
              value={selectedSurveyId}
              onChange={(e) => setSelectedSurveyId(e.target.value)}
              required
            >
              <option value="" disabled>-- Chọn khảo sát --</option>
              {surveys.map((survey) => (
                <option key={survey.id} value={survey.id}>
                  {survey.title}
                </option>
              ))}
            </select>
            <Button variant="primary" type="submit">Xem</Button>
          </form>
          {showAlert && (
            <Alert variant={error ? 'danger' : 'success'} style={{ width: '100%', margin: '25px 0' }}>
              {alertMessage}
            </Alert>
          )}
        </div>
        <div className="chart">
          {chartData && (
            <>
              <Line
                data={chartData}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: 'Tỷ lệ (%)',
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: 'Các tiêu chí',
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Thống kê khảo sát',
                    },
                    tooltip: {
                      callbacks: {
                        label: (tooltipItem) => {
                          const label = tooltipItem.label || '';
                          const value = tooltipItem.raw || '';
                          let description = '';

                          switch (label) {
                            case 'Vệ sinh':
                              description = 'Mức độ sạch sẽ của các khu vực.';
                              break;
                            case 'Cơ sở vật chất':
                              description = 'Chất lượng cơ sở vật chất như phòng học, bàn ghế.';
                              break;
                            case 'Dịch vụ':
                              description = 'Chất lượng dịch vụ cung cấp, như hỗ trợ sinh viên.';
                              break;
                            default:
                              description = '';
                          }

                          return `${label}: ${value}% - ${description}`;
                        },
                      },
                    },
                  },
                }}
              />
              <div className="chart-data-summary">
                <h2>SỐ LIỆU KHẢO SÁT</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Tiêu chí</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(chartValues).map(([key, value]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{value}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default StatisticsChart;
