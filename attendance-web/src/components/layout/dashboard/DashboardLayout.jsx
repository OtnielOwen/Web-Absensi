import { useEffect, useState } from 'react';
import { Layout, Row, Col, Button, Drawer, Grid } from 'antd';
import { TbLogout } from 'react-icons/tb';
import { Outlet } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { useIsAuthorized, useLogout } from '@/utilities/authorization';
import { MenuOutlined } from '@ant-design/icons';
import MainSiderContent from './MainSiderContent';

const { Header, Sider, Content } = Layout;

const MainSider = styled(Sider)`
  overflow: auto;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 2;
  scrollbar-width: none;
  background: var(--ant-color-white) !important;

  .ant-layout-sider-trigger {
    background: var(--ant-color-white) !important;
  }

  &::-webkit-scrollbar {
    display: none;
  }
`;

const MainLayoutContent = styled(Layout)`
  height: calc(100vh - 16px * 2);
  transition: all 0.2s ease-in-out;
  width: 100%;
  z-index: 1;
  overflow: hidden;
  background: var(--ant-layout-body-bg);
  border-radius: 16px;
  margin-left: 18px;
  margin-bottom: 16px;
  margin-top: 16px;
  margin-right: 16px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);

  ${({ mdDown }) =>
    mdDown &&
    css`
      margin: 0px;
      height: 100vh;
      border-radius: 0px;
    `}

  .ant-layout {
    &-sider {
      box-shadow: 0px 5px 8px rgb(0 0 0 / 5%);
      background: var(--ant-color-white) !important;
    }

    &-header {
      background: var(--ant-color-white);
    }

    &-content {
      background: #f9f9f9;
      padding: 24px 16px 0;
      overflow: auto;
      position: relative;
    }

    &-header {
      padding: 0 8px;
      position: sticky;
      top: 0px;
      box-shadow: 4px 4px 40px 0 rgb(0 0 0 / 5%);
      z-index: 10;
    }
  }
`;

function DashboardLayout() {
  useIsAuthorized(['dashboard', 'admin-dashboard']);

  const logout = useLogout();
  const { md, lg } = Grid.useBreakpoint();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (!lg && !isCollapsed) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [lg]);

  const onTriggerClick = () => {
    if (md) {
      setIsCollapsed(!isCollapsed);
      return;
    }

    setIsDrawerOpen(true);
  };

  const _SiderContent = (
    <MainSiderContent isCollapsed={isCollapsed} setIsDrawerOpen={setIsDrawerOpen} />
  );

  return (
    <Layout hasSider style={{ background: '#f4f4f4' }}>
      {md ? (
        <MainSider
          collapsed={isCollapsed}
          collapsible
          trigger={
            <Button
              type="text"
              style={{
                display: 'flex',
                width: '100%',
                marginTop: 16,
                justifyContent: 'center',
              }}
              icon={<TbLogout style={{ fontSize: 22 }} />}
              onClick={logout}
            >
              {!isCollapsed && 'Logout'}
            </Button>
          }
          theme="light"
        >
          {_SiderContent}
        </MainSider>
      ) : (
        <Drawer
          className="MainDrawer"
          placement="left"
          visible={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        >
          {_SiderContent}
        </Drawer>
      )}
      <MainLayoutContent mdDown={!md}>
        <Header>
          <Row justify="space-between" align="middle">
            <Col>
              <Button type="text" icon={<MenuOutlined />} onClick={onTriggerClick} />
            </Col>
          </Row>
        </Header>
        <Content>
          <Outlet />
        </Content>
      </MainLayoutContent>
    </Layout>
  );
}

export default DashboardLayout;
