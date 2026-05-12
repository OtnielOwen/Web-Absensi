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
                style={{ position: 'relative', width: !md && '100%' }}
              >
                <Row align="middle" style={{ flexDirection: 'column' }}>
                  <div>
                    <Avatar
                      size={128}
                      src={<Image src={user?.imageUrl?.[0]?.url} fallback={UserFallback} />}
                      style={{ marginTop: '-24px', top: '-1rem', left: 0 }}
                    />
                  </div>

                  <Button>Ganti Foto </Button>
                </Row>
                <Space direction="vertical">
                  <Title style={{ margin: 'auto' }} level={3}>
                    {user?.name}
                  </Title>
                  <Text strong>{user?.email}</Text>
                  <Space>
                    <Text level={3}>{user?.squad}</Text>-<Text level={3}>{user?.status}</Text>
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
            <Calendar cellRender={cellRender} mode="month" onSelect={handleMonthSelect} />
          </div>
        )}
      </Card>
    </>
  );
}

export default DashboardPage;
