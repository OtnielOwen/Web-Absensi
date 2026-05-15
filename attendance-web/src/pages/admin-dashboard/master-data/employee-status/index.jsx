import { useState } from 'react';
import { Button, Col, Row, Typography, Card, Popconfirm } from 'antd';
import { TbTrash, TbPlus, TbEyeEdit } from 'react-icons/tb';
import ForwardTableGeneric from '@/components/TableGeneric';
import ModalCreateEmployeeStatus from './components/ModalCreateEmployeeStatus';
import ModalEditEmployeeStatus from './components/ModalEditEmployeeStatus';

import useMutationSubmit from '@/utilities/hooks/useMutationSubmit';

const { Title } = Typography;

function AdminMasterEmployeeStatusDashboard() {
  const [employeeStatusSlug, setEmployeeStatusSlug] = useState(null);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteSlug, setDeleteSlug] = useState(null);

  const onClose = () => {
    setIsOpen(false);
  };

  const onCloseEdit = () => {
    setIsOpenEdit(false);
  };

  const onEditSlug = (slug) => {
    setIsOpenEdit(true);
    setIsSuccess(false);
    setEmployeeStatusSlug(slug);
  };

  const onCreate = () => {
    setIsOpen(true);
    setIsSuccess(false);
  };

  const { submit: submitDelete } = useMutationSubmit({
    url: deleteSlug
      ? `/employee-status/delete/${deleteSlug}`
      : '',
    method: 'DELETE',
    onSuccess() {
      setIsSuccess(false);

      setTimeout(() => {
        setIsSuccess(true);
      }, 100);
    },
  });

  const onDelete = (slug) => {
    setDeleteSlug(slug);

    setTimeout(() => {
      submitDelete();
    }, 0);
  };

  return (
    <>
      <Title level={3} style={{ margin: 'auto' }}>
        Data Status Karyawan
      </Title>
      <Card style={{ marginTop: 24 }}>
        <ForwardTableGeneric
          isRefetch={isSuccess}
          headerAddData={
            <Button
              style={{ display: 'flex', alignItems: 'center' }}
              icon={<TbPlus style={{ fontSize: 20 }} />}
              type="primary"
              onClick={onCreate}
              size="large"
            >
              Tambah Data
            </Button>
          }
          dataSourceUrl="/employee-status"
          columns={[
            {
              title: 'Status',
              dataIndex: ['name'],
              key: 'name',
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
                      onClick={() => onEditSlug(record.uuid)}
                      type="link"
                      icon={<TbEyeEdit style={{ fontSize: 20 }} />}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    />
                  </Col>
                  <Col>
                    <Popconfirm
                      title="Hapus data status karyawan?"
                      onConfirm={() => onDelete(record.uuid)}
                    >
                      <Button
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
      </Card>

      <ModalEditEmployeeStatus
        slug={employeeStatusSlug}
        onClose={onCloseEdit}
        isOpen={isOpenEdit}
        setIsSuccess={setIsSuccess}
      />

      <ModalCreateEmployeeStatus isOpen={isOpen} onClose={onClose} setIsSuccess={setIsSuccess} />
    </>
  );
}

export default AdminMasterEmployeeStatusDashboard;
