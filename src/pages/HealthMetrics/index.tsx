import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tag, Popconfirm, message, Button, Table, Modal, Form, InputNumber, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { HealthMetricRecord } from './data';
import styles from './style.less';

const HealthMetrics: React.FC = () => {
  const [data, setData] = useState<HealthMetricRecord[]>([
    { id: '1', date: '2024-03-01', weight: 70, height: 175, heartRate: 72, sleepHours: 8 },
    { id: '2', date: '2024-03-02', weight: 70.5, height: 175, heartRate: 75, sleepHours: 7 },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HealthMetricRecord | null>(null);
  const [form] = Form.useForm();

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id));
    message.success('Đã xóa thành công');
  };

  const getBmiColor = (bmi: number) => {
    if (bmi < 18.5) return 'blue';
    if (bmi < 25) return 'green';
    if (bmi < 30) return 'yellow';
    return 'red';
  };

  const showModal = (record?: HealthMetricRecord) => {
    setEditingRecord(record || null);
    if (record) {
      form.setFieldsValue({
        ...record,
        date: moment(record.date),
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        date: values.date.format('YYYY-MM-DD'),
      };
      
      if (editingRecord) {
        setData(data.map(item => item.id === editingRecord.id ? { ...item, ...formattedValues } : item));
        message.success('Đã sửa thành công');
      } else {
        setData([...data, { ...formattedValues, id: Date.now().toString() }]);
        message.success('Đã thêm thành công');
      }
      setIsModalVisible(false);
    });
  };

  const columns = [
    { title: 'Ngày', dataIndex: 'date', key: 'date', sorter: (a: HealthMetricRecord, b: HealthMetricRecord) => new Date(a.date).getTime() - new Date(b.date).getTime() },
    { title: 'Cân nặng (kg)', dataIndex: 'weight', key: 'weight' },
    { title: 'Chiều cao (cm)', dataIndex: 'height', key: 'height' },
    {
      title: 'BMI',
      key: 'bmi',
      render: (_: any, record: HealthMetricRecord) => {
        const bmi = record.weight / Math.pow(record.height / 100, 2);
        return <Tag color={getBmiColor(bmi)}>{bmi.toFixed(1)}</Tag>;
      },
    },
    { title: 'Nhịp tim (bpm)', dataIndex: 'heartRate', key: 'heartRate' },
    { title: 'Giờ ngủ (h)', dataIndex: 'sleepHours', key: 'sleepHours' },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: HealthMetricRecord) => (
        <>
          <Button type="link" onClick={() => showModal(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc chắn xóa?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>Xóa</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <PageContainer className={styles.container}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button type="primary" onClick={() => showModal()}><PlusOutlined /> Thêm mới</Button>
      </div>
      <Table 
        rowKey="id"
        dataSource={data}
        columns={columns}
      />
      
      <Modal
        title={editingRecord ? "Sửa chỉ số" : "Thêm chỉ số"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="height" label="Chiều cao (cm)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="heartRate" label="Nhịp tim (bpm)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="sleepHours" label="Giờ ngủ (h)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default HealthMetrics;
