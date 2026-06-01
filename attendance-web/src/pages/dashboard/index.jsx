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

import UserAttendanceSummary from '../admin-dashboard/users/components/UserAttendanceSummary';

const { Title, Text } = Typography;
const OFFICE_START_TIME = '08:00:00';

function DashboardPage() {
  const { md, lg } = Grid.useBreakpoint();
  const navigate = useNavigate();
  const user = getUser();

  console.log(user);

  const [selectedPeriod, setSelectedPeriod] = useState({
    month: dayjs().format('MM'),
    year: dayjs().format('YYYY'),
  });

  const [calendarMode, setCalendarMode] = useState('month');

  const { data: attendanceData = [], isLoading } = useQueryFetch({
    url: `/attendance?userId=${user?.uuid}`,
    enabled: Boolean(user?.uuid),
  });

  const handleMonthSelect = (date) => {
    const month = date?.format('MM');
    const year = date?.format('YYYY');

    setSelectedPeriod({
      month,
      year,
    });
  };

  const handlePanelChange = (date, mode) => {
    setCalendarMode(mode);
    setSelectedPeriod({
      month: date?.format('MM'),
      year: date?.format('YYYY'),
    });
  };

  const dateCellRender = (current) => {
    const attendanceForDate = attendanceData?.filter((attendance) =>
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

  const monthCellRender = (current) => {
    const currentMonth = current.format('MM');
    const currentYear = current.format('YYYY');

    const monthlyData = attendanceData.filter((item) => {
      if (!item.date) return false;
      return (
        dayjs(item.date).format('MM') === currentMonth &&
        dayjs(item.date).format('YYYY') === currentYear
      );
    });

    const total = monthlyData.length;
    const totalLate = monthlyData.filter((item) => item.time > OFFICE_START_TIME).length;
    const totalOnTime = total - totalLate;

    if (total === 0) {
      return <div style={{ marginTop: 8, color: '#bfbfbf', fontSize: 12 }}>Tidak ada data</div>;
    }

    return (
      <div style={{ marginTop: 8, fontSize: 12, textAlign: 'left', paddingLeft: 8 }}>
        <div style={{ color: '#1677ff' }}>Hadir: <b>{total}</b></div>
        <div style={{ color: '#52c41a' }}>Tepat: <b>{totalOnTime}</b></div>
        <div style={{ color: '#ff4d4f' }}>Telat: <b>{totalLate}</b></div>
      </div>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    if (info.type === 'month') return monthCellRender(current);

    return info.originNode;
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

      <UserAttendanceSummary
        userId={user?.uuid}
        month={selectedPeriod.month}
        year={selectedPeriod.year}
      />

      <Card style={{ marginTop: 16 }}>
        {isLoading ? (
          <DefaultLoading />
        ) : (
          <div>
            <Title style={{ margin: 'auto' }} level={4}>
              Kalender Absensi
            </Title>

            <div className={calendarMode === 'month' ? 'hide-calendar-year' : ''}>
              <style>{`
                .hide-calendar-year .ant-picker-calendar-year-select {
                  display: none !important;
                }
              `}</style>
              <Calendar
                locale={{ month: 'Day', year: 'Month' }}
                value={dayjs(`${selectedPeriod.year}-${selectedPeriod.month}-01`)}
                cellRender={cellRender}
                mode={calendarMode}
                onSelect={handleMonthSelect}
                onPanelChange={handlePanelChange}
              />
            </div>
          </div>
        )}
      </Card>
    </>
  );
}

export default DashboardPage;