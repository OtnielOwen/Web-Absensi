import { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Grid,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import { TbUserEdit, TbArrowBackUp } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';
import AttendanceTable from '@/components/AttendanceTable';
import DefaultLoading from '@/components/DefaultLoading';
import { FORM } from '@/utilities/constant';
import useMutationSubmit from '@/utilities/hooks/useMutationSubmit';
import useQueryFetch from '@/utilities/hooks/useQueryFetch';

const { Text, Title } = Typography;

function AdminUserDetailDashboard() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { lg, md } = Grid.useBreakpoint();

  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const onOpen = () => {
    setIsSuccess(false);
    setIsOpen(true);
  };

  const { data, isLoading, refetch } = useQueryFetch({
    url: `/user/${slug}`,
  });

  useEffect(() => {
    if (isSuccess) {
      refetch();
    }
  }, [isSuccess]);

  return (
    <>
      {isLoading ? (
        <DefaultLoading />
      ) : (
        <div>
          <Button
            style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}
            icon={<TbArrowBackUp style={{ fontSize: 20 }} />}
            size="large"
            onClick={() => navigate(-1)}
          >
            Kembali
          </Button>
          <Title level={4} style={{ margin: 'auto' }}>
            Data Pribadi
          </Title>
          <Card style={{ marginTop: 16 }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Space align="center" size={md ? 'large' : 'small'} direction={!lg && 'vertical'}>
                  <div>
                    <Avatar
                      size={128}
                      src={
                        <Image
                          src={data?.imageUrl?.[0]?.url}
                          fallback="https://fakeimg.pl/400x400?text=not found"
                        />
                      }
                    />
                  </div>

                  <Space direction="vertical">
                    <Title style={{ margin: 'auto' }} level={3}>
                      {data?.name}
                    </Title>
                    <Text strong>{data?.email}</Text>
                    <Space>
                      <Text level={3}>{data?.squad?.name}</Text>-
                      <Text level={3}>{data?.employeeStatus?.name}</Text>
                    </Space>
                  </Space>
                </Space>
              </Col>

              <Col>
                <Button
                  type="primary"
                  size="large"
                  style={{ display: 'flex', alignItems: 'center' }}
                  icon={<TbUserEdit style={{ fontSize: 20 }} />}
                  onClick={onOpen}
                >
                  Edit User
                </Button>
              </Col>
            </Row>
          </Card>
        </div>
      )}
      <div style={{ marginTop: 16 }}>
        <Title level={4} style={{ margin: 'auto' }}>
          Absensi Anda
        </Title>
        <AttendanceTable dataSourceUrl={`/attendance?userId=${data?.id}`} />
      </div>

      <Modal
        title="Edit user"
        footer={null}
        centered
        onCancel={onClose}
        open={isOpen}
        destroyOnClose
      >
        <ModalContent
          onClose={onClose}
          isOpen={isOpen}
          data={data}
          slug={slug}
          setIsSuccess={setIsSuccess}
        />
      </Modal>
    </>
  );
}

function ModalContent({ onClose, slug, isOpen, setIsSuccess, data = {} }) {
  const { name, email, employeeStatus, squad } = data || {};

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

  const { submit: submitEdit, isLoading: isLoadingEdit } = useMutationSubmit({
    url: `/user/edit/${slug}`,
    method: 'PATCH',
    onSuccess() {
      onClose();
      setIsSuccess(true);
    },
  });

  const onFinish = (values) => {
    submitEdit(values);
  };

  useEffect(() => {
    if (isOpen) {
      refetchEmployeeStatus();
      refetchSquad();
    }
  }, [isOpen]);

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <Form
      validateMessages={FORM.VALIDATE_MESSAGE}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        name,
        email,
        employeeStatusId: employeeStatus?.id,
        squadId: squad?.id,
      }}
    >
      <Form.Item name="name" label="Nama Status">
        <Input size="large" />
      </Form.Item>

      <Form.Item name="email" label="Email">
        <Input size="large" />
      </Form.Item>

      <Form.Item name="employeeStatusId" label="Status Pegawai">
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
      <Form.Item name="squadId" label="Squad">
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

      <Form.Item>
        <Button
          loading={isLoadingEdit}
          type="primary"
          htmlType="submit"
          size="large"
          style={{
            width: '100%',
          }}
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default AdminUserDetailDashboard;
