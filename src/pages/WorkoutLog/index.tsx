import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Tag, Popconfirm, message, Button, Table, Modal, Form, Input, Select, InputNumber, DatePicker } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { WorkoutRecord } from './data';
import styles from './style.less';

const { TextArea } = Input;

const WorkoutLog: React.FC = () => {
  const [data, setData] = useState<WorkoutRecord[]>([
    { id: '1', date: '2024-03-01', type: 'Cardio', duration: 30, calories: 300, note: 'Chạy bộ', status: 'completed' },
    { id: '2', date: '2024-03-02', type: 'HIIT', duration: 45, calories: 500, note: 'Tập cường độ cao', status: 'missed' },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WorkoutRecord | null>(null);
  const [form] = Form.useForm();

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id));
    message.success('Đã xóa thành công');
  };

  const showModal = (record?: WorkoutRecord) => {
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
    { title: 'Ngày', dataIndex: 'date', key: 'date', sorter: (a: WorkoutRecord, b: WorkoutRecord) => new Date(a.date).getTime() - new Date(b.date).getTime() },
    { title: 'Loại bài tập', dataIndex: 'type', key: 'type' },
    { title: 'Thời lượng (phút)', dataIndex: 'duration', key: 'duration' },
    { title: 'Calo (kcal)', dataIndex: 'calories', key: 'calories' },
    { title: 'Ghi chú', dataIndex: 'note', key: 'note' },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: WorkoutRecord) => (
        <Tag color={record.status === 'completed' ? 'green' : 'red'}>
          {record.status === 'completed' ? 'Hoàn thành' : 'Bỏ lỡ'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: WorkoutRecord) => (
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
        title={editingRecord ? "Sửa buổi tập" : "Thêm buổi tập"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="type" label="Loại bài tập" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Cardio">Cardio</Select.Option>
              <Select.Option value="Strength">Strength</Select.Option>
              <Select.Option value="Yoga">Yoga</Select.Option>
              <Select.Option value="HIIT">HIIT</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="calories" label="Calo (kcal)" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="completed">Hoàn thành</Select.Option>
              <Select.Option value="missed">Bỏ lỡ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default WorkoutLog;
