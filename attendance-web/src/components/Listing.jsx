import { useMemo } from 'react';
import { Row, Col, Space, Typography, Pagination, Input, Spin, Empty, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { LuSettings2 } from 'react-icons/lu';
import useDataPagination from '@/utilities/hooks/useDataPagination';
import { SearchOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;

/**
 * @param {Object} props
 * @param {string} props.title
 * @param {string | React.ReactNode} props.text
 * @param {React.ReactNode | (data: Object, index?: number) => void} props.children
 * @param {string} props.searchQueryKey
 * @param {boolean} props.isPagination
 * @param {boolean} props.isSearch
 * @param {() => void} props.onClickFilter
 * @param {string} props.placeholderSearch
 * @param {React.ReactNode} props.categories
 * @param {string} props.dataSourceUrl
 * @param {Object | null} props.defaultParams
 * @param {import('antd').ColProps} props.colProps
 * @param {import('antd').RowProps} props.rowProps
 */
function Listing({ title, text, isPagination, isSearch, placeholderSearch, categories, ...props }) {
  const { data, pagination, isLoading, goToPage, searchQuery, searchByQuery } = useDataPagination({
    dataSourceUrl: props.dataSourceUrl,
    searchQueryKey: props.searchQueryKey,
    defaultParams: props.defaultParams === null ? {} : props.defaultParams,
  });

  const { t } = useTranslation();

  const isDataArray = useMemo(() => Array.isArray(data), [data]);

  const children = useMemo(() => {
    if (!props.dataSourceUrl || typeof props.children !== 'function') {
      return props.children;
    }

    if (isDataArray) {
      return data.map((item, index) => props.children(item, index));
    }

    return props.children(data);
  }, [data, props.children, props.dataSourceUrl]);

  const renderChildren = () => {
    if (!props.dataSourceUrl || typeof props.children !== 'function') {
      return children;
    }

    return (
      <Row style={{ paddingBottom: 8, marginTop: 16 }} gutter={[16, 16]} {...props.rowProps}>
        {isDataArray ? (
          <>
            {children.map((child, i) => (
              <Col key={i} {...props.colProps}>
                {child}
              </Col>
            ))}
            {children.length === 0 && (
              <Col span={24}>
                <Empty style={{ marginTop: 24 }} />
              </Col>
            )}
          </>
        ) : (
          <Col span={24} {...props.colProps}>
            {children}
          </Col>
        )}
      </Row>
    );
  };

  const isHasFilter = useMemo(
    () => typeof props.onClickFilter === 'function',
    [props.onClickFilter]
  );

  const isHasTextString = useMemo(() => typeof text === 'string', [text]);

  return (
    <Spin spinning={isLoading}>
      {title && (
        <Space direction="vertical" size="large">
          <Title style={{ margin: 'auto' }} level={2}>
            {title}
          </Title>
          {isHasTextString ? <>{text && <Text type="secondary">{text}</Text>}</> : text}
        </Space>
      )}

      <Row>
        {isSearch && (
          <Col span={24} style={{ marginTop: 32 }}>
            <Row gutter={[16, 16]}>
              {isHasFilter && (
                <Col flex="none">
                  <Button size="large" onClick={props.onClickFilter}>
                    <Space align="center" style={{ margin: 'auto' }}>
                      Filter
                      <LuSettings2 style={{ fontSize: 20, display: 'flex' }} />
                    </Space>
                  </Button>
                </Col>
              )}
              <Col {...(title ? { lg: 12 } : { lg: 24 })} {...(isHasFilter && { flex: 'auto' })}>
                <Search
                  allowClear
                  size="large"
                  defaultValue={searchQuery}
                  enterButton={
                    <Space>
                      <SearchOutlined style={{ fontSize: 18 }} />
                      {t('Cari')}
                    </Space>
                  }
                  onSearch={(value) => searchByQuery(value)}
                  placeholder={placeholderSearch}
                />
              </Col>
            </Row>
          </Col>
        )}
      </Row>

      {categories && <div style={{ marginTop: 24 }}>{categories}</div>}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>{renderChildren()}</Col>
      </Row>

      {(isPagination || pagination) && (
        <Row justify="center" style={{ marginTop: 48 }}>
          <Pagination
            defaultCurrent={1}
            total={50}
            {...(pagination && {
              total: pagination.count,
              pageSize: pagination.items,
              current: pagination.page,
              onChange: (page, pageSize) => {
                goToPage(page, pageSize);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              },
            })}
          />
        </Row>
      )}
    </Spin>
  );
}

export default Listing;
