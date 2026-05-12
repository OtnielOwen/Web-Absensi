import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SvnLogo2 from '@/assets/images/svn-logo-2.png';
import SvnLogo from '@/assets/images/svn-logo.png';

const BrandLogoImage = styled.div`
  max-width: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  width: 100%;
  height: 43px;
`;

function BrandLogo({ isCollapsed }) {
  return (
    <Link
      style={{ display: 'flex', padding: '24px 16px', justifyContent: 'center' }}
      to="/dashboard"
    >
      <BrandLogoImage
        collapsed={isCollapsed}
        style={{ backgroundImage: `url(${isCollapsed ? SvnLogo2 : SvnLogo})` }}
      />
    </Link>
  );
}

export default BrandLogo;
