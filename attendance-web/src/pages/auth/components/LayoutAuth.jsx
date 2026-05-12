import { Row, Col, Image, Grid } from 'antd';
import { Outlet } from 'react-router-dom';
import BackgroundAuth from '@/assets/images/svn-login.png';
import Container from '@/components/layout/Container';

function LayoutAuth() {
  const { lg } = Grid.useBreakpoint();

  return (
    <section style={{ padding: '48px 0' }}>
      <Container>
        <Row justify="center" align="middle" gutter={[64, 24]}>
          {lg && (
            <Col lg={13}>
              <Image
                preview={false}
                src={BackgroundAuth}
                width="100%"
                style={{ borderRadius: 16 }}
              />
            </Col>
          )}
          <Col lg={11}>
            <Outlet />
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default LayoutAuth;
