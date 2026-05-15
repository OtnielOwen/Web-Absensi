import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Space, Typography, Input, Select } from 'antd';
import { Link } from 'react-router-dom';
import { FORM } from '@/utilities/constant';
import axios from "axios";

const { Title, Text } = Typography;

function RegisterPage() {
  const [squads, setSquads] = useState([]);
  const [employeeStatuses, setEmployeeStatuses] = useState([]);

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const squadRes = await axios.get("http://localhost:5000/api/v1/squad");
        const squadData = Array.isArray(squadRes.data) ? squadRes.data : squadRes.data.data || [];
        setSquads(squadData.map(item => ({
          label: item.name,
          value: item.id
        })));

        const statusRes = await axios.get("http://localhost:5000/api/v1/employee-status");
        const statusData = Array.isArray(statusRes.data) ? statusRes.data : statusRes.data.data || [];
        setEmployeeStatuses(statusData.map(item => ({
          label: item.name,
          value: item.id
        })));
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const onFinish = async (values) => {
    try {
      await axios.post(
        "http://localhost:5000/api/v1/user/create",
        values
      );
      alert("Register berhasil!");
    } catch (err) {
      alert(err.response?.data?.message || "Register gagal!");
    }
  };

  return (
    <>
      <Space direction="vertical" size="small">
        <Title style={{ margin: 'auto' }} level={2}>
          Buat Akun
        </Title>
        <Text>Buat akun untuk melakukan absensi kehadiran</Text>
      </Space>

      <Form
        layout="vertical"
        style={{ marginTop: 16 }}
        validateMessages={FORM.VALIDATE_MESSAGE}
        onFinish={onFinish}
      >
        <Form.Item label="Nama Lengkap" name="name" rules={[{ required: true }]}>
          <Input size="large" placeholder="Masukan Nama Lengkap" />
        </Form.Item>

        <Form.Item label="Nomer Induk Karyawan" name="nik" rules={[{ required: true }]}>
          <Input size="large" placeholder="Masukan NIK" />
        </Form.Item>

        <Form.Item label="Squad" name="squadId" rules={[{ required: true }]}>
          <Select
            size="large"
            showSearch
            placeholder="Pilih Squad"
            optionFilterProp="children"
            filterOption={filterOption}
            options={squads}
          />
        </Form.Item>

        <Form.Item label="Status Pegawai" name="employeeStatusId" rules={[{ required: true }]}>
          <Select
            size="large"
            showSearch
            placeholder="Pilih Status Pegawai"
            optionFilterProp="children"
            filterOption={filterOption}
            options={employeeStatuses}
          />
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input size="large" placeholder="Masukan email" />
        </Form.Item>

        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input.Password size="large" placeholder="Masukan password" />
        </Form.Item>

        <Form.Item label="Konfirmasi Password" name="confirmPassword" rules={[{ required: true }]}>
          <Input.Password size="large" placeholder="Masukan password" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            style={{ width: '100%' }}
          >
            Buat Akun
          </Button>
        </Form.Item>
      </Form>

      <Row justify="space-between" align="middle">
        <Col>
          <Text>
            Sudah punya akun?{' '}
            <Link to="/login" style={{ color: 'var(--ant-color-primary)' }}>
              Masuk
            </Link>
          </Text>
        </Col>
      </Row>
    </>
  );
}

export default RegisterPage;