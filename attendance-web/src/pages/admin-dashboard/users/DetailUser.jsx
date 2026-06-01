import { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Grid,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Typography,
  Popconfirm,
} from 'antd';
import { TbUserEdit, TbArrowBackUp } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';

import AttendanceTable from '@/components/AttendanceTable';
import DefaultLoading from '@/components/DefaultLoading';

import { FORM } from '@/utilities/constant';
import useMutationSubmit from '@/utilities/hooks/useMutationSubmit';
import useQueryFetch from '@/utilities/hooks/useQueryFetch';

import UserAttendanceSummary from '@/pages/admin-dashboard/users/components/UserAttendanceSummary'

import dayjs from 'dayjs';

const { Text, Title } = Typography;

function AdminUserDetailDashboard() {
  const { slug } = useParams();

  const isAddMode = slug === 'add';

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

  const {
    data,
    isLoading,
    refetch,
  } = useQueryFetch({
    url: `/user/${slug}`,
    enabled: !isAddMode,
  });

  console.log(data);

  const {
    submit: submitDelete,
    isLoading: isLoadingDelete,
  } = useMutationSubmit({
    url: `/user/delete/${slug}`,
    method: 'DELETE',
    onSuccess() {
      navigate('/admin/users');
    },
  });

  useEffect(() => {
    if (isSuccess && !isAddMode) {
      refetch();
    }
  }, [isSuccess]);

  return (
    <>
      {isLoading && !isAddMode ? (
        <DefaultLoading />
      ) : (
        <div>
          <Button
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 16,
            }}
            icon={<TbArrowBackUp style={{ fontSize: 20 }} />}
            size="large"
            onClick={() => navigate(-1)}
          >
            Kembali
          </Button>

          <Title level={4} style={{ margin: 'auto' }}>
            {isAddMode ? 'Tambah User' : 'Data Pribadi'}
          </Title>

          {isAddMode && (
            <Card style={{ marginTop: 16 }}>
              <AddUserForm />
            </Card>
          )}

          {!isAddMode && (
            <Card style={{ marginTop: 16 }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Space
                    align="center"
                    size={md ? 'large' : 'small'}
                    direction={!lg && 'vertical'}
                  >
                    <div>
                      <Avatar
                        size={128}
                        src={
                          data?.photoProfile
                            ? `http://localhost:5000/uploads/profile/${data.photoProfile}`
                            : undefined
                        }
                      >
                        {!data?.photoProfile &&
                          data?.name?.charAt(0)}
                      </Avatar>
                    </div>

                    <Space direction="vertical">
                      <Title style={{ margin: 'auto' }} level={3}>
                        {data?.name}
                      </Title>

                      <Text strong>{data?.email}</Text>

                      <Space>
                        <Text>{data?.squad?.name}</Text> -
                        <Text>
                          {data?.employeeStatus?.name}
                        </Text>
                      </Space>
                    </Space>
                  </Space>
                </Col>

                <Col>
                  <Space>
                    <Popconfirm
                      title="Hapus user?"
                      description="Data user akan dihapus permanen"
                      okText="Hapus"
                      cancelText="Batal"
                      onConfirm={() => {
                        submitDelete({});
                      }}
                    >
                      <Button
                        danger
                        loading={isLoadingDelete}
                      >
                        Hapus
                      </Button>
                    </Popconfirm>

                    <Button
                      type="primary"
                      size="large"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                      icon={
                        <TbUserEdit style={{ fontSize: 20 }} />
                      }
                      onClick={onOpen}
                    >
                      Edit User
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Card>
          )}
        </div>
      )}

      {!isAddMode && data && (
          <div style={{ marginTop: 16 }}>
            <Title level={4} style={{ margin: 'auto' }}>
              Absensi Anda
            </Title>

            <UserAttendanceSummary
              userId={data?.id}
            />

            <Title level={4} style={{ marginTop: 24 }}>
              Riwayat Absensi
            </Title>

            <AttendanceTable
              dataSourceUrl={`/attendance?userId=${data?.id}`}
            />
          </div>
        )}

      {!isAddMode && (
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
      )}
    </>
  );
}

function AddUserForm() {
  const navigate = useNavigate();

  const {
    data: dataEmployeeStatus = [],
  } = useQueryFetch({
    url: '/employee-status',
  });

  const {
    data: dataSquad = [],
  } = useQueryFetch({
    url: '/squad',
  });

  const {
    submit: submitCreate,
    isLoading,
  } = useMutationSubmit({
    url: '/user/create',
    method: 'POST',
    onSuccess() {
      window.location.href = '/admin-dashboard/users';
    },
  });

  const onFinish = (values) => {
    submitCreate(values);
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        label="Nama"
        rules={[
          {
            required: true,
            message: 'Nama wajib diisi',
          },
        ]}
      >
        <Input size="large" />
      </Form.Item>

      <Form.Item
        name="nik"
        label="NIK"
        rules={[
          {
            required: true,
            message: 'NIK wajib diisi',
          },
        ]}
      >
        <Input size="large" />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[
          {
            required: true,
            message: 'Email wajib diisi',
          },
        ]}
      >
        <Input size="large" />
      </Form.Item>

      <Form.Item
        name="password"
        label="Password"
        rules={[
          {
            required: true,
            message: 'Password wajib diisi',
          },
        ]}
      >
        <Input.Password size="large" />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        label="Konfirmasi Password"
        rules={[
          {
            required: true,
            message: 'Konfirmasi password wajib diisi',
          },
        ]}
      >
        <Input.Password size="large" />
      </Form.Item>

      <Form.Item
        name="employeeStatusId"
        label="Status Pegawai"
      >
        <Select
          size="large"
          options={dataEmployeeStatus?.map(
            ({ name, id }) => ({
              label: name,
              value: id,
            })
          )}
        />
      </Form.Item>

      <Form.Item
        name="squadId"
        label="Squad"
      >
        <Select
          size="large"
          options={dataSquad?.map(({ name, id }) => ({
            label: name,
            value: id,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="isAdmin"
        label="Role"
      >
        <Select
          size="large"
          options={[
            {
              label: 'Pegawai',
              value: false,
            },
            {
              label: 'Admin',
              value: true,
            },
          ]}
        />
      </Form.Item>

      <Button
        htmlType="submit"
        type="primary"
        size="large"
        loading={isLoading}
      >
        Tambah User
      </Button>
    </Form>
  );
}

function ModalContent({
  onClose,
  slug,
  isOpen,
  setIsSuccess,
  data = {},
}) {
  const {
    name,
    email,
    employeeStatus,
    squad,
  } = data || {};

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

  const {
    submit: submitEdit,
    isLoading: isLoadingEdit,
  } = useMutationSubmit({
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
    (option?.label ?? '')
      .toLowerCase()
      .includes(input.toLowerCase());

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

      <Form.Item
        name="employeeStatusId"
        label="Status Pegawai"
      >
        <Select
          loading={isLoadingEmployeeStatus}
          size="large"
          allowClear
          optionFilterProp="children"
          filterOption={filterOption}
          options={dataEmployeeStatus?.map(
            ({ name, id }) => ({
              value: id,
              label: name,
            })
          )}
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