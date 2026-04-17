
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Flex, Form, Input, message } from 'antd';
import { useNavigate, NavLink } from 'react-router-dom';
import { useUsers } from './data';

const Login = () => {
  const navigate = useNavigate();
  const { users } = useUsers();

  const onFinish = (values) => {
    const foundUser = users.find(u => u.user === values.username && u.password === values.password);
    if (foundUser) {
      localStorage.setItem('token', 'logged-in');
      localStorage.setItem('user', JSON.stringify(foundUser));
      message.success('Login successful!');
      if (foundUser.user === 'admin') {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      message.error('Invalid username or password!');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
      <Form className='fex items-center justify-center'
      name="login"
      initialValues={{ remember: true }}
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
        name="password"
        rules={[{ required: true, message: 'Please input your Password!' }]}
      >
        <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
      </Form.Item>
      <Form.Item>
        <Flex justify="space-between" align="center">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>
          <a href="#" onClick={(e) => e.preventDefault()}>Forgot password</a>
        </Flex>
      </Form.Item>

      <Form.Item>
        <Button block type="primary" htmlType="submit">
          Log in
        </Button>
        <NavLink to="/SignUp">Register now!</NavLink>
      </Form.Item>
    </Form>
    </div>
   
  );
};

export default Login;