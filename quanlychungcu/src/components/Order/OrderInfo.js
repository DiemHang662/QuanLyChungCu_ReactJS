import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authApi, endpoints } from '../../configs/API';
import CustomNavbar from '../../components/Navbar/Navbar';
import { Modal, Button, Image } from 'react-bootstrap';
import axios from 'axios'; // Import axios
import CryptoJS from 'crypto-js'; // Import CryptoJS
import './OrderInfo.css';

const OrderInfo = () => {
  const api = authApi();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await api.get(endpoints.orderDetail(orderId));
        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error.response?.data || error.message);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  const confirmOrder = () => {
    setShowPaymentModal(true);
  };

  const handleCloseModal = () => {
    setShowPaymentModal(false);
  };

  const handleThanhToanMomo = async (item) => {
    try {
      const api = await authApi();
      const requestBody = createMomoRequestBody(item);

      console.log('Request Body:', JSON.stringify(requestBody));

      const response = await axios.post('/v2/gateway/api/create', requestBody, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('Momo payment response:', response.data);
      handlePaymentResponse(response.data, item, api);
    } catch (error) {
      console.error('Error during Momo payment request:', error.response?.data || error.message);
      window.alert('Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại sau!');
    }
  };

  const createMomoRequestBody = (item) => {
    const partnerCode = "MOMO";
    const accessKey = "F8BBA842ECF85";
    const secretKey = "K951B6PE1waDMi640xX08PD3vg6EkVlz";
    const requestId = `${partnerCode}${Date.now()}`;
    const orderId = `MM${Date.now()}`;
    const orderInfo = "Thanh toán hóa đơn";
    const redirectUrl = "https://momo.vn/return";
    const ipnUrl = "https://callback.url/notify";
    const amount = item.total_amount;
    const requestType = "payWithATM";
    const extraData = "";

    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
    const signature = CryptoJS.HmacSHA256(rawSignature, secretKey).toString(CryptoJS.enc.Hex);

    return {
      partnerCode,
      accessKey,
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType,
      signature,
      lang: "vi"
    };
  };

  const handlePaymentResponse = (data, item, api) => {
    console.log('Payment response:', data);
    if (data && data.payUrl) {
      window.location.href = data.payUrl;
    } else {
      window.alert('Payment failed. Please try again.');
    }
  };

  const handleThanhToanTienMat = async () => {
    alert('Đặt hàng thành công qua tiền mặt!');
    navigate('/product');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!order) {
    return <div>Order not found</div>;
  }

  return (
    <>
      <CustomNavbar />
      <div className="order-info-container">
        <div className="order-info">
          <h2>THÔNG TIN ĐƠN HÀNG</h2>
          <p><strong>Mã đơn hàng:</strong> {order.id}</p>
          <ul>
            {order.order_products.map((product) => (
              <li key={product.id}>
                <p><strong>Tên sản phẩm: </strong>{product.product.name}</p>
                <p><strong>Số lượng: </strong>{product.quantity}</p>

                {product.product.image_url && (
                  <Image src={product.product.image_url} alt={product.product.name} thumbnail className="product-image" />
                )}
              </li>
            ))}
          </ul>

          <p><strong>Tổng số tiền:</strong> {order.total_amount} VNĐ</p>
        </div>

        <div className="order-info">
          <h2>THÔNG TIN NGƯỜI NHẬN HÀNG</h2>
          <p><strong>Họ người nhận:</strong> {order.first_name}</p>
          <p><strong>Tên người nhận:</strong> {order.last_name}</p>
          <p><strong>Email:</strong> {order.email}</p>
          <p><strong>Số điện thoại:</strong> {order.phone}</p>
          {order.status === 'ĐANG CHỜ' && (
            <div className="confirm-order">
              <Button onClick={confirmOrder}>
                Xác nhận đặt hàng
              </Button>
            </div>
          )}
        </div>
      </div>



      <Modal show={showPaymentModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Chọn phương thức thanh toán</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Button className="payment-button momo" onClick={() => handleThanhToanMomo(order)}>
            <img src="/momo.png" alt="Momo" />
            Thanh toán qua MOMO
          </Button>
          <Button className="payment-button money" onClick={handleThanhToanTienMat}>
            <img src="/tienmat.png" alt="Tienmat" />
            Thanh toán bằng tiền mặt
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default OrderInfo;
