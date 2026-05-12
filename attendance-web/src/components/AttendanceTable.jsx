import { Card, Typography } from 'antd';
import dayjs from 'dayjs';
import ForwardTableGeneric from './TableGeneric';
import 'dayjs/locale/id';

const { Text } = Typography;

function AttendanceTable({
  dataSourceUrl,
  isRefetch,
  isActionRow = true,
  columnName = [],
  ...props
}) {
  return (
    <Card style={{ marginTop: 16 }}>
      <ForwardTableGeneric
        {...props}
        isRefetch={isRefetch}
        dataSourceUrl={dataSourceUrl}
        isSearch
        columns={[
          ...(columnName ? columnName.map((item, index) => ({ key: index, ...item })) : []),
          {
            title: 'Status',
            dataIndex: ['condition', 'name'],
            key: 'status',
          },

          {
            title: 'Keterangan',
            dataIndex: 'description',
            key: 'description',
          },
          {
            title: 'Kerja',
            dataIndex: ['workingStatus', 'name'],
            key: 'work',
          },
          {
            title: 'Hari',
            dataIndex: 'date',
            key: 'date',
            render: (_, record) => {
              const estimateDay = dayjs(record.date).locale('id').format('dddd');
              return <Text>{estimateDay}</Text>;
            },
          },
          {
            title: 'Waktu',
            dataIndex: 'time',
            key: 'time',
          },
          {
            title: 'Tanggal',
            dataIndex: 'date',
            key: 'date',
          },
          {
            title: 'Bulan',
            dataIndex: 'date',
            key: 'date',
            render: (_, record) => {
              const estimateMonth = dayjs(record.date).locale('id').format('MMMM');
              return <Text>{estimateMonth}</Text>;
            },
          },

          {
            width: '30%',
            title: 'Alamat Lokasi',
            dataIndex: ['location', 'address'],
            key: 'address',
          },
          // isActionRow && {
          //   title: '',
          //   key: 'action',
          //   width: 56,
          // },
        ]}
      />
    </Card>
  );
}

export default AttendanceTable;
