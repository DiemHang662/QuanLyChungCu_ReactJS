import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, FormControl, Pagination, Modal } from 'react-bootstrap';
import { authApi, endpoints } from '../../configs/API';
import CustomNavbar from '../../components/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import './CartSummary.css';

const CartSummary = () => {
  const api = authApi();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loadingItem, setLoadingItem] = useState(null);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await api.get(`${endpoints.cartSummary}?page=${currentPage}`);
        const cartProducts = response.data.cart_products || [];
        const totalPrice = response.data.total_price || 0;
        setCartItems(cartProducts);
        setTotalPrice(totalPrice);
        setTotalPages(response.data.total_pages || 1);
      } catch (error) {
        console.error('Error fetching cart items:', error.response?.data || error.message);
      }
    };

    fetchCartItems();
  }, [api, currentPage]);

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await api.post(endpoints.updateProductQuantity, {
        product_id: productId,
        quantity
      });
      const cartProducts = response.data.cart_products || [];
      const totalPrice = response.data.total_price || 0;
      setCartItems(cartProducts);
      setTotalPrice(totalPrice);
    } catch (error) {
      console.error('Error updating item quantity:', error.response?.data || error.message);
      alert('Lỗi khi cập nhật số lượng sản phẩm');
    }
  };

  const deleteFromCart = async (cartProductId) => {
    try {
      await api.delete(endpoints.deleteProduct(cartProductId));
      const newCartItems = cartItems.filter(item => item.id !== cartProductId);
      const newTotalPrice = newCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      setCartItems(newCartItems);
      setTotalPrice(newTotalPrice);
      setAlertMessage('Xóa sản phẩm thành công');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Error deleting item from cart:', error.response?.data || error.message);
      alert('Lỗi khi xóa sản phẩm khỏi giỏ hàng');
    }
  };

  const handlePurchase = async (item) => {
    try {
      const response = await api.post(endpoints.createOrderFromCart);
      const orderId = response.data.id; // Assuming the response contains the order ID
  
      navigate(`/order-info/${orderId}`);
    } catch (error) {
      console.error('Error creating order:', error.response?.data || error.message);
      alert('Lỗi khi tạo đơn hàng. Vui lòng thử lại sau!');
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item 
          key={number} 
          active={number === currentPage} 
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>,
      );
    }
    return <Pagination>{items}</Pagination>;
  };

  return (
    <>
      <CustomNavbar />
      <div className="content">
        <div className="cart-summary">
          <h2 className="text-primary">GIỎ HÀNG CỦA BẠN</h2>

          {showAlert && (
            <Alert variant="success" style={{ width: '100%', margin: '7px 80px' }}>
              {alertMessage}
            </Alert>
          )}

          <Table hover className="table">
            <thead>
              <tr>
                <th className="head">Hình ảnh</th>
                <th className="head">Tên sản phẩm</th>
                <th className="head">Số lượng</th>
                <th className="head">Giá</th>
                <th className="head"></th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map(item => (
                <tr key={item.id}>
                  <td><img src={item.product.image_url} alt={item.product.name} className="image" /></td>
                  <td className="name">{item.product.name}</td>
                  <td className="quantity">
                    <FormControl
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value))}
                      min="1"
                    />
                  </td>
                  <td className="price">{item.product.price * item.quantity} VNĐ</td>
                  <td>
                    <div className="bt">
                      <Button variant="success" onClick={() => handlePurchase(item)} >Mua ngay</Button>
                      <Button variant="danger" onClick={() => deleteFromCart(item.id)}>X</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div className="total-price">
            <h3>Tổng giá: {totalPrice} VNĐ</h3>
          </div>

          <div className="pagination">
            {renderPagination()}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartSummary;