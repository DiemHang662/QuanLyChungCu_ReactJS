import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Carousel } from 'react-bootstrap';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { authApi, endpoints } from '../../configs/API';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import "./Home.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Home = () => {
  const api = authApi();
  const [searchTerm, setSearchTerm] = useState('');
  const [staffChartData, setStaffChartData] = useState({
    labels: [],
    datasets: []
  });
  const [billChartData, setBillChartData] = useState({
    labels: [],
    datasets: []
  });
  const [flatChartData, setFlatChartData] = useState({
    labels: [],
    datasets: []
  });
  const [staffCount, setStaffCount] = useState(0);
  const [billCount, setBillCount] = useState(0);
  const [flatCount, setFlatCount] = useState(0);

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

        if (staff_count !== undefined) {
          setStaffChartData({
            labels: ['Cư dân'],
            datasets: [
              {
                label: 'Cư dân',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                hoverBackgroundColor: 'rgb(255, 99, 132)',
                data: [staff_count],
                datalabels: {
                  display: true,
                  color: '#000',
                  formatter: (value) => `${value}`,
                },
              },
            ],
          });
        } else {
          console.warn("staff_count is undefined or null");
        }
      } catch (error) {
        console.error("There was an error fetching the staff count!", error);
      }
    };

    fetchStaffCount();
  }, []);

  useEffect(() => {
    const fetchBillCount = async () => {
      try {
        const response = await api.get(endpoints.totalBills);
        const { total_bills } = response.data;
        console.log('Fetched total_bills:', total_bills); // Kiểm tra giá trị của total_bills
        setBillCount(total_bills);

        if (total_bills !== undefined) {
          setBillChartData({
            labels: ['Hóa đơn'],
            datasets: [
              {
                label: 'Hóa đơn',
                backgroundColor: 'rgb(54, 162, 235)',
                borderColor: 'rgb(54, 162, 235)',
                hoverBackgroundColor: 'rgb(54, 162, 235)',
                data: [total_bills],
                datalabels: {
                  display: true,
                  color: '#000',
                  formatter: (value) => `${value}`,
                },
              },
            ],
          });
        } else {
          console.warn("total_bills is undefined or null");
        }
      } catch (error) {
        console.error("There was an error fetching the bill count!", error);
      }
    };

    fetchBillCount();
  }, []);

  useEffect(() => {
    const fetchFlatCount = async () => {
      try {
        const response = await api.get(endpoints.flatCount);
        const { flat_count } = response.data;
        setFlatCount(flat_count);

        if (flat_count !== undefined) {
          setFlatChartData({
            labels: ['Căn hộ'],
            datasets: [
              {
                label: 'Căn hộ',
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgb(75, 192, 192)',
                hoverBackgroundColor: 'rgb(75, 192, 192)',
                data: [flat_count],
                datalabels: {
                  display: true,
                  color: '#000',
                  formatter: (value) => `${value}`,
                },
              },
            ],
          });
        } else {
          console.warn("flat_count is undefined or null");
        }
      } catch (error) {
        console.error("There was an error fetching the flat count!", error);
      }
    };

    fetchFlatCount();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Cư dân',
        font: {
          size: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Cư dân: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    layout: {
      padding: {
        top: 20,
      },
    },
  };

  const chartOptions1 = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Hóa đơn',
        font: {
          size: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Hóa đơn: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    layout: {
      padding: {
        top: 20,
      },
    },
  };

  const chartOptions2 = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Căn hộ',
        font: {
          size: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Căn hộ: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    layout: {
      padding: {
        top: 20,
      },
    },
  };

  return (
    <>
      <div className="container-home">
        <Carousel>
          {images.map((image, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block img-carousel"
                src={image}
                alt={`slide-${index}`}
              />
              <Carousel.Caption>
                {/* Optional content here */}
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        <h1 className="h1">TỔNG QUAN</h1>
        <div className="chart-container">

          <div className="chart">
            <Bar
              data={staffChartData}
              options={chartOptions}
            />
          </div>
          <div className="chart">
            <Bar
              data={billChartData}
              options={chartOptions1}
            />
          </div>
          <div className="chart">
            <Bar
              data={flatChartData}
              options={chartOptions2}
            />
          </div>
        </div>

        <div>
          <h1 className="h1">GIỚI THIỆU</h1>

          <div className="intro">
            <p className="textIntro">GOLDEN SEA xin gửi đến quý khách hàng lời chúc tốt đẹp nhất & lời cảm ơn quý khách đã quan tâm đến chung cư chúng tôi</p>
            <img src="https://xaydungnhatrongoi.vn/wp-content/uploads/2023/09/1-9.jpg" alt="intro" className="imageIntro" />
          </div>

          <h2 className="h2">VỊ TRÍ</h2>

          <div className="intro">
            <img src="https://cdn.thuonggiaonline.vn/images/49818fc0b29854ada7a86ce3baa82b2d5565d0e91c0d3f7937524baba3a0bc2516c5561115b49e821fe60e1e9fd4da5fd9e46d32f9f236b49f6331d2f1a74444f15afbde6ad391c5cbf439691d85a422d7718ae6695b0d536512dc2ea49eb090/a-tb-mzk-mot-du-an-bds-vua-tui-7286-3108-1685074964-9279.jpg" alt="location" className="imageIntro" />
            <p className="textIntro">Đường Đào Trí, Phú Thuận, Q7, TP.HCM. Nằm kế cạnh khu đô thị Peninsula được đầu tư 6 tỷ USD</p>
          </div>
        </div>

        <h3 className="h3">HÌNH ẢNH THỰC TẾ</h3>

        <div className="content">
          <div className="list1">
            <div className="imageContainer">
              <img src="https://xaydungnhatrongoi.vn/wp-content/uploads/2023/09/1-9.jpg" alt="phong-khach" className="image" />
              <img src="https://sbshouse.vn/wp-content/uploads/2023/10/phong-khach-chung-cu-hien-dai.jpg" alt="phong-khach2" className="image" />
              <img src="https://toquoc.mediacdn.vn/280518851207290880/2022/10/10/image001-16653869111531095951154.jpg" alt="phong-khach3" className="image" />
              <img src="https://noithatnhaviet.org/upload/img/thi%E1%BA%BFt_k%E1%BA%BF_n%E1%BB%99i_th%E1%BA%A5t_chung_c%C6%B0_An_B%C3%ACnh_city-10.jpg" className="image" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Home;