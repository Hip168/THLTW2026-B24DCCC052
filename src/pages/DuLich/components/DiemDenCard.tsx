import React from 'react';
import { Card, Tag, Rate, Button, Typography, Space } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import type { DiemDen } from '@/types/duLich';

const { Text, Title } = Typography;

interface DiemDenCardProps {
  data: DiemDen;
  onAdd: (data: DiemDen) => void;
  onView: (data: DiemDen) => void;
}

const loaiHinhLabels = {
  bien: { label: 'Biển', color: 'blue' },
  nui: { label: 'Núi', color: 'green' },
  thanhPho: { label: 'Thành phố', color: 'orange' },
  langQue: { label: 'Làng quê', color: 'gold' },
};

const DiemDenCard: React.FC<DiemDenCardProps> = ({ data, onAdd, onView }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const totalCost = data.chiPhi.anUong + data.chiPhi.luuTru + data.chiPhi.diChuyen;

  return (
    <Card
      hoverable
      className="diem-den-card"
      cover={
        <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
          <img
            alt={data.ten}
            src={data.hinhAnh}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <Tag
            color={loaiHinhLabels[data.loaiHinh].color}
            style={{ position: 'absolute', top: 12, left: 12, margin: 0 }}
          >
            {loaiHinhLabels[data.loaiHinh].label}
          </Tag>
        </div>
      }
      actions={[
        <Button type="link" key="view" onClick={() => onView(data)}>
          Xem chi tiết
        </Button>,
        <Button type="primary" key="add" onClick={() => onAdd(data)} size="small" style={{ marginRight: 12 }}>
          Thêm vào lịch trình
        </Button>,
      ]}
    >
      <Card.Meta
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Title level={5} style={{ margin: 0 }}>{data.ten}</Title>
            <Space size={4} style={{ fontSize: 12, color: '#999' }}>
              <EyeOutlined /> {data.luotXem.toLocaleString()}
            </Space>
          </div>
        }
        description={
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Space size={4}>
              <EnvironmentOutlined style={{ color: '#ff4d4f' }} />
              <Text type="secondary" ellipsis style={{ maxWidth: 180 }}>{data.viTri.diaChi}</Text>
            </Space>
            
            <Rate disabled defaultValue={data.rating} allowHalf style={{ fontSize: 14 }} />
            
            <div style={{ marginTop: 8 }}>
              <Space split={<Text type="secondary">|</Text>}>
                <Space size={4}>
                  <ClockCircleOutlined />
                  <Text>{data.thoiGianThamQuan}h</Text>
                </Space>
                <Text type="danger" strong>{formatCurrency(totalCost)}/ngày</Text>
              </Space>
            </div>
          </Space>
        }
      />
    </Card>
  );
};

export default DiemDenCard;
