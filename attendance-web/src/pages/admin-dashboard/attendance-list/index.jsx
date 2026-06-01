import { useMemo, useRef, useState } from 'react';
import { Button, Card, Col, Drawer, Form, Row, Select, Typography, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { TbAdjustmentsHorizontal, TbFileDownload } from 'react-icons/tb';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ForwardTableGeneric from '@/components/TableGeneric';
import useQueryFetch from '@/utilities/hooks/useQueryFetch';
import 'dayjs/locale/id';
import ModalExport from './components/ModalExport';

import AttendanceChart from './components/AttendanceChart';

const { RangePicker } = DatePicker;

const { Title, Text } = Typography;

function DrawerContent({ isOpen, onClose, dataPagination }) {
  const [params] = useSearchParams();
  const paramsObj = useMemo(() => Object.fromEntries(params.entries()), [params]);

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

function AdminAttendanceListDashboard() {
  const OFFICE_START_TIME = '14:00:00';

  const dataPagination = useRef();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenExport, setIsOpenExport] = useState(false);

  const onChangeRangeDate = (dates) => {
    if (!dates) {
      dataPagination?.current?.setByQuery({
        start_date: '',
        end_date: '',
      });
    } else {
      dataPagination?.current?.setByQuery({
        start_date: dates[0]?.format('YYYY-MM-DD'),
        end_date: dates[1].format('YYYY-MM-DD'),
      });
    }
  };

  const showDrawer = () => {
    setIsOpen(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const onCloseExport = () => {
    setIsOpenExport(false);
  };

  return (
    <>
      <Title level={4} style={{ margin: 'auto' }}>
        Data Absensi
      </Title>

      <AttendanceChart />

      <Card style={{ marginTop: 16 }}>
        <ForwardTableGeneric
          isSearch
          ref={dataPagination}
          headerFilter={
            <Row gutter={[16, 16]}>
              <Col>
                <RangePicker size="large" onChange={onChangeRangeDate} />
              </Col>
              <Col>
                <Button
                  style={{ alignItems: 'center', display: 'flex' }}
                  icon={<TbAdjustmentsHorizontal style={{ fontSize: 20 }} />}
                  size="large"
                  onClick={showDrawer}
                >
                  Filter
                </Button>
              </Col>
              <Col>
                <Button
                  style={{ alignItems: 'center', display: 'flex' }}
                  icon={<TbFileDownload style={{ fontSize: 20 }} />}
                  size="large"
                  onClick={() => setIsOpenExport(true)}
                >
                  Export
                </Button>
              </Col>
            </Row>
          }
          generatedParamsKey={{
            employeeStatus: 'employee_status_id',
            squad: 'squad_id',
            startDate: 'start_date',
            endDate: 'end_date',
          }}
          dataSourceUrl="/all-users/attendance"
          columns={[
            {
              title: 'Nama',
              dataIndex: ['user', 'name'],
              key: 'username',
              fixed: 'left',
              render: (_, record) => (
                <Button
                  type="link"
                  onClick={() => navigate(`/admin-dashboard/users/${record?.user?.uuid}`)}
                >
                  {record?.user?.name}
                </Button>
              ),
            },
            {
              title: 'Squad',
              dataIndex: ['user', 'squad', 'name'],
              key: 'squad',
              fixed: 'left',
            },
            {
              title: 'Status Pegawai',
              dataIndex: ['user', 'employeeStatus', 'name'],
              key: 'status',
              fixed: 'left',
            },
            {
              title: 'Status',
              dataIndex: ['condition', 'name'],
              key: 'status',
            },

            {
              title: 'Keterangan',
              dataIndex: 'description',
              key: 'description',
            },
            {
              title: 'Kerja',
              dataIndex: ['workingStatus', 'name'],
              key: 'work',
            },
            {
              title: 'Hari',
              dataIndex: 'date',
              key: 'date',
              render: (_, record) => {
                const estimateDay = dayjs(record.date).locale('id').format('dddd');
                return <Text>{estimateDay}</Text>;
              },
            },
            {
              title: 'Waktu',
              dataIndex: 'time',
              key: 'time',
              render: (time) => {
                const isLate = time > OFFICE_START_TIME;

                return (
                  <span
                    style={{
                      color: isLate ? '#ff4d4f' : '#52c41a',
                      fontWeight: 'bold',
                    }}
                  >
                    {time}
                  </span>
                );
              },
            },
            {
              title: 'Ketepatan',
              key: 'ketepatan',
              render: (_, record) => {
                const isLate = record?.time > OFFICE_START_TIME;

                return (
                  <span
                    style={{
                      color: isLate ? '#ff4d4f' : '#52c41a',
                      fontWeight: 'bold',
                    }}
                  >
                    {isLate ? 'Telat' : 'Tepat Waktu'}
                  </span>
                );
              },
            },
            {
              title: 'Tanggal',
              dataIndex: 'date',
              key: 'date',
            },
            {
              title: 'Bulan',
              dataIndex: 'date',
              key: 'date',
              render: (_, record) => {
                const estimateMonth = dayjs(record.date).locale('id').format('MMMM');
                return <Text>{estimateMonth}</Text>;
              },
            },

            {
              width: '30%',
              title: 'Alamat Lokasi',
              dataIndex: ['location', 'address'],
              key: 'address',
            },
          ]}
        />
      </Card>

      <Drawer destroyOnClose title="Filter" onClose={onClose} open={isOpen}>
        <DrawerContent isOpen={isOpen} dataPagination={dataPagination} onClose={onClose} />
      </Drawer>

      <ModalExport onClose={onCloseExport} isOpen={isOpenExport} />
    </>
  );
}

export default AdminAttendanceListDashboard;
