import React, { useState } from 'react';
import { 
  Row, Col, Card, Typography, 
  Statistic, DatePicker, Space, 
  List, Avatar 
} from 'antd';
import { 
  ArrowUpOutlined, GlobalOutlined, 
  DollarOutlined, UserOutlined, 
  StarOutlined 
} from '@ant-design/icons';
import Chart from 'react-apexcharts';
import moment from 'moment';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const ThongKe: React.FC = () => {
  const [dateRange, setDateRange] = useState<any>([moment().startOf('year'), moment()]);

  // Mock data cho Biểu đồ 1: Lịch trình theo tháng
  const lichTrinhThangOptions: any = {
    chart: { type: 'line', toolbar: { show: false } },
    xaxis: { categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'] },
    colors: ['#1890ff'],
    stroke: { curve: 'smooth' },
    title: { text: 'Số lượng lịch trình theo tháng', align: 'left' },
  };
  const lichTrinhThangSeries = [{ name: 'Lịch trình', data: [35, 45, 60, 85, 120, 150, 180, 160, 130, 95, 70, 50] }];

  // Mock data cho Biểu đồ 2: Top 5 điểm đến
  const topDiemDenOptions: any = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
    xaxis: { categories: ['Hội An', 'Đà Nẵng', 'Sa Pa', 'Phú Quốc', 'Hà Nội'] },
    colors: ['#52c41a'],
  };
  const topDiemDenSeries = [{ name: 'Lượt thêm', data: [450, 420, 380, 350, 310] }];

  // Mock data cho Biểu đồ 3: Doanh thu theo hạng mục
  const categoryRevenueOptions: any = {
    chart: { type: 'pie' },
    labels: ['Ăn uống', 'Lưu trú', 'Di chuyển', 'Vui chơi'],
    colors: ['#1890ff', '#52c41a', '#faad14', '#f5222d'],
    legend: { position: 'bottom' },
  };
  const categoryRevenueSeries = [35, 45, 12, 8];

  // Mock data cho Biểu đồ 4: Doanh thu theo tháng
  const revenueMonthOptions: any = {
    chart: { type: 'bar', toolbar: { show: false } },
    xaxis: { categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'] },
    colors: ['#722ed1'],
    dataLabels: { enabled: false },
    yaxis: { labels: { formatter: (val: number) => `${val}M` } },
  };
  const revenueMonthSeries = [{ name: 'Doanh thu (Triệu VNĐ)', data: [120, 150, 180, 250, 400, 550, 700, 650, 480, 320, 210, 180] }];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <Title level={2}>Thống Kê Hệ Thống</Title>
          <Text type="secondary">Tổng quan hoạt động du lịch toàn quốc</Text>
        </div>
        <Space direction="vertical" align="end">
          <Text strong>Khoảng thời gian thống kê</Text>
          <RangePicker 
            value={dateRange} 
            onChange={setDateRange}
            format="DD/MM/YYYY"
          />
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng lịch trình đã tạo"
              value={1250}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="success"><ArrowUpOutlined /> 12.5% </Text>
              <Text type="secondary">so với tháng trước</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu ước tính"
              value={4580}
              suffix="M"
              prefix={<DollarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="success"><ArrowUpOutlined /> 8.2% </Text>
              <Text type="secondary">so với tháng trước</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Điểm đến hot nhất"
              value="Hội An"
              prefix={<StarOutlined />}
              valueStyle={{ color: '#faad14', fontSize: '1.5rem' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">450 lượt thêm vào lịch trình</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Khách hàng tích cực"
              value={890}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">Người dùng đã tạo lịch trình</Text>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Xu hướng du lịch năm 2026">
            <Chart 
              options={lichTrinhThangOptions} 
              series={lichTrinhThangSeries} 
              type="line" 
              height={350} 
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Tỷ lệ chi tiêu theo hạng mục">
            <Chart 
              options={categoryRevenueOptions} 
              series={categoryRevenueSeries} 
              type="pie" 
              height={350} 
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={10}>
          <Card title="Top 5 điểm đến được yêu thích nhất">
            <Chart 
              options={topDiemDenOptions} 
              series={topDiemDenSeries} 
              type="bar" 
              height={350} 
            />
          </Card>
        </Col>
        <Col xs={24} lg={14}>
          <Card title="Doanh thu hệ thống theo tháng (Triệu VNĐ)">
            <Chart 
              options={revenueMonthOptions} 
              series={revenueMonthSeries} 
              type="bar" 
              height={350} 
            />
          </Card>
        </Col>
      </Row>

      <Card title="Hoạt động gần đây" style={{ marginTop: 24 }}>
        <List
          itemLayout="horizontal"
          dataSource={[
            { title: 'Nguyễn Văn A đã tạo lịch trình đi Đà Nẵng', time: '10 phút trước', avatar: 'https://i.pravatar.cc/150?u=1' },
            { title: 'Admin đã cập nhật thông tin điểm đến Hội An', time: '1 giờ trước', avatar: 'https://i.pravatar.cc/150?u=2' },
            { title: 'Trần Thị B đã hoàn thành chuyến đi Sa Pa', time: '3 giờ trước', avatar: 'https://i.pravatar.cc/150?u=3' },
            { title: 'Lê Văn C đã thêm Phú Quốc vào mục yêu thích', time: '5 giờ trước', avatar: 'https://i.pravatar.cc/150?u=4' },
          ]}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={<a href="#">{item.title}</a>}
                description={item.time}
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default ThongKe;
