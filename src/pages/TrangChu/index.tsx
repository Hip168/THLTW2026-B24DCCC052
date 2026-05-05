// src/pages/TrangChu/index.tsx
import React from 'react';
import { Card, Row, Col, Statistic, List, Tag, Typography, Progress } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import moment from 'moment';
import { Task } from '@/types/task';

const { Title } = Typography;

const PRIORITY_COLOR: Record<string, string> = {
  high: 'red',
  medium: 'orange',
  low: 'green',
};

const TrangChu: React.FC = () => {
  const { tasks, stats } = useModel('task');

  // Lọc 5 task sắp đến hạn (chưa done, có deadline, sắp xếp tăng dần)
  const upcomingTasks = tasks
    .filter(t => t.status !== 'done' && t.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 5);

  const statCards = [
    {
      title: 'Tổng số Task',
      value: stats.total,
      icon: <UnorderedListOutlined />,
      color: '#1890ff',
    },
    {
      title: 'Đã hoàn thành',
      value: stats.done,
      icon: <CheckCircleOutlined />,
      color: '#52c41a',
    },
    {
      title: 'Quá hạn',
      value: stats.overdue,
      icon: <ExclamationCircleOutlined />,
      color: '#ff4d4f',
    },
    {
      title: 'Đang làm',
      value: stats.inprogress,
      icon: <ClockCircleOutlined />,
      color: '#faad14',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>📊 Dashboard Tổng Quan</Title>

      {/* Thẻ thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statCards.map(card => (
          <Col xs={24} sm={12} md={6} key={card.title}>
            <Card bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Statistic
                title={<span>{card.icon} {card.title}</span>}
                value={card.value}
                valueStyle={{ color: card.color, fontSize: 32 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16}>
        {/* Tiến độ hoàn thành */}
        <Col xs={24} md={12}>
          <Card title="📈 Tiến độ hoàn thành" bordered={false}>
            <Progress
              type="circle"
              percent={stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0}
              strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
            />
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <Typography.Text type="secondary">
                {stats.done}/{stats.total} task đã hoàn thành
              </Typography.Text>
            </div>
          </Card>
        </Col>

        {/* Task sắp đến hạn */}
        <Col xs={24} md={12}>
          <Card title="⏳ Task sắp đến hạn" bordered={false}>
            <List
              dataSource={upcomingTasks}
              renderItem={(task: Task) => (
                <List.Item>
                  <List.Item.Meta
                    title={task.title}
                    description={
                      <>
                        <Tag color={PRIORITY_COLOR[task.priority]}>{task.priority.toUpperCase()}</Tag>
                        <span>Hạn: {moment(task.deadline).format('DD/MM/YYYY')}</span>
                      </>
                    }
                  />
                </List.Item>
              )}
              locale={{ emptyText: 'Không có task sắp đến hạn 🎉' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TrangChu;
