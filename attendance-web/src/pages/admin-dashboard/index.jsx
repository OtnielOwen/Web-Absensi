import { Card, Col, Row, Typography } from 'antd';

const { Title, Text } = Typography;

function AdminDashboard() {
  return (
    <Card style={{ marginTop: 16 }}>
      <Row gutter={[16, 16]}>
        <Col>
          <Title style={{ margin: 'auto' }} level={3}>
            Selamat Datang di <br /> Dashboard Monitoring Absensi
          </Title>
          <Text>
            Absensi adalah data penting dalam setiap kegiatan di suatu organisasi. Ini digunakan
            untuk mengetahui dan melacak kehadiran karyawan, siswa, dan orang lain yang terkait.
            Kantor, perusahaan, dan institusi pendidikan semuanya menggunakan absensi sebagai alat
            yang membantu organisasi untuk mendapatkan data kehadiran secara otomatis dan akurat,
            yang memudahkan evaluasi kinerja karyawan.
          </Text>
        </Col>
      </Row>
    </Card>
  );
}

export default AdminDashboard;
