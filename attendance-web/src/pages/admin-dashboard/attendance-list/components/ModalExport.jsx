import { useMemo } from 'react';
import { Button, Col, Modal, Row, Typography } from 'antd';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const { Text } = Typography;

function ModalExport({ isOpen, onClose }) {
  const [params] = useSearchParams();
  const paramsObj = useMemo(() => Object.fromEntries(params.entries()), [params]);

  const handleExportCSV = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/all-users/attendance-export', {
        params: {
          typeExport: 'csv',
          employee_status_id: paramsObj.employee_status_id,
          squad_id: paramsObj.squad_id,
          q: paramsObj.q,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'attendance.csv'); // or .xlsx if you're using Excel
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error exporting file:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleExportXLSX = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/all-users/attendance-export', {
        params: {
          typeExport: 'xlsx',
          employee_status_id: paramsObj.employee_status_id,
          squad_id: paramsObj.squad_id,
          q: paramsObj.q,
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'user_attendance.xlsx';
      link.click();
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error exporting file:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <Modal
      title="Export Data Absensi"
      footer={null}
      centered
      open={isOpen}
      onCancel={onClose}
      destroyOnClose
      width={398}
    >
      <Text>Pilih export data sesuai kebutuhan</Text>
      <Row style={{ marginTop: 16 }} gutter={[8, 8]}>
        <Col>
          <Button size="large" onClick={handleExportCSV}>
            CSV
          </Button>
        </Col>
        <Col>
          <Button size="large" onClick={handleExportXLSX}>
            XLSX
          </Button>
        </Col>
      </Row>
    </Modal>
  );
}

export default ModalExport;
