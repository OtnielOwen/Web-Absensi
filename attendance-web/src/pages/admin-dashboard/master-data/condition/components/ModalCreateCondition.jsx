import { Button, Form, Input, Modal } from 'antd';
import { FORM } from '@/utilities/constant';
import useMutationSubmit from '@/utilities/hooks/useMutationSubmit';

function ModalCreateCondition({ isOpen, onClose, setIsSuccess }) {
  const { submit, isLoading } = useMutationSubmit({
    url: '/condition/create',
    onSuccess() {
      onClose();
      setIsSuccess(true);
    },
  });

  const onFinish = (values) => {
    submit({ name: values.name });
  };

  return (
    <Modal
      title="Tambah Data"
      footer={null}
      centered
      open={isOpen}
      onCancel={onClose}
      destroyOnClose
    >
      <Form validateMessages={FORM.VALIDATE_MESSAGE} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Nama Status" rules={[{ required: true }]}>
          <Input size="large" />
        </Form.Item>

        <Form.Item>
          <Button
            loading={isLoading}
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
    </Modal>
  );
}

export default ModalCreateCondition;
