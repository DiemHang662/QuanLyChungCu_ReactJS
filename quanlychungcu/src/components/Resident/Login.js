import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, InputGroup, FormControl } from 'react-bootstrap';
import API, { setAuthToken, endpoints } from '../../configs/API';
import { MyDispatchContext } from '../../configs/Contexts';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [userType, setUserType] = useState('regular');
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useContext(MyDispatchContext);

  const login = async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('client_id', 'DRxRUkK1fMHc8t2tPCO09EELjxzXxpPIF52Xsj4x');
      formData.append('client_secret', '0feNENqjTRAXzSNdcTeOPphN0OHgQLSMBoOd8SN7ZTeoC6gc9zNrMEvqPIkUXwAFkLJ9Vy7EEGmtw0dn5y7OrmwtSFhnh108VIxXS192FndCjc7sV4LoEcfIEmGgTenB');
      formData.append('grant_type', 'password');

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      };
      const res = await API.post(endpoints.login, formData, config);

      const token = res.data.access_token;
      setAuthToken(token);

      let user = await API.get(endpoints.currentUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch({
        type: 'login',
        payload: user.data,
      });

      if (user.data.is_superuser !== (userType === 'superuser')) {
        setError('Đăng nhập không thành công');
        return;
      }

      navigate('/');
    } catch (ex) {
      setError('Vui lòng nhập lại username hoặc password');
    }
  };

  return (
    <div className="login-container">
      <div className="formContainer1">
        <div className="left-side1"></div>
        <div className="right-side1">
          <h1 className="text-primary">ĐĂNG NHẬP NGƯỜI DÙNG</h1>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group>
              <Form.Label>Bạn là: </Form.Label>
              <Form.Control
                as="select"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className={`input ${isFocused ? 'focused' : ''}`}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              >
                <option value="regular">Cư dân</option>
                <option value="superuser">Quản trị viên</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Tên tài khoản</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nhập tên tài khoản"
                className="input"
                autoComplete="username"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mật khẩu</Form.Label>
              <InputGroup>
                <FormControl
                  type={secureTextEntry ? 'password' : 'text'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                />
                <InputGroup.Text className="icon">
                  <Button
                    variant="link"
                    onClick={() => setSecureTextEntry(!secureTextEntry)}
                  >
                    {secureTextEntry ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </Button>
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
            {error && (
              <Alert variant="danger" className="alert">
                {error}
              </Alert>
            )}
            <Button className="submit1" onClick={login} type="submit" variant="primary">
              ĐĂNG NHẬP
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
