import React, { useState, useEffect } from 'react';
import { Form, Select, DatePicker, Input, Button, Card, message, Rate, Tag, Divider, Row, Col } from 'antd';
import { ScheduleOutlined, UserOutlined, ClockCircleOutlined, DollarOutlined } from '@ant-design/icons';
import moment from 'moment';
import BookingRepository from '@/services/booking/BookingRepository';
import { Employee, Service } from '@/services/booking/types';

const { Option } = Select;

const BookingPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    setServices(BookingRepository.getServices());
    setEmployees(BookingRepository.getEmployees());
  }, []);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const startTime = values.time.toISOString();
      
      BookingRepository.addAppointment({
        customer_name: values.customer_name,
        employee_id: values.employee_id,
        service_id: values.service_id,
        start_time: startTime,
      });
      
      message.success('Đặt lịch thành công! Dữ liệu đã được lưu bền vững.');
      form.resetFields();
    } catch (error: any) {
      message.error(error.message || 'Đã có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Card 
        title={<span className="text-2xl flex items-center gap-2 font-bold"><ScheduleOutlined /> Đặt Lịch Hẹn Dịch Vụ</span>}
        bordered={false}
        className="shadow-xl rounded-2xl overflow-hidden border border-gray-100"
      >
        <Form form={form} layout="vertical" onFinish={onFinish} className="mt-4">
          <Row gutter={24}>
            <Col span={24}>
              <Form.Item 
                name="customer_name" 
                label={<span className="font-semibold text-gray-700">Họ và tên khách hàng</span>} 
                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
              >
                <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Nhập tên của bạn" className="rounded-lg h-10" />
              </Form.Item>
            </Col>
            
            <Col span={12}>
              <Form.Item 
                name="service_id" 
                label={<span className="font-semibold text-gray-700">Chọn dịch vụ</span>} 
                rules={[{ required: true, message: 'Vui lòng chọn dịch vụ!' }]}
              >
                <Select placeholder="Chọn dịch vụ" className="rounded-lg h-10 w-full">
                  {services.map(s => (
                    <Option key={s.id} value={s.id}>
                      <div className="flex justify-between w-full">
                        <span>{s.name}</span>
                        <span className="text-blue-600 font-bold">{s.price.toLocaleString()}đ</span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item 
                name="employee_id" 
                label={<span className="font-semibold text-gray-700">Chọn nhân viên</span>} 
                rules={[{ required: true, message: 'Vui lòng chọn nhân viên!' }]}
              >
                <Select placeholder="Chọn nhân viên" className="rounded-lg h-10 w-full">
                  {employees.map(e => (
                    <Option key={e.id} value={e.id}>
                      <div className="flex flex-col">
                        <span>{e.name}</span>
                        <div className="flex items-center gap-1">
                          <Rate disabled defaultValue={BookingRepository.getEmployeeRating(e.id)} className="text-[10px]" />
                          <span className="text-[10px] text-gray-400">({e.max_customers} khách/ngày)</span>
                        </div>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item 
                name="time" 
                label={<span className="font-semibold text-gray-700">Thời gian bắt đầu</span>} 
                rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}
              >
                <DatePicker 
                  showTime 
                  className="rounded-lg h-10 w-full"
                  format="YYYY-MM-DD HH:mm"
                  disabledDate={(current) => current && current < moment().startOf('day')}
                  placeholder="Chọn ngày và giờ"
                />
              </Form.Item>
            </Col>
          </Row>

          <Divider className="my-6" />

          <div className="flex justify-center">
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              size="large" 
              className="min-w-[240px] rounded-xl h-12 bg-blue-600 hover:bg-blue-700 border-none shadow-md font-bold text-lg transition-all transform hover:scale-105"
            >
              Xác Nhận Đặt Lịch
            </Button>
          </div>
        </Form>
      </Card>

      <div className="mt-12 bg-white p-8 rounded-2xl shadow-sm border border-gray-50">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
          Bảng Giá Dịch Vụ
        </h3>
        <Row gutter={[24, 24]}>
          {services.map(s => (
            <Col span={12} key={s.id}>
              <div className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all group bg-gray-50/50">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-lg group-hover:text-blue-600 transition-colors">{s.name}</span>
                  <Tag color="blue" className="rounded-full px-3 font-semibold text-sm border-none shadow-inner">
                    <DollarOutlined className="mr-1" /> {s.price.toLocaleString()}đ
                  </Tag>
                </div>
                <div className="text-gray-500 text-sm flex items-center gap-2 font-medium">
                  <ClockCircleOutlined /> {s.duration} phút chuẩn bị & phục vụ
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default BookingPage;
