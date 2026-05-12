import { useState } from 'react';
import {
  Button,
  Typography,
  Card,
  Row,
  Col,
  Space,
  Calendar,
  Avatar,
  Image,
  Grid,
  Badge,
} from 'antd';
import dayjs from 'dayjs';

import { useNavigate } from 'react-router-dom';
import UserFallback from '@/assets/images/user-fallback.jpg';
import DefaultLoading from '@/components/DefaultLoading';
import { getUser } from '@/utilities/authorization';
import useQueryFetch from '@/utilities/hooks/useQueryFetch';

import { Upload, message } from 'antd';
import axios from 'axios';
import CONSTANT from '@/utilities/constant';

const { Title, Text } = Typography;

function DashboardPage() {
  const { md, lg } = Grid.useBreakpoint();
  const navigate = useNavigate();
  const user = getUser();

  const [selectedPeriod, setSelectedPeriod] = useState({
    month: dayjs().format('MM'),
    year: dayjs().format('YYYY'),
  });

  const { data, isLoading } = useQueryFetch({
    url: '/attendance-period',
    params: {
      month: selectedPeriod.month,
      year: selectedPeriod.year,
    },
  });

  const handleMonthSelect = (date) => {
    const month = date?.format('MM');
    const year = date?.format('YYYY');

    setSelectedPeriod({
      month,
      year,
    });
  };

  const dateCellRender = (current) => {
    const attendanceForDate = data?.filter((attendance) =>
      dayjs(attendance.date).isSame(current, 'day')
    );

    const renderStatusCondition = (condition) => {
      switch (condition) {
        case 'Sakit':
          return 'error';

        case 'Kurang Fit':
          return '#faad14';

        default:
          return '#52c41a';
      }
    };

    return (
      <Row align="middle" style={{ height: '100%' }}>
        {attendanceForDate?.map((attendance) => (
          <Col span={24} key={attendance.id}>
            <Badge
              count={attendance?.condition?.name}
              color={renderStatusCondition(attendance?.condition?.name)}
              text={
                <Space direction="vertical">
                  <Text>
                    {attendance?.workingStatus?.name}, ({attendance?.time}){' '}
                    <Text>{attendance?.description && `- (${attendance?.description})`}</Text>
                  </Text>
                </Space>
              }
            />
          </Col>
        ))}
      </Row>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);

    return info.originNode;
  };

  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      const formData = new FormData();

      formData.append('photo', file);

      const token = localStorage.getItem('access_token');

      const res = await fetch('http://localhost:5000/api/v1/user/profile-photo', {
        method: 'PUT',
        headers: {
          'x-auth-token': token,
        },
        body: formData,
      });

      const data = await res.json();

      console.log(data);

      alert('Foto profile berhasil diupload');

      const updatedUser = {
        ...user,
        photoProfile: data?.data?.photoProfile,
      };

      localStorage.setItem('user_attributes', JSON.stringify(updatedUser));

      window.location.reload();
    } catch (error) {
      console.error(error);

      alert('Upload gagal');
    }
  };

  return (
    <>
      <Title level={3} style={{ margin: 'auto' }}>
        Dashboard
      </Title>

      <Row gutter={[16, 16]} style={{ marginTop: 36 }}>
        <Col span={24} md={12} xxl={8}>
          <Card>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
                minHeight: 140,
              }}
            >
              <Space
                size={md ? 'large' : 'small'}
                direction={!lg && 'vertical'}
                style={{
                  position: 'relative',
                  width: !md && '100%',
                }}
              >
                <Row align="middle" style={{ flexDirection: 'column' }}>
                  <div>
                    <Avatar
                      size={128}
                      src={
                        <Image
                          src={
                            user?.photoProfile
                              ? `http://localhost:5000/uploads/profile/${user.photoProfile}`
                              : UserFallback
                          }
                          fallback={UserFallback}
                        />
                      }
                      style={{ marginTop: '-24px', top: '-1rem', left: 0 }}
                    />
                  </div>

                  <Upload
                    showUploadList={false}
                    customRequest={async ({ file }) => {
                      try {
                        const formData = new FormData();

                        formData.append('photo', file);

                        const response = await axios.put(
                          'http://localhost:5000/api/v1/user/profile-photo',
                          formData,
                          {
                            headers: {
                              'Content-Type': 'multipart/form-data',
                              'x-auth-token': localStorage.getItem(CONSTANT.ACCESS_TOKEN),
                            },
                          }
                        );

                        const oldUser = JSON.parse(
                          localStorage.getItem(CONSTANT.USER_ATTRIBUTES)
                        );

                        const updatedUser = {
                          ...oldUser,
                          photoProfile: response.data.data.photoProfile,
                        };

                        localStorage.setItem(
                          CONSTANT.USER_ATTRIBUTES,
                          JSON.stringify(updatedUser)
                        );

                        message.success('Foto profile berhasil diupload');

                        window.location.reload();
                      } catch (error) {
                        console.log(error);

                        message.error('Upload foto gagal');
                      }
                    }}
                  >
                    <Button>Ganti Foto</Button>
                  </Upload>
                </Row>

                <Space direction="vertical">
                  <Title style={{ margin: 'auto' }} level={3}>
                    {user?.name}
                  </Title>

                  <Text strong>{user?.email}</Text>

                  <Space>
                    <Text level={3}>{user?.squad}</Text>-
                    <Text level={3}>{user?.status}</Text>
                  </Space>
                </Space>
              </Space>
            </div>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
                minHeight: 140,
              }}
            >
              <Col>
                <Title style={{ margin: 'auto' }} level={4}>
                  Sudahkah anda absen hari ini?
                </Title>
              </Col>

              <Col>
                <Button
                  onClick={() => navigate('./attendance')}
                  style={{ marginTop: 16 }}
                  size="large"
                >
                  Absensi
                </Button>
              </Col>
            </div>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
                minHeight: 140,
              }}
            >
              <Col>
                <Title style={{ margin: 'auto' }} level={4}>
                  Album Wajah
                </Title>

                <Text>
                  Upload foto wajah anda agar sistem kami dapat mendeteksi wajah pribadi anda
                </Text>
              </Col>

              <Col>
                <Button
                  onClick={() => navigate('./facegallery')}
                  style={{ marginTop: 16 }}
                  size="large"
                >
                  Upload
                </Button>
              </Col>
            </div>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 16 }}>
        {isLoading ? (
          <DefaultLoading />
        ) : (
          <div>
            <Title style={{ margin: 'auto' }} level={4}>
              Kalender Absensi
            </Title>

            <Calendar
              cellRender={cellRender}
              mode="month"
              onSelect={handleMonthSelect}
            />
          </div>
        )}
      </Card>
    </>
  );
}

export default DashboardPage;