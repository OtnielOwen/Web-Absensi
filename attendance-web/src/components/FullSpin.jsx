import { Spin } from 'antd';

/**
 * @param {import('antd').SpinProps} props
 */
function FullSpin(props) {
  return (
    <Spin
      {...props}
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...props.style,
      }}
    />
  );
}

export default FullSpin;
