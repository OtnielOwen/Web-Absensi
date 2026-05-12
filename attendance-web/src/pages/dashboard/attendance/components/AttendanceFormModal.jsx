import { Button, Form, Input, Modal, Select } from 'antd';
import { FORM } from '@/utilities/constant';
import useQueryFetch from '@/utilities/hooks/useQueryFetch';

function AttendanceFormModal({ isOpen, onClose, onFinish }) {
  const [modal, contextHolder] = Modal.useModal();

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const { data: dataWorkingStatus = [], isLoading: isLoadingWorkingStatus } = useQueryFetch({
    url: '/working-status',
    enabled: Boolean(isOpen),
  });

  const { data: dataCondition = [], isLoading: isLoadingCondition } = useQueryFetch({
    url: '/condition',
    enabled: Boolean(isOpen),
  });

  return (
    <>
      {contextHolder}
      <Modal
        title="Laporan Kondisi"
        open={isOpen}
        onCancel={() => {
          modal.confirm({
            title: 'Perhatian',
            content: 'Apakah anda yakin untuk membatalkan proses ini?',
            onOk() {
              onClose();
            },
          });
        }}
        width={430}
        footer={null}
        centered
        destroyOnClose
      >
        <Form
          onFinish={onFinish}
          layout="vertical"
          style={{ marginTop: 16 }}
          validateMessages={FORM.VALIDATE_MESSAGE}
        >
          <Form.Item label="Informasi Kerja" name="workingStatusId" rules={[{ required: true }]}>
            <Select
              size="large"
              placeholder="Pilih Informasi Kerja"
              optionFilterProp="children"
              loading={isLoadingWorkingStatus}
              filterOption={filterOption}
              options={dataWorkingStatus?.map(({ name, id }) => ({
                value: id,
                label: name,
              }))}
            />
          </Form.Item>
          <Form.Item label="Kondisi Kesehatan" name="conditionId" rules={[{ required: true }]}>
            <Select
              size="large"
              placeholder="Pilih Kondisi"
              optionFilterProp="children"
              loading={isLoadingCondition}
              filterOption={filterOption}
              options={dataCondition?.map(({ name, id }) => ({
                value: id,
                label: name,
              }))}
            />
          </Form.Item>

          <Form.Item label="Keterangan Kondisi Kesehatan" name="description">
            <Input.TextArea rows={4} placeholder="Keterangan Kondisi Kesehatan (Opsional)" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              style={{
                width: '100%',
              }}
            >
              Lanjutkan
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default AttendanceFormModal;
