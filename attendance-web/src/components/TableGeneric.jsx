import { forwardRef, useEffect } from 'react';
import { Table, Input, Row, Col, Button } from 'antd';
import { TbPlus } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useDataTablePagination from '@/utilities/hooks/useDataTablePagination';

const { Search } = Input;

const TableStyled = styled(Table)`
  .ant-table-thead .ant-table-cell {
    background-color: var(--ant-color-primary);
    color: var(--ant-color-bg-base);
  }

  .ant-table-thead .ant-table-cell {
    border-top: 1px solid;
  }

  .ant-table-tbody .ant-table-cell {
    border: 1px solid var(--ant-color-border);
  }

  .ant-table-tbody .ant-table-row:nth-child(odd) {
    background-color: #f5f7f8;
  }

  // Even rows
  .ant-table-tbody .ant-table-row:nth-child(even) {
    background-color: var(--ant-color-bg-container);
  }
`;

/**
 *
 * @param {Object} props
 * @param {string} props.addTitle
 * @param {string} props.addPath
 * @param {string} props.dataSourceUrl
 * @param {Array} props.columns
 * @param {boolean} props.isSearch
 * @param {boolean} props.isRefetch
 * @param {string} props.searchQueryKey
 * @param {React.ReactNode} props.headerFilter
 * @param {React.ReactNode} props.headerAddData
 * @param {Object} props.generatedParamsKey
 * @param {(data: Object) => Object | Array} props.onFetchSuccess
 * @param {React.Ref<ReturnType<typeof useDataTablePagination>} ref
 */

function TableGeneric({ columns = [], isSearch = false, addTitle = 'Tambah Data', ...props }, ref) {
  const navigate = useNavigate();

  const dataPagination = useDataTablePagination({
    dataSourceUrl: props.dataSourceUrl,
    searchQueryKey: props.searchQueryKey,
    onFetchSuccess: props.onFetchSuccess,
    generatedParamsKey: props.generatedParamsKey,
  });

  const { data, isLoading, pagination, goToPage, searchQuery, searchByQuery, refetch } =
    dataPagination;

  useEffect(() => {
    if (ref) {
      ref.current = dataPagination;
    }
  }, [dataPagination]);

  useEffect(() => {
    if (props.isRefetch) refetch();
  }, [props.isRefetch]);

  return (
    <>
      <Row gutter={[16, 16]} justify="space-between" align="middle">
        <Col>
          <Row gutter={[16, 16]}>
            {isSearch && (
              <Col>
                <Search
                  allowClear
                  size="large"
                  defaultValue={searchQuery}
                  placeholder="Cari"
                  onSearch={(value) => searchByQuery(value)}
                />
              </Col>
            )}
            {props.headerFilter && <Col>{props.headerFilter}</Col>}
          </Row>
        </Col>

        {props.headerAddData ? (
          <Col>{props.headerAddData}</Col>
        ) : (
          addTitle &&
          props.addPath && (
            <Col>
              <Button
                style={{ display: 'flex', alignItems: 'center' }}
                icon={<TbPlus style={{ fontSize: 20 }} />}
                type="primary"
                onClick={() => navigate(props.addPath)}
                size="large"
              >
                {addTitle}
              </Button>
            </Col>
          )
        )}
      </Row>
      <TableStyled
        scroll={{ x: true }}
        size="middle"
        className="scrollbar-custom"
        style={{ marginTop: 32 }}
        columns={[
          {
            width: 56,
            title: 'No',
            dataIndex: 'no',
            key: 'no',
            fixed: 'left',
            onCell: () => ({ style: { textAlign: 'center' } }),
            onHeaderCell: () => ({ style: { textAlign: 'center' } }),
            render(_, __, index) {
              return (
                pagination?.current_page * pagination?.per_page -
                  pagination?.per_page +
                  index +
                  1 || index + 1
              );
            },
          },
          ...(columns ? columns.map((item, index) => ({ key: index, ...item })) : []),
        ]}
        dataSource={data}
        loading={isLoading}
        pagination={{
          size: 'default',
          pageSize: pagination?.per_page,
          total: pagination?.total_items,
          current: pagination?.current_page,
          onChange: (page, pageSize) => {
            goToPage(page, pageSize);
          },
        }}
      />
    </>
  );
}

const ForwardTableGeneric = forwardRef(TableGeneric);

export default ForwardTableGeneric;
