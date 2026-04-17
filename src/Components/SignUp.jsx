import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useUsers } from './data';
const SignUp = () => {
  const navigate = useNavigate();
  const { users, setUsers } = useUsers();

  const onFinish = (values) => {
    // kiểm tra trùng username
    const exist = users.find(u => u.user === values.username);

    if (exist) {
      message.error('Username already exists!');
      return;
    }

    // tạo user mới
    const newUser = {
      user: values.username,
      password: values.password,
      name: values.name,
    };

    // cập nhật users
    setUsers([...users, newUser]);
    message.success('Register successful!');
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)]"> <Form
      name="signup"
      style={{ maxWidth: 360 }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: 'Please input your Username!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Username" />
      </Form.Item>

      <Form.Item
        name="name"
        rules={[{ required: true, message: 'Please input your Name!' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="Full Name" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit">
          Sign Up
        </Button>
        <div className="mt-2 text-center">
          <span>Already have an account? </span>
          <NavLink to="/login">Login now!</NavLink>
        </div>
      </Form.Item>
    </Form></div>
  );
};

export default SignUp;