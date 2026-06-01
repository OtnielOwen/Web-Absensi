import { Row, Col, Form, Button, Space, Typography, Input } from 'antd';
import { Link } from 'react-router-dom';
import { useLogin } from '@/utilities/authorization';
import { FORM } from '@/utilities/constant';

const { Title, Text } = Typography;

function LoginPage() {
  const { submitLogin, isLoginLoading } = useLogin();

  const onFinish = (values) => {
    submitLogin(values);
  };
  return (
    <>
      <Space direction="vertical" size="middle">
        <Title style={{ margin: 'auto' }} level={2}>
          Masuk ke Akun Anda
        </Title>
        <Text>Masukkan Email dan Password Anda</Text>
      </Space>

      <Form
        layout="vertical"
        style={{ marginTop: 16 }}
        onFinish={onFinish}
        validateMessages={FORM.VALIDATE_MESSAGE}
      >
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input size="large" placeholder="Masukan email" />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input.Password size="large" placeholder="Masukan password" />
        </Form.Item>

        <Form.Item>
          <Button
            loading={isLoginLoading}
            type="primary"
            htmlType="submit"
            size="large"
            style={{
              width: '100%',
            }}
          >
            Masuk
          </Button>
        </Form.Item>
      </Form>
      <Row justify="space-between" align="middle">
        {
          // <Col>
          //   <Text>
          //     Belum punya akun?
          //     <Link to="/register" style={{ color: 'var(--ant-color-primary)' }}>
          //       {' '}
          //       Daftar
          //     </Link>
          //   </Text>
          // </Col>
        }
        <Col>
          <Link to="/register" style={{ color: 'var(--ant-color-primary)' }}>
            {' '}
            Daftar Akun
          </Link>
        </Col>
      </Row>
    </>
  );
}

export default LoginPage;
