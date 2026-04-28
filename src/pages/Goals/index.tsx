import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Progress, Segmented, Button, Typography, InputNumber, message, Tag, Drawer, Form, Input, Select, DatePicker } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { GoalRecord } from './data';
import styles from './style.less';

const { Title, Text } = Typography;

const Goals: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<string | number>('all');
  const [data, setData] = useState<GoalRecord[]>([
    { id: '1', name: 'Giảm mỡ bụng', type: 'Giảm cân', currentValue: 2, targetValue: 5, deadline: '2024-05-01', status: 'active' },
    { id: '2', name: 'Chạy 5km', type: 'Sức bền', currentValue: 5, targetValue: 5, deadline: '2024-04-15', status: 'completed' },
  ]);

  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [form] = Form.useForm();

  const filteredData = data.filter(item => filterStatus === 'all' || item.status === filterStatus);

  const handleUpdateProgress = (id: string, value: number | null) => {
    if (value === null) return;
    const newData = data.map(item => {
      if (item.id === id) {
        const newStatus = value >= item.targetValue ? 'completed' : item.status;
        return { ...item, currentValue: value, status: newStatus };
      }
      return item;
    });
    setData(newData);
    message.success('Đã cập nhật tiến độ');
  };

  const handleAddGoal = () => {
    form.validateFields().then(values => {
      const formattedValues = {
        ...values,
        deadline: values.deadline.format('YYYY-MM-DD'),
      };
      setData([...data, { ...formattedValues, id: Date.now().toString(), status: 'active', currentValue: 0 }]);
      message.success('Đã thêm thành công');
      setIsDrawerVisible(false);
      form.resetFields();
    });
  };

  return (
    <PageContainer className={styles.container}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Segmented
          options={[
            { label: 'Tất cả', value: 'all' },
            { label: 'Đang thực hiện', value: 'active' },
            { label: 'Hoàn thành', value: 'completed' },
            { label: 'Thất bại', value: 'failed' },
          ]}
          value={filterStatus}
          onChange={setFilterStatus}
        />
        <Button type="primary" onClick={() => setIsDrawerVisible(true)}><PlusOutlined /> Thêm mục tiêu</Button>
      </div>

      <Drawer
        title="Thêm mục tiêu mới"
        width={400}
        onClose={() => setIsDrawerVisible(false)}
        visible={isDrawerVisible}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={() => setIsDrawerVisible(false)} style={{ marginRight: 8 }}>Hủy</Button>
            <Button onClick={handleAddGoal} type="primary">Thêm</Button>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên mục tiêu" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Giảm cân">Giảm cân</Select.Option>
              <Select.Option value="Tăng cơ">Tăng cơ</Select.Option>
              <Select.Option value="Sức bền">Sức bền</Select.Option>
              <Select.Option value="Khác">Khác</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="targetValue" label="Giá trị mục tiêu" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="deadline" label="Deadline" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Drawer>

      <Row gutter={[16, 16]}>
        {filteredData.map(goal => (
          <Col xs={24} sm={12} md={8} lg={6} key={goal.id}>
            <Card hoverable className={styles.goalCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Title level={5} style={{ margin: 0 }}>{goal.name}</Title>
                <Tag color={goal.status === 'completed' ? 'green' : goal.status === 'failed' ? 'red' : 'blue'}>
                  {goal.status}
                </Tag>
              </div>
              <Text type="secondary">{goal.type} | Deadline: {goal.deadline}</Text>
              
              <div style={{ marginTop: 16, marginBottom: 8 }}>
                <Progress percent={Math.round((goal.currentValue / goal.targetValue) * 100)} status={goal.status === 'completed' ? 'success' : 'active'} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text>Tiến độ: </Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <InputNumber
                    min={0}
                    value={goal.currentValue}
                    onChange={(value) => handleUpdateProgress(goal.id, value)}
                    size="small"
                  />
                  <Text> / {goal.targetValue}</Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </PageContainer>
  );
};

export default Goals;
