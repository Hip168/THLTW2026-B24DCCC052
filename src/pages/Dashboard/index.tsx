import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Col, Row, Statistic, Timeline } from 'antd';
import Chart from 'react-apexcharts';
import styles from './style.less';

const Dashboard: React.FC = () => {
  const columnChartOptions = {
    chart: { type: 'bar' as const },
    xaxis: { categories: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] },
  };
  const columnChartSeries = [{ name: 'Buổi tập', data: [1, 0, 1, 1, 0, 1, 0] }];

  const lineChartOptions = {
    chart: { type: 'line' as const },
    xaxis: { categories: ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4'] },
    stroke: { curve: 'smooth' as const },
  };
  const lineChartSeries = [{ name: 'Cân nặng (kg)', data: [75, 74.5, 74, 73.2] }];

  return (
    <PageContainer className={styles.dashboardContainer}>
      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Tổng buổi tập tháng" value={12} suffix="buổi" />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Tổng calo" value={4500} suffix="kcal" />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="Streak" value={5} suffix="ngày" />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false}>
            <Statistic title="% Mục tiêu" value={80} suffix="%" />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Số buổi tập theo tuần" bordered={false}>
            <Chart options={columnChartOptions} series={columnChartSeries} type="bar" height={300} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Biến thiên cân nặng" bordered={false}>
            <Chart options={lineChartOptions} series={lineChartSeries} type="line" height={300} />
          </Card>
        </Col>
      </Row>

      <Card title="5 buổi tập gần nhất" bordered={false} style={{ marginTop: 16 }}>
        <Timeline>
          <Timeline.Item color="green">Cardio - 30 phút - 300 kcal (Hôm nay)</Timeline.Item>
          <Timeline.Item color="green">Strength - 45 phút - 400 kcal (Hôm qua)</Timeline.Item>
          <Timeline.Item color="green">Yoga - 60 phút - 250 kcal (3 ngày trước)</Timeline.Item>
          <Timeline.Item color="red">HIIT - Bỏ lỡ (4 ngày trước)</Timeline.Item>
          <Timeline.Item color="green">Cardio - 30 phút - 320 kcal (5 ngày trước)</Timeline.Item>
        </Timeline>
      </Card>
    </PageContainer>
  );
};

export default Dashboard;
