import { useMemo } from 'react';
import { Empty, Row, Col } from 'antd';
import DefaultLoading from './DefaultLoading';

/**
 * @param {object} props
 * @param {(data: object | Array, index?: number, totalLength?: number) => JSX.Element} props.children
 * @param {object | Array} props.data
 * @param {import('antd').ColProps} props.colProps
 * @param {import('antd').RowProps} props.rowProps
 * @param {React.CSSProperties} props.style
 * @param {boolean} props.isLoading
 * @returns {JSX.Element}
 */
function RenderWhen({
  data,
  isLoading,
  children,
  returnEmpty = true,
  loadingComponent = <DefaultLoading />,
  ...props
}) {
  const child = useMemo(() => {
    if (Array.isArray(data) && data?.length > 0) {
      return data.map((item, i) => (
        <Col {...props.colProps} key={item?.id || i}>
          {children(item, i, data.length)}
        </Col>
      ));
    } else if (Object.keys(data || {}).length > 0) return children(data);

    return returnEmpty ? <Empty /> : null;
  }, [data, children, returnEmpty]);

  return (
    <>
      {isLoading ? (
        loadingComponent
      ) : props.colProps ? (
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          {child}
        </Row>
      ) : (
        <div {...props.style}>{child}</div>
      )}
    </>
  );
}

export default RenderWhen;
