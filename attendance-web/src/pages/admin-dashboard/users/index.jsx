import { useMemo, useRef, useState } from 'react';
import { Button, Card, Col, Drawer, Form, Popconfirm, Row, Select, Tag, Typography } from 'antd';
import { TbAdjustmentsHorizontal, TbTrash, TbEye } from 'react-icons/tb';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TableGeneric from '@/components/TableGeneric';
import { dateFormat } from '@/utilities/dateHelper';
import useQueryFetch from '@/utilities/hooks/useQueryFetch';

const { Title } = Typography;

function DrawerContent({ isOpen, onClose, dataPagination }) {
  const [params] = useSearchParams();
  const paramsObj = useMemo(() => Object.fromEntries(params.entries()), [params]);

  console.log(isOpen);

  const {
    data: dataEmployeeStatus = [],
    isLoading: isLoadingEmployeeStatus,
    refetch: refetchEmployeeStatus,
  } = useQueryFetch({
    url: '/employee-status',
    enabled: Boolean(isOpen),
  });

  const {
    data: dataSquad = [],
    isLoading: isLoadingSquad,
    refetch: refetchSquad,
  } = useQueryFetch({
    url: '/squad',
    enabled: Boolean(isOpen),
  });

  useMemo(() => {
    if (isOpen) {
      refetchEmployeeStatus();
      refetchSquad();
    }
  }, [isOpen]);

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const onFinish = (values) => {
    dataPagination?.current?.setByQuery({
      employee_status_id: values.employee_status_id,
      squad_id: values.squad_id,
    });
    setTimeout(() => {
      onClose();
    }, 100);
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        employee_status_id: paramsObj.employee_status_id,
        squad_id: paramsObj.squad_id,
      }}
    >
      <Row justify="space-between">
        <Col span={24}>
          <Form.Item name="employee_status_id" label="Status Pegawai">
            <Select
              loading={isLoadingEmployeeStatus}
              size="large"
              allowClear
              optionFilterProp="children"
              filterOption={filterOption}
              options={dataEmployeeStatus?.map(({ name, id }) => ({
                value: id,
                label: name,
              }))}
            />
          </Form.Item>
          <Form.Item name="squad_id" label="Squad">
            <Select
              loading={isLoadingSquad}
              size="large"
              allowClear
              optionFilterProp="children"
              filterOption={filterOption}
              options={dataSquad?.map(({ name, id }) => ({
                value: id,
                label: name,
              }))}
            />
          </Form.Item>
        </Col>

        <Col span={24}>
          <Form.Item>
            <Button htmlType="submit" size="large" type="primary" style={{ width: '100%' }}>
              Submit
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}

function AdminUsersDashboard() {
  const dataPagination = useRef();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const showDrawer = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Title level={3} style={{ margin: 'auto' }}>
        Data User
      </Title>
      <Card style={{ marginTop: 24 }}>
        <TableGeneric
          addTitle="Tambah User"
          addPath="./add"
          ref={dataPagination}
          generatedParamsKey={{ employeeStatus: 'employee_status_id', squad: 'squad_id' }}
          headerFilter={
            <Row>
              <Button
                style={{ alignItems: 'center', display: 'flex' }}
                icon={<TbAdjustmentsHorizontal style={{ fontSize: 20 }} />}
                size="large"
                onClick={showDrawer}
              >
                Filter
              </Button>
            </Row>
          }
          isSearch
          dataSourceUrl="/user"
          columns={[
            {
              title: 'Nama',
              dataIndex: ['name'],
              key: 'name',
              render: (_, record) => (
                <Button type="link" onClick={() => navigate(record?.uuid)}>
                  {record?.name}
                </Button>
              ),
            },
            {
              title: 'Squad',
              dataIndex: ['squad', 'name'],
              key: 'squad',
            },
            {
              title: 'Status Pegawai',
              dataIndex: ['employeeStatus', 'name'],
              key: 'status',
            },
            {
              title: 'Role',
              dataIndex: ['isAdmin'],
              key: 'role',
              render: (_, record) => (
                <Tag color={record?.isAdmin ? 'red' : 'green'}>
                  {record?.isAdmin ? 'Admin' : 'Pegawai'}
                </Tag>
              ),
            },
            {
              title: 'Tanggal dibuat',
              dataIndex: ['createdAt'],
              key: 'date',
              render: (_, record) =>
                dateFormat(record.createdAt, {
                  dateFormat: 'DD-MM-YYYY',
                }),
            },
            {
              title: '',
              key: 'action',
              width: 100,
              onCell: () => ({ style: { textAlign: 'center' } }),
              onHeaderCell: () => ({ style: { textAlign: 'center' } }),
              render: (_, record) => (
                <Row justify="center" align="middle">
                  <Col>
                    <Button
                      onClick={() => navigate(record.uuid)}
                      type="link"
                      icon={<TbEye style={{ fontSize: 24 }} />}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    />
                  </Col>
                  <Col>
                    <Popconfirm title="Hapus data user?">
                      <Button
                        // onClick={() => handleClick(record.uuid)}
                        type="text"
                        icon={<TbTrash style={{ fontSize: 20 }} />}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: 'var(--ant-color-primary)',
                        }}
                      />
                    </Popconfirm>
                  </Col>
                </Row>
              ),
            },
          ]}
        />
        <Drawer destroyOnClose title="Filter" onClose={onClose} open={isOpen}>
          <DrawerContent isOpen={isOpen} dataPagination={dataPagination} onClose={onClose} />
        </Drawer>
      </Card>
    </>
  );
}

export default AdminUsersDashboard;
