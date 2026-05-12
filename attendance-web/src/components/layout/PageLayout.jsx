import { Suspense } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { getUser } from '@/utilities/authorization';
import useRedirectWhenLoggedIn from '@/utilities/hooks/useRedirectWhenLoggedIn';
import Header from './Header';
import DefaultLoading from '../DefaultLoading';
import FullSpin from '../FullSpin';

const { Content } = Layout;

const LayoutStyled = styled(Layout)`
  > .ant-layout-header,
  .ant-layout-content {
    background-color: #fff;
  }

  .ant-layout-content {
    min-height: 100vh;
  }
`;

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
function PageLayout() {
  const user = getUser();

  const isLoggedIn = useRedirectWhenLoggedIn(user?.isAdmin ? '/admin-dashboard' : '/dashboard');

  return (
    <>
      {isLoggedIn ? (
        <DefaultLoading />
      ) : (
        <LayoutStyled>
          <Header />
          <Content>
            <Suspense fallback={<FullSpin size="large" style={{ minHeight: '80vh' }} />}>
              <Outlet />
            </Suspense>
          </Content>
        </LayoutStyled>
      )}
    </>
  );
}

export default PageLayout;
