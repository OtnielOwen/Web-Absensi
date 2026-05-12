import { useState } from 'react';
import { Button, Col, Row, Typography, Card, Popconfirm } from 'antd';
import { TbTrash, TbEyeEdit, TbPlus } from 'react-icons/tb';
import ForwardTableGeneric from '@/components/TableGeneric';
import ModalCreateSquad from './components/ModalCreateSquad';
import ModalEditSquad from './components/ModalEditSquad';

const { Title } = Typography;

function AdminMasterSquadDashboard() {
  const [squadSlug, setSquadSlug] = useState(null);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

  const onCloseEdit = () => {
    setIsOpenEdit(false);
  };

  const onEditSlug = (slug) => {
    setIsOpenEdit(true);
    setSquadSlug(slug);
    setIsSuccess(false);
  };

  const onCreate = () => {
    setIsOpen(true);
    setIsSuccess(false);
  };

  return (
    <>
      <Title level={3} style={{ margin: 'auto' }}>
        Data Squad
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
          dataSourceUrl="/squad"
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
      </Card>

      <ModalEditSquad
        slug={squadSlug}
        onClose={onCloseEdit}
        isOpen={isOpenEdit}
        setIsSuccess={setIsSuccess}
      />

      <ModalCreateSquad isOpen={isOpen} onClose={onClose} setIsSuccess={setIsSuccess} />
    </>
  );
}

export default AdminMasterSquadDashboard;
