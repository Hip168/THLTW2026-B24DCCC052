import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import ReactApexChart from 'react-apexcharts';
import { getClubs } from '@/services/ClubManagement/club';
import { getApplications } from '@/services/ApplicationManagement/application';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalClubs: 0,
    totalApps: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const [chartData, setChartData] = useState<any>({
    options: {
      chart: { type: 'bar', height: 350 },
      xaxis: { categories: [] },
      colors: ['#faad14', '#52c41a', '#f5222d'],
      plotOptions: {
        bar: { horizontal: false, columnWidth: '55%', endingShape: 'rounded' },
      },
      dataLabels: { enabled: false },
    },
    series: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clubsRes = await getClubs();
        const appsRes = await getApplications();
        const clubs = clubsRes.data || [];
        const apps = appsRes.data || [];

        const clubNames = clubs.map((c: any) => c.name);
        const pendingData = clubs.map((c: any) => apps.filter((a: any) => a.clubId === c.id && a.status === 'Pending').length);
        const approvedData = clubs.map((c: any) => apps.filter((a: any) => a.clubId === c.id && a.status === 'Approved').length);
        const rejectedData = clubs.map((c: any) => apps.filter((a: any) => a.clubId === c.id && a.status === 'Rejected').length);

        setStats({
          totalClubs: clubs.length,
          totalApps: apps.length,
          pending: apps.filter((a: any) => a.status === 'Pending').length,
          approved: apps.filter((a: any) => a.status === 'Approved').length,
          rejected: apps.filter((a: any) => a.status === 'Rejected').length,
        });

        setChartData((prev: any) => ({
          options: {
            ...prev.options,
            xaxis: { categories: clubNames },
          },
          series: [
            { name: 'Pending', data: pendingData },
            { name: 'Approved', data: approvedData },
            { name: 'Rejected', data: rejectedData },
          ],
        }));
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={4}><Card><Statistic title="Tổng CLB" value={stats.totalClubs} /></Card></Col>
        <Col span={4}><Card><Statistic title="Tổng Đơn" value={stats.totalApps} /></Card></Col>
        <Col span={4}><Card><Statistic title="Pending" value={stats.pending} valueStyle={{ color: '#faad14' }} /></Card></Col>
        <Col span={4}><Card><Statistic title="Approved" value={stats.approved} valueStyle={{ color: '#52c41a' }} /></Card></Col>
        <Col span={4}><Card><Statistic title="Rejected" value={stats.rejected} valueStyle={{ color: '#f5222d' }} /></Card></Col>
      </Row>

      <Card title="Thống kê đơn đăng ký theo Câu lạc bộ">
        {chartData.series.length > 0 && (
          <ReactApexChart options={chartData.options} series={chartData.series} type="bar" height={400} />
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
