import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { authApi, endpoints } from '../../configs/API';
import CustomNavbar from '../../components/Navbar/Navbar';
import './OrderInfo.css';

const OrderInfo = () => {
  const api = authApi();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);

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
  }, [api, orderId]);

  const confirmOrder = async () => {
    setIsConfirming(true);
    try {
      const response = await api.post(endpoints.confirmOrder(orderId));
      setOrder(response.data);
      alert('Order confirmed successfully!');
    } catch (error) {
      console.error('Error confirming order:', error.response?.data || error.message);
      alert('Failed to confirm order.');
    }
    setIsConfirming(false);
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
      <div className="order-info">
        <h2>THÔNG TIN ĐƠN HÀNG</h2>
        <p><strong>Số đơn hàng:</strong> {order.id}</p>
        <p><strong>Total Price:</strong> {order.total_amount} VNĐ</p>
        <ul>
          {order.order_products.map((product) => (
            <li key={product.id}>
              <p><strong>{product.product.name}</strong> x {product.quantity} - {product.price} VNĐ</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="order-info">
        <h2>THÔNG TIN NGƯỜI NHẬN HÀNG</h2>
        <p><strong>Họ người nhận:</strong> {order.first_name}</p>
        <p><strong>Tên người nhận:</strong> {order.last_name}</p>
        <p><strong>Email:</strong> {order.email}</p>
        <p><strong>Số điện thoại:</strong> {order.phone}</p>
      </div>

      {order.status === 'ĐANG CHỜ' && (
        <div className="confirm-order">
          <button onClick={confirmOrder} disabled={isConfirming}>
            {isConfirming ? 'Confirming...' : 'Xác nhận đặt hàng'}
          </button>
        </div>
      )}
    </>
  );
};

export default OrderInfo;