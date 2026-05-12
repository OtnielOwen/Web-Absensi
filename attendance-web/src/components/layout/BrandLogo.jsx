import { Image } from 'antd';
import { Link } from 'react-router-dom';
import SvnLogo from '@/assets/images/svn-logo.png';

/**
 * @param {Object} props
 * @param {React.CSSProperties} props.style
//  * @param {boolean} [props.isHiRes]
 */
function BrandLogo({ style }) {
  return (
    <Link
      to="/"
      style={{
        padding: '8px 0',
      }}
    >
      <Image src={SvnLogo} preview={false} style={style} />
    </Link>
  );
}

export default BrandLogo;
