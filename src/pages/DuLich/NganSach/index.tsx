import React, { useMemo } from 'react';
import { 
  Row, Col, Card, Typography, 
  Table, Progress, Alert, Statistic, 
  Button, Tag, Empty 
} from 'antd';
import { 
  WalletOutlined, PieChartOutlined, 
  BarChartOutlined, WarningOutlined, 
  CheckCircleOutlined,
  ArrowUpOutlined, ArrowDownOutlined
} from '@ant-design/icons';
import { useModel, history } from 'umi';
import NganSachChart from '../components/NganSachChart';
import type { DiemTrongLichTrinh, NganSach } from '@/types/duLich';

const { Title, Text } = Typography;

const NganSachModule: React.FC = () => {
  const { lichTrinhHienTai, tinhNganSach } = useModel('duLich');

  const nganSach = useMemo(() => tinhNganSach(), [lichTrinhHienTai]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  if (!lichTrinhHienTai) {
    return (
      <div style={{ padding: '48px 24px', display: 'flex', justifyContent: 'center' }}>
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{ height: 160 }}
          description={
            <div style={{ marginTop: 24 }}>
              <Text type="secondary" style={{ fontSize: 18 }}>Bạn chưa có lịch trình để quản lý ngân sách</Text>
            </div>
          }
        >
          <Button type="primary" size="large" onClick={() => history.push('/du-lich/lich-trinh')}>
            Tạo lịch trình ngay
          </Button>
        </Empty>
      </div>
    );
  }

  const conLai = lichTrinhHienTai.nganSachTong - nganSach.tong;
  const phanTramDaDung = (nganSach.tong / lichTrinhHienTai.nganSachTong) * 100;
  const isOverBudget = nganSach.tong > lichTrinhHienTai.nganSachTong;

  const tableData = [
    {
      key: 'anUong',
      hangMuc: 'Ăn uống',
      duKien: nganSach.anUong,
      thucTe: nganSach.anUong,
      chenhLech: 0,
      phanTram: ((nganSach.anUong / nganSach.tong) * 100).toFixed(1) + '%',
    },
    {
      key: 'luuTru',
      hangMuc: 'Lưu trú',
      duKien: nganSach.luuTru,
      thucTe: nganSach.luuTru,
      chenhLech: 0,
      phanTram: ((nganSach.luuTru / nganSach.tong) * 100).toFixed(1) + '%',
    },
    {
      key: 'diChuyen',
      hangMuc: 'Di chuyển',
      duKien: nganSach.diChuyen,
      thucTe: nganSach.diChuyen,
      chenhLech: 0,
      phanTram: ((nganSach.diChuyen / nganSach.tong) * 100).toFixed(1) + '%',
    },
    {
      key: 'vuiChoi',
      hangMuc: 'Vui chơi/Vé tham quan',
      duKien: nganSach.vuiChoi || 0,
      thucTe: nganSach.vuiChoi || 0,
      chenhLech: 0,
      phanTram: (((nganSach.vuiChoi || 0) / nganSach.tong) * 100).toFixed(1) + '%',
    },
  ];

  const columns = [
    {
      title: 'Hạng mục',
      dataIndex: 'hangMuc',
      key: 'hangMuc',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Dự kiến (VNĐ)',
      dataIndex: 'duKien',
      key: 'duKien',
      render: (val: number) => formatCurrency(val),
    },
    {
      title: 'Chênh lệch',
      dataIndex: 'chenhLech',
      key: 'chenhLech',
      render: (val: number) => (
        <Text type={val > 0 ? 'danger' : 'success'}>
          {val > 0 ? `+${formatCurrency(val)}` : formatCurrency(val)}
        </Text>
      ),
    },
    {
      title: '% Tổng',
      dataIndex: 'phanTram',
      key: 'phanTram',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={2}>Quản Lý Ngân Sách</Title>
          <Text type="secondary">Cho lịch trình: <Text strong>{lichTrinhHienTai.tieuDe}</Text></Text>
        </div>
        <Button icon={<BarChartOutlined />} onClick={() => history.push('/du-lich/lich-trinh')}>
          Quay lại Lịch trình
        </Button>
      </div>

      <Card style={{ marginBottom: 24, borderRadius: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text strong>Tiến độ chi tiêu</Text>
          <Text strong type={isOverBudget ? 'danger' : 'success'}>
            {formatCurrency(nganSach.tong)} / {formatCurrency(lichTrinhHienTai.nganSachTong)}
          </Text>
        </div>
        <Progress 
          percent={Math.min(100, Math.round(phanTramDaDung))} 
          status={isOverBudget ? 'exception' : (phanTramDaDung > 90 ? 'active' : 'normal')}
          strokeColor={isOverBudget ? '#ff4d4f' : (phanTramDaDung > 90 ? '#faad14' : '#52c41a')}
          strokeWidth={12}
        />
        {phanTramDaDung > 80 && phanTramDaDung <= 100 && (
          <Alert
            message="Cảnh báo: Bạn đã sử dụng hơn 80% ngân sách dự kiến."
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
        {isOverBudget && (
          <Alert
            message="Vượt ngân sách: Chi phí dự tính đã vượt quá ngân sách cho phép!"
            type="error"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </Card>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={6}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic
              title="Tổng ngân sách"
              value={lichTrinhHienTai.nganSachTong}
              prefix={<WalletOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic
              title="Ước tính thực tế"
              value={nganSach.tong}
              prefix={<PieChartOutlined />}
              valueStyle={{ color: isOverBudget ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic
              title={conLai >= 0 ? "Còn lại" : "Vượt mức"}
              value={Math.abs(conLai)}
              prefix={conLai >= 0 ? <CheckCircleOutlined /> : <WarningOutlined />}
              valueStyle={{ color: conLai >= 0 ? '#52c41a' : '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bodyStyle={{ padding: 20 }}>
            <Statistic
              title="Tỷ lệ sử dụng"
              value={phanTramDaDung}
              precision={1}
              suffix="%"
              prefix={phanTramDaDung > 100 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
              valueStyle={{ color: phanTramDaDung > 100 ? '#ff4d4f' : '#faad14' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card title={<span><PieChartOutlined /> Phân bổ theo hạng mục</span>} className="chart-card">
            <NganSachChart nganSach={nganSach} lichTrinh={lichTrinhHienTai} type="pie" />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title={<span><BarChartOutlined /> Biểu đồ chi phí theo ngày</span>} className="chart-card">
            <NganSachChart nganSach={nganSach} lichTrinh={lichTrinhHienTai} type="bar" />
          </Card>
        </Col>
      </Row>

      <Card title="Chi tiết hạng mục" style={{ marginTop: 24 }}>
        <Table 
          columns={columns} 
          dataSource={tableData} 
          pagination={false} 
          scroll={{ x: 600 }}
        />
      </Card>
    </div>
  );
};

export default NganSachModule;
