import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, Button, Card, message, Modal, Input, Rate, Form, Divider, List, Avatar } from 'antd';
import { MessageOutlined, CheckCircleOutlined, SyncOutlined, CloseCircleOutlined, UserOutlined, EnterOutlined } from '@ant-design/icons';
import moment from 'moment';
import BookingRepository from '@/services/booking/BookingRepository';
import { Appointment, AppointmentStatus, Review } from '@/services/booking/types';

const AppointmentsPage: React.FC = () => {
  const [data, setData] = useState<Appointment[]>([]);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [replyForm] = Form.useForm();

  const loadData = () => {
    setData(BookingRepository.getAppointments().reverse());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatus = (id: string, status: AppointmentStatus) => {
    try {
      BookingRepository.updateAppointmentStatus(id, status);
      message.success(`Đã chuyển trạng thái sang ${status}`);
      loadData();
    } catch (e: any) {
      message.error(e.message);
    }
  };

  const handleReview = (values: any) => {
    if (!selectedAppId) return;
    try {
      BookingRepository.addReview({
        appointment_id: selectedAppId,
        rating: values.rating,
        comment: values.comment,
      });
      message.success('Đã lưu đánh giá');
      setIsReviewOpen(false);
      form.resetFields();
    } catch (e: any) {
      message.error(e.message);
    }
  };

  const handleReply = (values: any) => {
    if (!selectedReviewId) return;
    try {
      BookingRepository.addStaffReply(selectedReviewId, values.reply);
      message.success('Đã phản hồi đánh giá');
      setIsReplyOpen(false);
      replyForm.resetFields();
    } catch (e: any) {
      message.error(e.message);
    }
  };

  const reviews = BookingRepository.getReviews();

  const columns = [
    {
      title: 'Khách hàng',
      dataIndex: 'customer_name',
      key: 'customer_name',
      render: (text: string) => <span className="font-semibold text-gray-800">{text}</span>
    },
    {
      title: 'Nhân viên',
      dataIndex: 'employee_id',
      key: 'employee',
      render: (id: string) => BookingRepository.getEmployees().find(e => e.id === id)?.name
    },
    {
      title: 'Dịch vụ',
      dataIndex: 'service_id',
      key: 'service',
      render: (id: string) => BookingRepository.getServices().find(s => s.id === id)?.name
    },
    {
      title: 'Thời gian',
      dataIndex: 'start_time',
      key: 'time',
      render: (text: string) => (
        <div className="flex flex-col text-xs">
          <span className="font-bold">{moment(text).format('DD/MM/YYYY')}</span>
          <span className="text-gray-500 font-medium">{moment(text).format('HH:mm')}</span>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: AppointmentStatus) => {
        const config = {
          PENDING: { color: 'processing', text: 'Chờ duyệt', icon: <SyncOutlined spin /> },
          CONFIRMED: { color: 'cyan', text: 'Đã xác nhận', icon: <CheckCircleOutlined /> },
          COMPLETED: { color: 'success', text: 'Hoàn thành', icon: <CheckCircleOutlined /> },
          CANCELLED: { color: 'error', text: 'Đã hủy', icon: <CloseCircleOutlined /> },
        };
        const { color, text, icon } = config[status];
        return <Tag icon={icon} color={color} className="rounded-md px-2 py-0.5 font-bold uppercase text-[10px]">{text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Appointment) => {
        const review = reviews.find(r => r.appointment_id === record.id);
        return (
          <Space size="small">
            {record.status === 'PENDING' && (
              <Button size="small" type="primary" className="rounded-md bg-blue-600 border-none shadow-sm" onClick={() => handleStatus(record.id, 'CONFIRMED')}>
                Xác nhận
              </Button>
            )}
            {record.status === 'CONFIRMED' && (
              <Button size="small" className="rounded-md bg-green-500 hover:bg-green-600 text-white border-none shadow-sm" onClick={() => handleStatus(record.id, 'COMPLETED')}>
                Xong
              </Button>
            )}
            {(record.status === 'PENDING' || record.status === 'CONFIRMED') && (
              <Button size="small" danger className="rounded-md border-gray-200" onClick={() => handleStatus(record.id, 'CANCELLED')}>
                Hủy
              </Button>
            )}
            {record.status === 'COMPLETED' && !review && (
              <Button size="small" icon={<MessageOutlined />} className="rounded-md flex items-center gap-1 border-blue-200 text-blue-600 font-semibold" onClick={() => {
                setSelectedAppId(record.id);
                setIsReviewOpen(true);
              }}>
                Đánh giá
              </Button>
            )}
            {review && (
              <Button size="small" icon={<EnterOutlined />} className="rounded-md border-orange-200 text-orange-600 font-semibold" onClick={() => {
                setSelectedReviewId(review.id);
                replyForm.setFieldsValue({ reply: review.staff_reply });
                setIsReplyOpen(true);
              }}>
                {review.staff_reply ? 'Sửa phản hồi' : 'Trả lời'}
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <Card 
        title={<span className="text-xl font-bold text-gray-800">📋 Danh Sách Lịch Hẹn & Phản Hồi</span>} 
        bordered={false} 
        className="shadow-xl rounded-2xl border-none"
      >
        <Table columns={columns} dataSource={data} rowKey="id" pagination={{ pageSize: 8 }} />
      </Card>

      <Modal
        title={<span className="font-bold text-lg">Đánh giá từ khách hàng</span>}
        visible={isReviewOpen}
        onCancel={() => setIsReviewOpen(false)}
        footer={null}
        className="rounded-2xl"
      >
        <Form form={form} onFinish={handleReview} layout="vertical" className="p-4">
          <Form.Item name="rating" label="Mức độ hài lòng" rules={[{ required: true }]}>
            <Rate className="text-2xl" />
          </Form.Item>
          <Form.Item name="comment" label="Ý kiến khách hàng" rules={[{ required: true }]}>
            <Input.TextArea placeholder="Nhập cảm nhận của khách..." rows={4} className="rounded-xl" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" className="rounded-xl h-12 bg-blue-600 font-bold mt-4">Lưu Đánh Giá</Button>
        </Form>
      </Modal>

      <Modal
        title={<span className="font-bold text-lg text-orange-600">Phản hồi của nhân viên</span>}
        visible={isReplyOpen}
        onCancel={() => setIsReplyOpen(false)}
        footer={null}
        className="rounded-2xl"
      >
        <Form form={replyForm} onFinish={handleReply} layout="vertical" className="p-4">
          <div className="bg-gray-50 p-4 rounded-xl mb-6 italic text-gray-600">
            "{reviews.find(r => r.id === selectedReviewId)?.comment}"
          </div>
          <Form.Item name="reply" label="Nội dung phản hồi" rules={[{ required: true }]}>
            <Input.TextArea placeholder="Nhập lời cảm ơn hoặc giải đáp..." rows={4} className="rounded-xl" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" className="rounded-xl h-12 bg-orange-500 hover:bg-orange-600 border-none font-bold mt-4 shadow-lg">Gửi Phản Hồi</Button>
        </Form>
      </Modal>

      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 ml-2">Đánh giá gần đây</h3>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 3 }}
          dataSource={reviews.slice(-6).reverse()}
          renderItem={(item: Review) => {
            const app = data.find(a => a.id === item.appointment_id);
            const employee = BookingRepository.getEmployees().find(e => e.id === app?.employee_id);
            return (
              <List.Item>
                <Card className="rounded-2xl shadow-sm border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar icon={<UserOutlined />} className="bg-blue-100 text-blue-600" />
                    <div>
                      <div className="font-bold text-sm">{app?.customer_name}</div>
                      <Rate disabled defaultValue={item.rating} className="text-[10px]" />
                    </div>
                  </div>
                  <div className="text-gray-600 text-sm mb-4 min-h-[40px]">"{item.comment}"</div>
                  {item.staff_reply && (
                    <div className="bg-blue-50/50 p-3 rounded-xl border-l-4 border-blue-400">
                      <div className="text-[10px] font-extrabold text-blue-600 mb-1 uppercase tracking-wider">{employee?.name} (Staff) đã trả lời:</div>
                      <div className="text-xs text-blue-800 font-medium">{item.staff_reply}</div>
                    </div>
                  )}
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
};

export default AppointmentsPage;
