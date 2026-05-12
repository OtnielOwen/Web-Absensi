import { useState } from 'react';
import { Col, Row, Space, Button, Grid, Drawer, Dropdown, Layout } from 'antd';

import { BiLogIn } from 'react-icons/bi';
import { IoNotificationsOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { MenuOutlined } from '@ant-design/icons';
import BrandLogo from './BrandLogo';
import Container from './Container';

const HeaderStyled = styled(Layout.Header)`
  padding: 0;
  z-index: 10;
  top: 0;
  position: sticky !important;
  box-shadow: var(--ant-box-shadow) !important;

  .ant-typography {
    color: var(--ant-color-bg-base);
    margin: auto 0;
  }
  .ant-typography-secondary {
    font-size: 14px;
    font-style: normal;
    font-weight: 300;
  }
`;

const AuthButtonStyled = styled(Button)`
  background: var(--ant-gold);
  color: var(--ant-color-bg-base);
  border: var(--ant-color-bg-base);
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  text-align: center;
  line-height: normal;
  display: flex;

  &:focus,
  &:hover {
    background: var(--ant-orange-1) !important;
    border-color: var(--ant-gold) !important;
    color: var(--ant-gold) !important;
  }
`;

function Header() {
  const { lg, sm } = Grid.useBreakpoint();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const renderButtonLogin = () => (
    <AuthButtonStyled onClick={() => navigate('/login')}>
      <Space align="center" size="small">
        <BiLogIn
          style={{
            display: 'flex',
            fontSize: 18,
          }}
        />
        Masuk
      </Space>
    </AuthButtonStyled>
  );

  return (
    <HeaderStyled>
      <Container>
        {!lg ? (
          <Row align="middle" justify="space-between">
            <Col>
              <BrandLogo />
            </Col>
            <Col>
              <Row justify="space-between" align="middle">
                <Dropdown
                  placement="bottomRight"
                  arrow={{
                    pointAtCenter: true,
                  }}
                  trigger={['click']}
                  // menu={{
                  //   items,
                  // }}
                >
                  <Button shape="circle" type="text">
                    <IoNotificationsOutline
                      style={{
                        fontSize: 22,
                      }}
                    />
                  </Button>
                </Dropdown>
                <Button type="text" shape="circle" onClick={showDrawer}>
                  <MenuOutlined style={{ fontSize: 20 }} />
                </Button>
                <Drawer
                  placement="right"
                  onClose={onClose}
                  width={sm ? '500px' : '100%'}
                  open={open}
                  extra={renderButtonLogin()}
                >
                  {/* <Menu
                    mode="inline"
                    items={menus}
                    style={{
                      justifyContent: 'center',
                    }}
                  /> */}
                </Drawer>
              </Row>
            </Col>
          </Row>
        ) : (
          <Row wrap={false} gutter={16}>
            <Col flex="none">
              <BrandLogo />
            </Col>
            <Col flex="auto">
              <Row align="middle" gutter={16} justify="space-between">
                <Col flex="auto">
                  {/* <Menu
                    mode="horizontal"
                    items={menus}
                    style={{
                      justifyContent: 'center',
                    }}
                  /> */}
                </Col>
                <Col flex="none">
                  <Row justify="space-between" align="middle" style={{ gap: 16 }}>
                    {renderButtonLogin()}
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        )}
      </Container>
    </HeaderStyled>
  );
}

export default Header;
