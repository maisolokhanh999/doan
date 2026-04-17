import { Navigate } from 'react-router-dom';
import { message } from 'antd';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');
  let user = null;
  
  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (e) {
      console.error(e);
    }
  }

  // Not logged in
  if (!token || !user) {
    message.warning('Vui lòng đăng nhập để truy cập trang này!');
    return <Navigate to="/Login" replace />;
  }

  // Require Admin role
  if (requireAdmin && user.user !== 'admin') {
    message.error('Bạn không có quyền truy cập trang quản trị!');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
