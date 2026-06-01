import { Card, Col, Progress, Row, Statistic, Tag } from 'antd';
import useQueryFetch from '@/utilities/hooks/useQueryFetch';
import dayjs from 'dayjs';

const OFFICE_START_TIME = '14:00:00';

function UserAttendanceSummary({ userId, month, year }) {
  const { data: attendanceData = [] } = useQueryFetch({
    url: `/attendance?userId=${userId}`,
    enabled: Boolean(userId),
  });

  const filteredAttendance = attendanceData.filter((item) => {
    if (!item.date) return false;

    const itemMonth = dayjs(item.date).format('MM');
    const itemYear = dayjs(item.date).format('YYYY');

    return itemMonth === month && itemYear === year;
  });

  const totalAttendance = filteredAttendance.length;

  const totalLate = filteredAttendance.filter(
    (item) => item.time > OFFICE_START_TIME,
  ).length;

  const totalOnTime = filteredAttendance.filter(
    (item) => item.time <= OFFICE_START_TIME,
  ).length;


  const disciplinePercentage =
    totalAttendance > 0
      ? Math.round((totalOnTime / totalAttendance) * 100)
      : 0;

  const getStatus = () => {
    if (totalAttendance === 0) {
      return {
        text: 'Tidak Ada Data',
        color: 'default',
      };
    }

    if (disciplinePercentage >= 90) {
      return { text: 'Sangat Disiplin', color: 'green' };
    }
    if (disciplinePercentage >= 70) {
      return { text: 'Disiplin', color: 'blue' };
    }
    if (disciplinePercentage >= 50) {
      return { text: 'Cukup Disiplin', color: 'orange' };
    }
    return { text: 'Sering Telat', color: 'red' };
  };

  const status = getStatus();

  return (
    <Card
      title="Ringkasan Kedisiplinan Pegawai"
      style={{ marginTop: 16 }}
    >
      <Row gutter={16}>
        <Col span={8}>
          <Statistic title="Total Absensi" value={totalAttendance} />
        </Col>

        <Col span={8}>
          <Statistic
            title="Tepat Waktu"
            value={totalOnTime}
            valueStyle={{ color: '#52c41a' }}
          />
        </Col>

        <Col span={8}>
          <Statistic
            title="Telat"
            value={totalLate}
            valueStyle={{ color: '#ff4d4f' }}
          />
        </Col>
      </Row>

      <div style={{ marginTop: 24 }}>
        <h4>Tingkat Kedisiplinan</h4>

        <Progress percent={disciplinePercentage} status="active" />

        <Tag
          color={status.color}
          style={{
            marginTop: 12,
            fontSize: 14,
            padding: '4px 12px',
          }}
        >
          {status.text}
        </Tag>
      </div>
    </Card>
  );
}

export default UserAttendanceSummary;