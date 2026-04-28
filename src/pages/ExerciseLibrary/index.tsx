import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Tag, Button, Modal, Typography, Select, Space, Popconfirm, message, Form, Input, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ExerciseRecord } from './data';
import styles from './style.less';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const ExerciseLibrary: React.FC = () => {
  const [data, setData] = useState<ExerciseRecord[]>([
    { id: '1', name: 'Hít đất', muscleGroup: 'Ngực', level: 'Trung bình', caloriesPerHour: 400, instructions: '1. Đặt hai tay rộng bằng vai\n2. Hạ người xuống\n3. Đẩy lên' },
    { id: '2', name: 'Squat', muscleGroup: 'Chân', level: 'Dễ', caloriesPerHour: 450, instructions: '1. Đứng rộng bằng vai\n2. Hạ hông xuống\n3. Đứng thẳng lên' },
  ]);

  const [filterMuscle, setFilterMuscle] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const [selectedExercise, setSelectedExercise] = useState<ExerciseRecord | null>(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ExerciseRecord | null>(null);
  const [form] = Form.useForm();

  const filteredData = data.filter(item => 
    (filterMuscle === 'all' || item.muscleGroup === filterMuscle) &&
    (filterLevel === 'all' || item.level === filterLevel)
  );

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id));
    message.success('Đã xóa thành công');
  };

  const showModal = (record?: ExerciseRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingRecord(record || null);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingRecord) {
        setData(data.map(item => item.id === editingRecord.id ? { ...item, ...values } : item));
        message.success('Đã sửa thành công');
      } else {
        setData([...data, { ...values, id: Date.now().toString() }]);
        message.success('Đã thêm thành công');
      }
      setIsModalVisible(false);
    });
  };

  const getLevelColor = (level: string) => {
    if (level === 'Dễ') return 'green';
    if (level === 'Trung bình') return 'orange';
    return 'red';
  };

  return (
    <PageContainer className={styles.container}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <Space>
          <Select value={filterMuscle} onChange={setFilterMuscle} style={{ width: 150 }}>
            <Option value="all">Tất cả nhóm cơ</Option>
            <Option value="Ngực">Ngực</Option>
            <Option value="Chân">Chân</Option>
            <Option value="Lưng">Lưng</Option>
            <Option value="Tay">Tay</Option>
          </Select>
          <Select value={filterLevel} onChange={setFilterLevel} style={{ width: 150 }}>
            <Option value="all">Tất cả mức độ</Option>
            <Option value="Dễ">Dễ</Option>
            <Option value="Trung bình">Trung bình</Option>
            <Option value="Khó">Khó</Option>
          </Select>
        </Space>
        
        <Button type="primary" onClick={(e) => showModal(undefined, e as unknown as React.MouseEvent)}><PlusOutlined /> Thêm bài tập</Button>
      </div>

      <Row gutter={[16, 16]}>
        {filteredData.map(exercise => (
          <Col xs={24} sm={12} md={8} key={exercise.id}>
            <Card 
              hoverable 
              className={styles.exerciseCard}
              onClick={() => {
                setSelectedExercise(exercise);
                setIsDetailVisible(true);
              }}
              actions={[
                <EditOutlined key="edit" onClick={e => showModal(exercise, e)} />,
                <Popconfirm 
                  key="delete" 
                  title="Xóa bài tập này?" 
                  onConfirm={(e) => {
                    e?.stopPropagation();
                    handleDelete(exercise.id);
                  }}
                  onCancel={e => e?.stopPropagation()}
                >
                  <DeleteOutlined style={{ color: 'red' }} onClick={e => e.stopPropagation()} />
                </Popconfirm>,
              ]}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <Title level={5} style={{ margin: 0 }}>{exercise.name}</Title>
                <Tag color={getLevelColor(exercise.level)}>{exercise.level}</Tag>
              </div>
              <Text type="secondary">Nhóm cơ: {exercise.muscleGroup}</Text>
              <br />
              <Text type="secondary">Calo: {exercise.caloriesPerHour} kcal/h</Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={editingRecord ? "Sửa bài tập" : "Thêm bài tập"}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên bài tập" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="muscleGroup" label="Nhóm cơ" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Ngực">Ngực</Select.Option>
              <Select.Option value="Chân">Chân</Select.Option>
              <Select.Option value="Lưng">Lưng</Select.Option>
              <Select.Option value="Tay">Tay</Select.Option>
              <Select.Option value="Bụng">Bụng</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="level" label="Mức độ" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="Dễ">Dễ</Select.Option>
              <Select.Option value="Trung bình">Trung bình</Select.Option>
              <Select.Option value="Khó">Khó</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="caloriesPerHour" label="Calo/giờ" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="instructions" label="Hướng dẫn" rules={[{ required: true }]}>
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={selectedExercise?.name}
        visible={isDetailVisible}
        onCancel={() => setIsDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedExercise && (
          <div>
            <Space style={{ marginBottom: 16 }}>
              <Tag color="blue">{selectedExercise.muscleGroup}</Tag>
              <Tag color={getLevelColor(selectedExercise.level)}>{selectedExercise.level}</Tag>
              <Tag color="purple">{selectedExercise.caloriesPerHour} kcal/h</Tag>
            </Space>
            <Title level={5}>Hướng dẫn thực hiện:</Title>
            <Paragraph style={{ whiteSpace: 'pre-line' }}>
              {selectedExercise.instructions}
            </Paragraph>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default ExerciseLibrary;
