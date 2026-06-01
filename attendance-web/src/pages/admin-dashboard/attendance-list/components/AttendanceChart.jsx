import { Card, Empty, Row, Col, Statistic, Progress } from 'antd';
import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    Cell,
    ResponsiveContainer,
} from 'recharts';
import useQueryFetch from '@/utilities/hooks/useQueryFetch';

function AttendanceChart() {
    const { data = [] } = useQueryFetch({
        url: '/all-users/attendance?limit=1000',
    });

    const totalAttendance = data.length;
    const OFFICE_START_TIME = '14:00:00';

    const totalLate = data.filter(
        (item) => item?.time > OFFICE_START_TIME,
    ).length;

    const totalOnTime = data.filter(
        (item) => item?.time <= OFFICE_START_TIME,
    ).length;

    const disciplinePercentage =
        totalAttendance > 0
            ? Number(
                ((totalOnTime / totalAttendance) * 100).toFixed(0),
            )
            : 0;

    const chartData = [
        {
            name: 'Tepat Waktu',
            value: totalOnTime,
        },
        {
            name: 'Telat',
            value: totalLate,
        },
    ];

    const COLORS = [
        '#52c41a',
        '#ff4d4f',
    ];

    return (
        <>
            <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={8}>
                    <Card
                        style={{
                            borderLeft: '5px solid #1677ff',
                        }}
                    >
                        <Statistic
                            title="Total Absen"
                            value={totalAttendance}
                        />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card
                        style={{
                            borderLeft: '5px solid #52c41a',
                        }}
                    >
                        <Statistic
                            title="Tepat Waktu"
                            value={totalOnTime}
                            valueStyle={{
                                color: '#52c41a',
                            }}
                        />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card
                        style={{
                            borderLeft: '5px solid #ff4d4f',
                        }}
                    >
                        <Statistic
                            title="Telat"
                            value={totalLate}
                            valueStyle={{
                                color: '#ff4d4f',
                            }}
                        />
                    </Card>
                </Col>
            </Row>

            <Card
                title="Tingkat Kedisiplinan"
                style={{ marginTop: 16 }}
            >
                <Progress
                    percent={disciplinePercentage}
                    status="active"
                />
            </Card>

            <Card
                title="Grafik Ketepatan Absensi"
                style={{ marginTop: 16 }}
            >
                {totalAttendance === 0 ? (
                    <Empty description="Belum ada data absensi" />
                ) : (
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={70}
                                outerRadius={120}
                                paddingAngle={0}
                                label={({ name, percent }) =>
                                    `${name} ${(percent * 100).toFixed(0)}%`
                                }
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={entry.name}
                                        fill={COLORS[index]}
                                    />
                                ))}
                            </Pie>

                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </Card>
        </>
    );
}

export default AttendanceChart;