import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const images = [
    'https://xaydungnhatrongoi.vn/wp-content/uploads/2023/09/1-9.jpg',
    'https://sbshouse.vn/wp-content/uploads/2023/10/phong-khach-chung-cu-hien-dai.jpg',
    'https://toquoc.mediacdn.vn/280518851207290880/2022/10/10/image001-16653869111531095951154.jpg',
  ];

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