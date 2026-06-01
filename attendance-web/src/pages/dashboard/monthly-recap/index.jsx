import { useState } from 'react';
import { Typography, Card, Table, Select, Space, Tag } from 'antd';
import dayjs from 'dayjs';
import { getUser } from '@/utilities/authorization';
import useQueryFetch from '@/utilities/hooks/useQueryFetch';
import DefaultLoading from '@/components/DefaultLoading';

const { Title, Text } = Typography;
const { Option } = Select;

const OFFICE_START_TIME = '08:00:00';

function MonthlyRecap() {
  const user = getUser();
  const currentYear = dayjs().format('YYYY');
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // 1. Fetch seluruh data absensi berdasarkan UUID user kamu
  const { data: attendanceData = [], isLoading } = useQueryFetch({
    url: `/attendance?userId=${user?.uuid}`,
    enabled: Boolean(user?.uuid),
  });

  // 2. Daftar nama bulan untuk baris tabel (Januari - Desember)
  const monthsList = [
    { key: '01', name: 'Januari' },
    { key: '02', name: 'Februari' },
    { key: '03', name: 'Maret' },
    { key: '04', name: 'April' },
    { key: '05', name: 'Mei' },
    { key: '06', name: 'Juni' },
    { key: '07', name: 'Juli' },
    { key: '08', name: 'Agustus' },
    { key: '09', name: 'September' },
    { key: '10', name: 'Oktober' },
    { key: '11', name: 'November' },
    { key: '12', name: 'Desember' },
  ];

  // 3. Olah data absensi dari server menjadi format rekap bulanan secara real-time
  const dataSource = monthsList.map((monthObj, index) => {
    const monthlyData = attendanceData.filter((item) => {
      if (!item.date) return false;
      return (
        dayjs(item.date).format('MM') === monthObj.key &&
        dayjs(item.date).format('YYYY') === selectedYear
      );
    });

    const totalAttendance = monthlyData.length;

    const totalLate = monthlyData.filter(
      (item) => item.time > OFFICE_START_TIME
    ).length;

    const totalOnTime = monthlyData.filter(
      (item) => item.time <= OFFICE_START_TIME
    ).length;

    const totalSakit = monthlyData.filter(
      (item) => item?.condition?.name === 'Sakit'
    ).length;

    const disciplinePercentage =
      totalAttendance > 0
        ? Math.round((totalOnTime / totalAttendance) * 100)
        : 0;

    return {
      key: index,
      bulan: monthObj.name,
      total: totalAttendance,
      tepatWaktu: totalOnTime,
      telat: totalLate,
      sakit: totalSakit,
      persentase: disciplinePercentage,
    };
  });

  // 4. Konfigurasi kolom Tabel Ant Design
  const columns = [
    {
      title: 'Bulan',
      dataIndex: 'bulan',
      key: 'bulan',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Total Hadir',
      dataIndex: 'total',
      key: 'total',
      align: 'center',
    },
    {
      title: 'Tepat Waktu',
      dataIndex: 'tepatWaktu',
      key: 'tepatWaktu',
      align: 'center',
      render: (val) => <Text style={{ color: val > 0 ? '#52c41a' : 'inherit' }}>{val}</Text>,
    },
    {
      title: 'Telat',
      dataIndex: 'telat',
      key: 'telat',
      align: 'center',
      render: (val) => <Text style={{ color: val > 0 ? '#ff4d4f' : 'inherit' }}>{val}</Text>,
    },
    {
      title: 'Sakit / Izin',
      dataIndex: 'sakit',
      key: 'sakit',
      align: 'center',
    },
    {
      title: 'Tingkat Disiplin',
      dataIndex: 'persentase',
      key: 'persentase',
      align: 'center',
      render: (persen, record) => {
        if (record.total === 0) return <Tag color="default">Tidak Ada Data</Tag>;
        if (persen >= 90) return <Tag color="green">{persen}% (Sangat Disiplin)</Tag>;
        if (persen >= 70) return <Tag color="blue">{persen}% (Disiplin)</Tag>;
        if (persen >= 50) return <Tag color="orange">{persen}% (Cukup Disiplin)</Tag>;
        return <Tag color="red">{persen}% (Sering Telat)</Tag>;
      },
    },
  ];

  const yearOptions = Array.from({ length: 4 }, (_, i) => String(Number(currentYear) - i));

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ margin: 0 }}>
          Rekapitulasi Bulanan Kehadiran
        </Title>
        
        <Space>
          <Text strong>Tahun:</Text>
          <Select
            defaultValue={selectedYear}
            style={{ width: 120 }}
            onChange={(value) => setSelectedYear(value)}
          >
            {yearOptions.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        </Space>
      </div>

      <Card style={{ marginTop: 24 }} styles={{ body: { padding: 0 } }}>
        {isLoading ? (
          <div style={{ padding: 24 }}><DefaultLoading /></div>
        ) : (
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={false} 
            bordered
          />
        )}
      </Card>
    </>
  );
}

export default MonthlyRecap;