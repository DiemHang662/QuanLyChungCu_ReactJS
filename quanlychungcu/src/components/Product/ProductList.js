import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Alert, Pagination } from 'react-bootstrap';
import { authApi, endpoints } from '../../configs/API';
import CustomNavbar from '../../components/Navbar/Navbar';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import './ProductList.css';

const ProductList = () => {
  const api = authApi();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false); 
  const [alertMessage, setAlertMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(`${endpoints.product}?page=${currentPage}&page_size=12`);
        setProducts(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 12));
      } catch (error) {
        console.error('Error fetching products:', error.response?.data || error.message);
      }
    };

    const fetchCartItemCount = async () => {
      try {
        const response = await api.get(endpoints.cartSummary);
        const totalItems = response.data.cart_products.reduce((acc, item) => acc + item.quantity, 0);
        setCartItemCount(totalItems);
      } catch (error) {
        console.error('Error fetching cart item count:', error.response?.data || error.message);
      }
    };

    fetchProducts();
    fetchCartItemCount();
  }, [api, currentPage]);

  const addToCart = async (productId) => {
    try {
      await api.post(endpoints.addProduct, {
        product_id: productId,
        quantity: 1
      });
      setCartItemCount(cartItemCount + 1);
      setAlertMessage('Đã thêm sản phẩm vào giỏ hàng');
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Xảy ra lỗi khi thêm vào giỏ hàng:', error.response?.data || error.message);
      alert('Lỗi thêm vào giỏ hàng');
    }
  };

  const navigateToCart = () => {
    navigate('/cart-summary');
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
    return totalPages > 1 ? <Pagination>{items}</Pagination> : null;
  };

  return (
    <>
      <CustomNavbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="content">
        <div className="cart" onClick={navigateToCart}>
          <span className="cart-item-count">{cartItemCount}</span>
          <AddShoppingCartIcon />
        </div>

        {showAlert && (
          <Alert variant="success" style={{ width: '100%', margin: '7px 80px' }}>
            {alertMessage}
          </Alert>
        )}

        <div className="product-list">
          <Row>
            {products.map(product => (
              <Col key={product.id} sm={5} md={4} lg={3} className="product-card-col">
                <Card className="product-card">
                  <Card.Img variant="top" src={product.image_url} className="product-image" />
                  <Card.Body>
                    <Card.Title className="product-name">{product.name}</Card.Title>
                    <Card.Text className="product-price">Giá: {product.price} VNĐ</Card.Text>
                    <Button variant="danger" className="add-to-cart-btn text-primary" onClick={() => addToCart(product.id)}>
                      <AddShoppingCartIcon /> Thêm vào giỏ
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="pagination">
            {renderPagination()}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductList;