import { Button, Card, Col, Grid, Input, Row, Space, Typography } from 'antd';
import Lottie from 'react-lottie';
import { useNavigate } from 'react-router-dom';
import Face from '@/assets/lottie/face.json';
import DefaultLoading from '@/components/DefaultLoading';
import Container from '@/components/layout/Container';
import { ArrowRightOutlined, SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

function HomePage() {
  const navigate = useNavigate();
  const { xl, lg, md, xs } = Grid.useBreakpoint();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Face,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <section style={{ minHeight: '100vh', display: 'grid', alignContent: 'center' }}>
      <div>
        <Container>
          <Row gutter={[16, 16]} align="middle" justify="space-between">
            <Col span={24} lg={10}>
              <Space direction="vertical">
                <Title level={2}>Smart Village Nusantara Absensi Kehadiran</Title>
                <Text>
                  Lakukan absensi kehadiran, Scan wajah atau ambil foto, kemudian semua riwayatmu
                  akan disimpan
                </Text>
                <Button
                  size="large"
                  style={{ margin: '16px 0' }}
                  onClick={() => navigate('/login')}
                >
                  <Space align="center">
                    Mulai Gunakan
                    <ArrowRightOutlined style={{ color: 'var(--ant-color-primary)' }} />
                  </Space>
                </Button>
              </Space>
            </Col>
            <Col span={24} lg={14} style={{ position: 'relative' }}>
              <Lottie options={defaultOptions} height={500} width={500} />
            </Col>
          </Row>
        </Container>
      </div>
    </section>
  );
}

export default HomePage;
