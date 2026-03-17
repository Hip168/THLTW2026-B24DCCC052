import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Modal, Form, Input, InputNumber, Select, Space, message, Tag } from 'antd';
import { UserAddOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import BookingRepository from '@/services/booking/BookingRepository';
import { Employee } from '@/services/booking/types';

const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const load = () => setEmployees(BookingRepository.getEmployees());
  useEffect(() => { load(); }, []);

  const handleSave = (values: any) => {
    if (editingId) {
      BookingRepository.updateEmployee(editingId, values);
      message.success('Cập nhật thành công');
    } else {
      BookingRepository.addEmployee(values);
      message.success('Thêm nhân viên thành công');
    }
    setIsModalOpen(false);
    load();
  };

  const handleDelete = (id: string) => {
    BookingRepository.deleteEmployee(id);
    message.success('Đã xóa nhân viên');
    load();
  };

  const columns = [
    { title: 'Tên nhân viên', dataIndex: 'name', key: 'name', render: (t: string) => <span className="font-bold">{t}</span> },
    { title: 'Giới hạn khách/ngày', dataIndex: 'max_customers', key: 'max', align: 'center' as const },
    { title: 'Giờ làm việc', dataIndex: 'working_hours', key: 'hours', align: 'center' as const },
    { 
      title: 'Ngày làm việc', 
      dataIndex: 'working_days', 
      key: 'days',
      render: (days: string[]) => (
        <Space size={[0, 4]} wrap>
          {days.map(d => <Tag color="blue" key={d} className="rounded-md border-none lowercase font-medium">{d}</Tag>)}
        </Space>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: Employee) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => {
            setEditingId(record.id);
            form.setFieldsValue(record);
            setIsModalOpen(true);
          }} className="border-blue-100 text-blue-600 rounded-lg" />
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} className="rounded-lg" />
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <Card 
        title={<span className="text-xl font-bold text-gray-800">👥 Quản Lý Nhân Viên</span>}
        extra={<Button type="primary" icon={<UserAddOutlined />} onClick={() => {
          setEditingId(null);
          form.resetFields();
          setIsModalOpen(true);
        }} className="bg-blue-600 rounded-xl h-10 font-bold">Thêm Nhân Viên</Button>}
        className="shadow-xl rounded-2xl border-none"
      >
        <Table columns={columns} dataSource={employees} rowKey="id" pagination={{ pageSize: 6 }} />
      </Card>

      <Modal
        title={editingId ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className="rounded-2xl overflow-hidden"
      >
        <Form form={form} layout="vertical" onFinish={handleSave} className="p-2">
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true }]}>
            <Input className="rounded-lg h-10" />
          </Form.Item>
          <div className="flex gap-4">
            <Form.Item name="max_customers" label="Giới hạn khách/ngày" rules={[{ required: true }]} className="flex-1">
              <InputNumber min={1} className="w-full rounded-lg h-10 flex items-center" />
            </Form.Item>
            <Form.Item name="working_hours" label="Khung giờ (VD: 08:00-17:00)" rules={[{ required: true }]} className="flex-1">
              <Input className="rounded-lg h-10" />
            </Form.Item>
          </div>
          <Form.Item name="working_days" label="Ngày làm việc trong tuần" rules={[{ required: true }]}>
            <Select mode="multiple" className="w-full" placeholder="Chọn các ngày trong tuần">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                <Select.Option key={d} value={d}>{d}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" className="rounded-xl h-12 bg-blue-600 font-bold mt-4">Lưu Thông Tin</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default EmployeesPage;
