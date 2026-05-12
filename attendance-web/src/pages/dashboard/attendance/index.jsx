import { useEffect, useState } from 'react';
import { Button, Typography, Card, Row, Col, Result, notification, Spin } from 'antd';
import Lottie from 'react-lottie';
import Face from '@/assets/lottie/face.json';
import AttendanceTable from '@/components/AttendanceTable';
import DefaultLoading from '@/components/DefaultLoading';
import useQueryFetch from '@/utilities/hooks/useQueryFetch';
import AttendanceFaceRecognitionModal from './components/AttendanceFaceRecognitionModal';
import AttendanceFormModal from './components/AttendanceFormModal';
import 'dayjs/locale/id';

const { Title, Text } = Typography;

function AttendancePage() {
  const [location, setLocation] = useState({ latitude: '', longtitude: '' });
  const [formValues, setFormValues] = useState({});
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isOpenFaceRecognition, setIsOpenFaceRecognition] = useState(false);
  const [isSuccessFaceRecognition, setIsSuccessFaceRecognition] = useState(false);
  const [alreadyChecked, setAlreadyChecked] = useState(null);

  const { data, isLoading } = useQueryFetch({
    url: '/attendance-check',
    onError({ response }) {
      setAlreadyChecked(response?.data);
    },
  });

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Face,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const onFormAttendance = () => {
    setIsOpenForm(true);
    setIsSuccessFaceRecognition(false);
  };

  const onFinishFormAttendance = (values) => {
    setFormValues(values);
    setTimeout(() => {
      setIsOpenFaceRecognition(true);
    }, 100);
  };

  const onSuccessAttendance = () => {
    setIsOpenForm(false);
    setIsOpenFaceRecognition(false);
    setIsSuccessFaceRecognition(true);
    setFormValues(null);
    window.location.reload();
  };

  const onCloseFormModal = () => {
    setIsOpenForm(false);
  };

  useEffect(() => {
    if (data?.type === 'weekend') {
      notification.warning({
        message: 'Warning',
        description: 'Absensi dapat digunakan di hari kerja',
        placement: 'top',
      });
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setLocation({
          latitude,
          longitude,
        });
      });
    } else {
      notification.error({
        message: 'Error',
        description: 'Geolocation is not available in your browser',
        placement: 'top',
      });
    }
  }, [data]);

  useEffect(() => {
    if (alreadyChecked && !location.latitude && !location.longtitude) {
      notification.warning({
        message: 'Warning',
        description: 'Untuk melakukan absen anda harus mengaktifkan lokasi',
        placement: 'top',
      });
    }
  }, [JSON.stringify(location)]);

  return (
    <>
      <Title level={3} style={{ margin: 'auto' }}>
        Absensi
      </Title>

      <Row gutter={[16, 16]} style={{ marginTop: 36 }}>
        <Col span={24} md={12} xxl={8}>
          <Card>
            <Spin spinning={isLoading}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexDirection: 'column',
                  minHeight: 220,
                }}
              >
                <Col>
                  <Title style={{ margin: 'auto' }} level={4}>
                    Absensi Wajah
                  </Title>
                  <Text>Scan wajah Anda agar sistem kami dapat melakukan kehadiran</Text>
                </Col>

                {alreadyChecked?.success !== false ? (
                  <Col>
                    <Lottie options={defaultOptions} height={100} width={200} />
                  </Col>
                ) : (
                  <Col>
                    <Result
                      status="success"
                      title="Absensi Berhasil"
                      subTitle="Terimakasih hari ini anda sudah melakukan absensi."
                    />
                  </Col>
                )}

                {alreadyChecked?.success !== false && (
                  <Col>
                    <Button
                      onClick={onFormAttendance}
                      type="primary"
                      size="large"
                      style={{
                        width: '100%',
                      }}
                      disabled={!location.latitude && !location.longtitude}
                    >
                      {alreadyChecked?.success === false ? 'Sudah Absen' : 'Mulai Absen'}
                    </Button>
                  </Col>
                )}
              </div>
            </Spin>
          </Card>
        </Col>
      </Row>

      <AttendanceTable isRefetch={isSuccessFaceRecognition} dataSourceUrl="/attendance" />

      <AttendanceFormModal
        isOpen={isOpenForm}
        onClose={onCloseFormModal}
        onFinish={onFinishFormAttendance}
      />
      <AttendanceFaceRecognitionModal
        isOpen={isOpenFaceRecognition}
        setIsOpen={setIsOpenFaceRecognition}
        values={formValues}
        onSuccessAttendance={onSuccessAttendance}
        location={location}
        onCloseFormModal={onCloseFormModal}
      />
    </>
  );
}

export default AttendancePage;
