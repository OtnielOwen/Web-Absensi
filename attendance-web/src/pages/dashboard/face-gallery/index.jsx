import { useRef, useState } from 'react';
import { Button, Typography, Card, Row, Col, Image, Popconfirm, Alert, Flex } from 'antd';
import { TbPhotoBolt } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import DefaultLoading from '@/components/DefaultLoading';
import TableGeneric from '@/components/TableGeneric';
import { dateFormat } from '@/utilities/dateHelper';

import { DeleteOutlined } from '@ant-design/icons';
import useAddressesMutator from './hooks/useFacesGalleryMutator';

const { Title } = Typography;

function FaceGalleryPage() {
  const navigate = useNavigate();
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClick = (slug) => {
    setSelectedRecordId(slug);
  };

  const onDeleteSuccess = () => {
    navigate('/dashboard/facegallery');
  };

  const { submitDelete, isLoadingDelete } = useAddressesMutator({
    slug: selectedRecordId,
    onDeleteSuccess,
  });

  const confirm = () => {
    submitDelete();
  };

  return (
    <>
      {isLoadingDelete ? (
        <DefaultLoading />
      ) : (
        <>
          <Title level={3} style={{ margin: 'auto' }}>
            Album Wajah
          </Title>
          <Card style={{ marginTop: 24 }}>
            <Row justify="start">
              <Col>
                <Button
                  style={{ display: 'flex', alignItems: 'center' }}
                  icon={<TbPhotoBolt style={{ fontSize: 20 }} />}
                  type="primary"
                  onClick={() => navigate('./add')}
                >
                  Tambah Data Wajah
                </Button>
              </Col>
            </Row>
            <TableGeneric
              isRefetch={true}
              dataSourceUrl="/photos"
              columns={[
                {
                  title: 'Foto Wajah',
                  key: 'face-photo',

                  render: (_, record) => {
                    return (
                      <Row style={{ cursor: 'pointer' }}>
                        <Image src={record.photoUrl.url} alt="image gallery" width={100} />
                      </Row>
                    );
                  },
                },
                {
                  title: 'Tanggal Upload',
                  dataIndex: ['user_key', 'key_unique_name'],
                  key: 'date',
                  render: (_, record) =>
                    dateFormat(record.createdAt, {
                      dateFormat: 'DD-MM-YYYY',
                    }),
                },
                {
                  title: '',
                  key: 'action',
                  width: 56,
                  onCell: () => ({ style: { textAlign: 'center' } }),
                  onHeaderCell: () => ({ style: { textAlign: 'center' } }),
                  render: (_, record) => (
                    <Popconfirm title="Hapus foto ini?" onConfirm={confirm}>
                      <Button
                        onClick={() => handleClick(record.uuid)}
                        type="text"
                        icon={<DeleteOutlined />}
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          color: 'var(--ant-color-primary)',
                        }}
                      />
                    </Popconfirm>
                  ),
                },
              ]}
            />
          </Card>
        </>
      )}
    </>
  );
}

export default FaceGalleryPage;
