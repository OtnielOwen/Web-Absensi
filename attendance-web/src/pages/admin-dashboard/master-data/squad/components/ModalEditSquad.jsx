import { useEffect } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import DefaultLoading from '@/components/DefaultLoading';
import { FORM } from '@/utilities/constant';
import useMutationSubmit from '@/utilities/hooks/useMutationSubmit';
import useQueryFetch from '@/utilities/hooks/useQueryFetch';

function ModalContent({ onClose, slug, isOpen, setIsSuccess }) {
  const {
    data,
    isLoading: isLoadingDetail,
    refetch,
  } = useQueryFetch({
    url: `/squad/${slug}`,
    enabled: Boolean(isOpen),
  });

  const { submit: submitEdit, isLoading: isLoadingEdit } = useMutationSubmit({
    url: `/squad/edit/${slug}`,
    method: 'PATCH',
    onSuccess() {
      onClose();
      setIsSuccess(true);
    },
  });

  const onFinish = (values) => {
    submitEdit({ name: values.name });
  };

  useEffect(() => {
    isOpen && refetch();
  }, [isOpen]);

  return (
    <>
      {isLoadingDetail ? (
        <DefaultLoading />
      ) : (
        <Form
          validateMessages={FORM.VALIDATE_MESSAGE}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            name: data?.name,
          }}
        >
          <Form.Item name="name" label="Nama Status">
            <Input size="large" />
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
      )}
    </>
  );
}

function ModalEditSquad({ onClose, isOpen, slug, setIsSuccess }) {
  return (
    <Modal title="Edit Data" footer={null} centered open={isOpen} onCancel={onClose} destroyOnClose>
      <ModalContent onClose={onClose} isOpen={isOpen} slug={slug} setIsSuccess={setIsSuccess} />
    </Modal>
  );
}

export default ModalEditSquad;
