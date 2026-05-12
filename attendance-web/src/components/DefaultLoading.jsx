import { Spin } from 'antd';

/**
 *
 * @param {Object} props
 * @param {("large" | "default" | "small")} props.size
 * @param {number} props.height
 */

function DefaultLoading({ size = 'default', height = 70 }) {
  return (
    <Spin
      size={size}
      style={{
        width: '100%',
        minHeight: `${height}vh`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
}

export default DefaultLoading;
