import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Modal, Form, Input, InputNumber, Space, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import BookingRepository from '@/services/booking/BookingRepository';
import { Service } from '@/services/booking/types';

const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const load = () => setServices(BookingRepository.getServices());
  useEffect(() => { load(); }, []);

  const handleSave = (values: any) => {
    if (editingId) {
      BookingRepository.updateService(editingId, values);
      message.success('Cập nhật thành công');
    } else {
      BookingRepository.addService(values);
      message.success('Thêm dịch vụ thành công');
    }
    setIsModalOpen(false);
    load();
  };

  const handleDelete = (id: string) => {
    BookingRepository.deleteService(id);
    message.success('Đã xóa dịch vụ');
    load();
  };

  const columns = [
    { title: 'Tên dịch vụ', dataIndex: 'name', key: 'name', render: (t: string) => <span className="font-bold">{t}</span> },
    { 
      title: 'Đơn giá', 
      dataIndex: 'price', 
      key: 'price',
      render: (p: number) => <span className="text-blue-600 font-extrabold">{p.toLocaleString()}đ</span> 
    },
    { 
      title: 'Thời lượng', 
      dataIndex: 'duration', 
      key: 'duration',
      render: (d: number) => <span className="text-gray-500 font-medium">{d} phút</span>
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'right' as const,
      render: (_: any, record: Service) => (
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
        title={<span className="text-xl font-bold text-gray-800">💇‍♂️ Danh Mục Dịch Vụ</span>}
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => {
          setEditingId(null);
          form.resetFields();
          setIsModalOpen(true);
        }} className="bg-blue-600 rounded-xl h-10 font-bold">Thêm Dịch Vụ</Button>}
        className="shadow-xl rounded-2xl border-none"
      >
        <Table columns={columns} dataSource={services} rowKey="id" />
      </Card>

      <Modal
        title={editingId ? 'Chỉnh sửa dịch vụ' : 'Thêm dịch vụ mới'}
        visible={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className="rounded-2xl overflow-hidden"
      >
        <Form form={form} layout="vertical" onFinish={handleSave} className="p-2">
          <Form.Item name="name" label="Tên dịch vụ" rules={[{ required: true }]}>
            <Input className="rounded-lg h-10" />
          </Form.Item>
          <div className="flex gap-4">
            <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true }]} className="flex-1">
              <InputNumber min={0} className="w-full rounded-lg h-10 flex items-center" />
            </Form.Item>
            <Form.Item name="duration" label="Thời lượng (Phút)" rules={[{ required: true }]} className="flex-1">
              <InputNumber min={5} className="w-full rounded-lg h-10 flex items-center" />
            </Form.Item>
          </div>
          <Button type="primary" htmlType="submit" block size="large" className="rounded-xl h-12 bg-blue-600 font-bold mt-4">Lưu Dịch Vụ</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ServicesPage;
