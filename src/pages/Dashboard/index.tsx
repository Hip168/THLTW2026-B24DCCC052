
import React, { useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Statistic, Progress } from 'antd';
import { ShoppingOutlined, DollarOutlined, SolutionOutlined, ShopOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import { formatCurrency } from '@/utils/format';

const DashboardPage: React.FC = () => {
  const { products } = useModel('products');
  const { orders } = useModel('orders');

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const inventoryValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const totalOrders = orders.length;
    const revenue = orders
      .filter((o) => o.status === 'Hoàn thành')
      .reduce((sum, o) => sum + o.totalAmount, 0);
    
    return { totalProducts, inventoryValue, totalOrders, revenue };
  }, [products, orders]);

  const statusDist = useMemo(() => {
    const counts: Record<string, number> = {
      'Chờ xử lý': 0,
      'Đang giao': 0,
      'Hoàn thành': 0,
      'Đã hủy': 0,
    };
    orders.forEach((o) => {
      if (counts[o.status] !== undefined) {
        counts[o.status]++;
      }
    });
    
    const total = orders.length || 1;
    return {
      'Chờ xử lý': (counts['Chờ xử lý'] / total) * 100,
      'Đang giao': (counts['Đang giao'] / total) * 100,
      'Hoàn thành': (counts['Hoàn thành'] / total) * 100,
      'Đã hủy': (counts['Đã hủy'] / total) * 100,
      raw: counts,
    };
  }, [orders]);

  return (
    <PageContainer title="Tổng quan">
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số sản phẩm"
              value={stats.totalProducts}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Giá trị tồn kho"
              value={stats.inventoryValue}
              prefix={<DollarOutlined />}
              formatter={(val) => formatCurrency(Number(val))}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số đơn hàng"
              value={stats.totalOrders}
              prefix={<SolutionOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Doanh thu (Hoàn thành)"
              value={stats.revenue}
              prefix={<DollarOutlined />}
              formatter={(val) => formatCurrency(Number(val))}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Trạng thái đơn hàng">
            <div style={{ marginBottom: 16 }}>
              <span>Chờ xử lý ({statusDist.raw['Chờ xử lý']})</span>
              <Progress percent={statusDist['Chờ xử lý']} status="active" strokeColor="#faad14" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <span>Đang giao ({statusDist.raw['Đang giao']})</span>
              <Progress percent={statusDist['Đang giao']} status="active" strokeColor="#1890ff" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <span>Hoàn thành ({statusDist.raw['Hoàn thành']})</span>
              <Progress percent={statusDist['Hoàn thành']} status="success" />
            </div>
            <div>
              <span>Đã hủy ({statusDist.raw['Đã hủy']})</span>
              <Progress percent={statusDist['Đã hủy']} status="exception" />
            </div>
          </Card>
        </Col>
        
        <Col span={12}>
          <Card title="Hướng dẫn sử dụng">
            <p><strong>1. Sản phẩm:</strong> Quản lý danh sách, giá và tồn kho. Trạng thái tự động cập nhật.</p>
            <p><strong>2. Đơn hàng:</strong> Tạo đơn hàng tính tổng tiền. Hủy hoặc hoàn thành sẽ cập nhật kho.</p>
            <p><strong>3. Tồn kho:</strong> Chỉ trừ kho khi đơn hàng <strong>Hoàn thành</strong>.</p>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default DashboardPage;
