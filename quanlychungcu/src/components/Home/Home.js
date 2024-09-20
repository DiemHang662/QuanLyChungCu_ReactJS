import React, { useState, useEffect } from 'react';
import { Carousel, Row, Col } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ReceiptIcon from '@mui/icons-material/Receipt';
import GroupIcon from '@mui/icons-material/Group';
import ApartmentIcon from '@mui/icons-material/Apartment';
import EditNoteIcon from '@mui/icons-material/EditNote';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { authApi, endpoints } from '../../configs/API';
import './Home.css';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const Home = () => {
  const api = authApi();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [staffCount, setStaffCount] = useState(0);
  const [billCount, setBillCount] = useState(0);
  const [flatCount, setFlatCount] = useState(0);
  const [surveyCount, setSurveyCount] = useState(0);
  const [billStats, setBillStats] = useState({ paid: 0, unpaid: 0 });
  const [residentStats, setResidentStats] = useState({ residents: 0, admins: 0 });

  const images = [
    'https://xaydungnhatrongoi.vn/wp-content/uploads/2023/09/1-9.jpg',
    'https://sbshouse.vn/wp-content/uploads/2023/10/phong-khach-chung-cu-hien-dai.jpg',
    'https://toquoc.mediacdn.vn/280518851207290880/2022/10/10/image001-16653869111531095951154.jpg',
  ];

  useEffect(() => {
    const fetchStaffCount = async () => {
      try {
        const response = await api.get(endpoints.staffCount);
        const { staff_count } = response.data;
        setStaffCount(staff_count);
      } catch (error) {
        console.error('There was an error fetching the staff count!', error);
      }
    };

    const fetchBillCount = async () => {
      try {
        const response = await api.get(endpoints.totalBills);
        const { total_bills } = response.data;
        setBillCount(total_bills);
      } catch (error) {
        console.error('There was an error fetching the bill count!', error);
      }
    };

    const fetchFlatCount = async () => {
      try {
        const response = await api.get(endpoints.flatCount);
        const { flat_count } = response.data;
        setFlatCount(flat_count);
      } catch (error) {
        console.error('There was an error fetching the flat count!', error);
      }
    };

    const fetchSurveyCount = async () => {
      try {
        const response = await api.get(endpoints.surveyCount);
        const { survey_count } = response.data;
        setSurveyCount(survey_count);
      } catch (error) {
        console.error('There was an error fetching the survey count!', error);
      }
    };

    fetchSurveyCount();
    fetchStaffCount();
    fetchBillCount();
    fetchFlatCount();
  }, []);

  useEffect(() => {
    const fetchBillStatistics = async () => {
      try {
        const response = await api.get(endpoints.billStatistics);
        const { paid_bills, unpaid_bills } = response.data;
        setBillStats({ paid: paid_bills, unpaid: unpaid_bills });
      } catch (error) {
        console.error('There was an error fetching the bill statistics!', error);
      }
    };

    fetchBillStatistics();
  }, []);

  useEffect(() => {
    const fetchResidentStats = async () => {
      try {
        const response = await api.get(endpoints.residentStatistics);
        const { staff_count, admin_count } = response.data;
        console.log('Fetched resident statistics:', { staff_count, admin_count }); // Log data
        setResidentStats({ residents: staff_count || 0, admins: admin_count || 0 });
      } catch (error) {
        console.error('There was an error fetching the resident statistics!', error);
      }
    };

    fetchResidentStats();
  }, []);


  // Chart data
  const chartData = {
    labels: ['Cư dân', 'Căn hộ', 'Hóa đơn', 'Khảo sát'],
    datasets: [
      {
        label: 'Thống kê',
        data: [staffCount, flatCount, billCount, surveyCount],
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tổng quan danh mục',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Biểu đồ thống kê số liệu từng danh mục',
        },
      },
      y: {
        title: {
          display: true,
        },
        beginAtZero: true,
      },
    },
  };

  const barChartData = {
    labels: ['Đã thanh toán', 'Chưa thanh toán'],
    datasets: [
      {
        label: 'Số lượng hóa đơn',
        data: [billStats.paid, billStats.unpaid],
        backgroundColor: ['rgba(255, 99, 132, 0.3)', 'rgba(54, 162, 235, 0.3)'],
        borderColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
        },
      },
    },
  };


  // Dữ liệu biểu đồ cho thống kê cư dân
  const residentChartData = {
    labels: ['Cư dân', 'Quản trị viên'],
    datasets: [
      {
        label: 'Số lượng',
        data: [residentStats.residents, residentStats.admins],
        backgroundColor: ['rgba(255, 205, 86, 0.2)', 'rgba(153, 102, 255, 0.3)'],
        borderColor: ['rgb(255, 205, 86)', 'rgb(153, 102, 255)'],
        borderWidth: 1,
      },
    ],
  };

  // Tùy chọn biểu đồ cho thống kê cư dân
  const residentChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
        },
      },
    },
  };


  return (
    <>
      <div className="container-home">
        <Carousel>
          {images.map((image, index) => (
            <Carousel.Item key={index}>
              <img className="d-block img-carousel" src={image} alt={`slide-${index}`} />
              <Carousel.Caption>{/* Optional content here */}</Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>

        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <h1 className="h1">TỔNG QUAN</h1>

        <Row className="card-container">
          <Col md={3}>
            <div className="info-box resident">
              <div className="info-header">
                <div className="title-content">
                  <strong>{staffCount}</strong>
                  <div>Cư dân</div>
                </div>
                <GroupIcon className="icon-title" />
              </div>
              <div className="more-info" onClick={() => { navigate('/resident') }}>
                Chi tiết <ArrowCircleRightIcon />
              </div>
            </div>
          </Col>


          <Col md={3}>
            <div className="info-box flat">
              <div className="info-header">
                <div className="title-content">
                  <strong>{flatCount}</strong>
                  <div>Căn hộ</div>
                </div>
                <ApartmentIcon className="icon-title" />
              </div>
              <div className="more-info">
                Chi tiết <ArrowCircleRightIcon />
              </div>
            </div>
          </Col>

          <Col md={3}>
            <div className="info-box bill" >
              <div className="info-header">
                <div className="title-content">
                  <strong>{billCount}</strong>
                  <div>Hóa đơn</div>
                </div>
                <ReceiptIcon className="icon-title" />
              </div>
              <div className="more-info" onClick={() => { navigate('/bill') }}>
                Chi tiết <ArrowCircleRightIcon />
              </div>
            </div>
          </Col>

          <Col md={3}>
            <div className="info-box survey">
              <div className="info-header">
                <div className="title-content">
                  <strong>{surveyCount}</strong>
                  <div> Khảo sát</div>
                </div>
                <EditNoteIcon className="icon-title" />
              </div>
              <div className="more-info" onClick={() => { navigate('/surveyresult') }}>
                Chi tiết <ArrowCircleRightIcon />
              </div>
            </div>
          </Col>

        </Row>

        <div className="chart">
          <Line data={chartData} options={chartOptions} />
        </div>

        <Row className="bill-statistics">
          <Col md={6}>
            <div className="chartUser">
              <h2>Thống kê số người dùng</h2>
              <Bar data={residentChartData} options={residentChartOptions} />
            </div>
          </Col>
          <Col md={6}>
            <div className="chartBill">
              <h2>Thống kê hóa đơn</h2>
              <Bar data={barChartData} options={barChartOptions} />
            </div>
          </Col>
        </Row>

        <div>
          <h1 className="h1">GIỚI THIỆU</h1>

          <div className="intro">
            <p className="textIntro">
              GOLDEN SEA xin gửi đến quý khách hàng lời chúc tốt đẹp nhất & lời cảm ơn quý khách đã quan tâm đến chung cư chúng tôi
            </p>
            <img src="https://xaydungnhatrongoi.vn/wp-content/uploads/2023/09/1-9.jpg" alt="intro" className="imageIntro" />
          </div>

          <h2 className="h2">VỊ TRÍ</h2>

          <div className="intro">
            <img
              src="https://cdn.thuonggiaonline.vn/images/49818fc0b29854ada7a86ce3baa82b2d5565d0e91c0d3f7937524baba3a0bc2516c5561115b49e821fe60e1e9fd4da5fd9e46d32f9f236b49f6331d2f1a74444f15afbde6ad391c5cbf439691d85a422d7718ae6695b0d536512dc2ea49eb090/a-tb-mzk-mot-du-an-bds-vua-tui-7286-3108-1685074964-9279.jpg"
              alt="location"
              className="imageIntro"
            />
            <p className="textIntro">
              Đường Đào Trí, Phú Thuận, Q7, TP.HCM. Nằm kế cạnh khu đô thị Peninsula được đầu tư 6 tỷ USD
            </p>
          </div>
        </div>

        <h3 className="h3">HÌNH ẢNH THỰC TẾ</h3>

        <div className="content">
          <div className="list1">
            <div className="imageContainer">
              <img src="https://xaydungnhatrongoi.vn/wp-content/uploads/2023/09/1-9.jpg" alt="phong-khach" className="image" />
              <img src="https://sbshouse.vn/wp-content/uploads/2023/10/phong-khach-chung-cu-hien-dai.jpg" alt="phong-khach2" className="image" />
              <img src="https://toquoc.mediacdn.vn/280518851207290880/2022/10/10/image001-16653869111531095951154.jpg" alt="phong-khach3" className="image" />
              <img src="https://noithatnhaviet.org/upload/img/thi%E1%BA%BFt_k%E1%BA%BF_n%E1%BB%99i_th%E1%BA%A5t_chung_c%C6%B0_An_B%C3%ACnh_city-10.jpg" alt="phong-khach4" className="image" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;