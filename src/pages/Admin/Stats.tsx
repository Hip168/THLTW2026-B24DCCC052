import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import { RiseOutlined, ShoppingCartOutlined, TeamOutlined, CheckCircleOutlined } from '@ant-design/icons';
import ReactApexChart from 'react-apexcharts';
import BookingRepository from '@/services/booking/BookingRepository';

const StatsPage: React.FC = () => {
  const stats = useMemo(() => BookingRepository.getStatistics(), []);
  const appointments = useMemo(() => BookingRepository.getAppointments(), []);
  const services = useMemo(() => BookingRepository.getServices(), []);
  const employees = useMemo(() => BookingRepository.getEmployees(), []);

  const monthlyRevenue = useMemo(() => {
    const revenueMap = new Array(12).fill(0);
    appointments.forEach(app => {
      if (app.status !== 'CANCELLED') {
        const month = new Date(app.start_time).getMonth();
        const service = services.find(s => s.id === app.service_id);
        revenueMap[month] += (service?.price || 0);
      }
    });
    return revenueMap;
  }, [appointments, services]);

  const chartOptions: any = {
    series: [{ name: 'Doanh thu (Dự kiến)', data: monthlyRevenue }],
    options: {
      chart: { type: 'area', height: 350, toolbar: { show: false }, fontFamily: 'Inter, sans-serif' },
      colors: ['#3b82f6'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [20, 100] } },
      xaxis: { categories: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'] },
      yaxis: { labels: { formatter: (val: number) => `${(val / 1000000).toFixed(1)}M` } },
      tooltip: { y: { formatter: (val: number) => `${val.toLocaleString()} VNĐ` } }
    }
  };

  const serviceStats = useMemo(() => {
    return services.map(s => {
      const count = appointments.filter(a => a.service_id === s.id && a.status === 'COMPLETED').length;
      return { key: s.id, service: s.name, count, revenue: count * s.price };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [appointments, services]);

  const employeeStats = useMemo(() => {
    return employees.map(e => {
      const completed = appointments.filter(a => a.employee_id === e.id && a.status === 'COMPLETED');
      const revenue = completed.reduce((sum, app) => sum + (services.find(s => s.id === app.service_id)?.price || 0), 0);
      return { key: e.id, name: e.name, count: completed.length, revenue };
    }).sort((a, b) => b.revenue - a.revenue);
  }, [appointments, services, employees]);

  return (
    <div className="p-6">
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="rounded-2xl shadow-sm border-none">
            <Statistic title="Tổng doanh thu" value={stats.totalRevenue} valueStyle={{ color: '#2563eb', fontWeight: 800 }} prefix={<RiseOutlined />} suffix=" VNĐ" />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="rounded-2xl shadow-sm border-none">
            <Statistic title="Hoàn thành" value={stats.completedAppointments} valueStyle={{ color: '#16a34a', fontWeight: 800 }} prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="rounded-2xl shadow-sm border-none">
            <Statistic title="Khách hàng" value={new Set(appointments.map(a => a.customer_name)).size} valueStyle={{ color: '#7c3aed', fontWeight: 800 }} prefix={<TeamOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} className="rounded-2xl shadow-sm border-none">
            <Statistic title="Dịch vụ" value={services.length} valueStyle={{ color: '#ea580c', fontWeight: 800 }} prefix={<ShoppingCartOutlined />} />
          </Card>
        </Col>
      </Row>

      <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-50">
        <h3 className="text-xl font-extrabold text-gray-800 mb-6 uppercase tracking-tight">Biểu Đồ Doanh Thu Dự Kiến</h3>
        <ReactApexChart options={chartOptions.options} series={chartOptions.series} type="area" height={320} />
      </div>

      <Row gutter={[20, 20]} className="mt-6">
        <Col xs={24} lg={12}>
          <Card title={<span className="font-extrabold text-gray-800 uppercase text-sm italic">Doanh thu theo dịch vụ</span>} bordered={false} className="rounded-2xl shadow-sm border-none">
            <Table columns={[
              { title: 'Dịch vụ', dataIndex: 'service', key: 'service', render: (t) => <span className="font-bold text-gray-700">{t}</span> },
              { title: 'Số lượng', dataIndex: 'count', key: 'count', align: 'center' },
              { title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue', align: 'right', render: (v) => <span className="text-blue-600 font-bold">{v.toLocaleString()}đ</span> }
            ]} dataSource={serviceStats} pagination={false} size="middle" />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<span className="font-extrabold text-gray-800 uppercase text-sm italic">Hiệu suất nhân viên</span>} bordered={false} className="rounded-2xl shadow-sm border-none">
            <Table columns={[
              { title: 'Nhân viên', dataIndex: 'name', key: 'name', render: (t) => <span className="font-bold text-gray-700">{t}</span> },
              { title: 'Lịch xong', dataIndex: 'count', key: 'count', align: 'center' },
              { title: 'Doanh thu', dataIndex: 'revenue', key: 'revenue', align: 'right', render: (v) => <span className="text-green-600 font-bold">{v.toLocaleString()}đ</span> }
            ]} dataSource={employeeStats} pagination={false} size="middle" />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StatsPage;
