import React from 'react';
import { Card, Tag, Typography, Button, Space, Avatar } from 'antd';
import { 
  DragOutlined, DeleteOutlined, ClockCircleOutlined, 
  DollarOutlined, EnvironmentOutlined 
} from '@ant-design/icons';
import { Draggable } from 'react-beautiful-dnd';
import type { DiemTrongLichTrinh } from '@/types/duLich';

const { Text, Title } = Typography;

interface LichTrinhItemProps {
  item: DiemTrongLichTrinh;
  index: number;
  onRemove: (id: string) => void;
}

const LichTrinhItem: React.FC<LichTrinhItemProps> = ({ item, index, onRemove }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const totalCost = item.diemDen.chiPhi.anUong + item.diemDen.chiPhi.luuTru + item.diemDen.chiPhi.diChuyen;

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          style={{
            ...provided.draggableProps.style,
            marginBottom: 12,
            opacity: snapshot.isDragging ? 0.8 : 1,
          }}
        >
          <Card
            hoverable
            size="small"
            bodyStyle={{ padding: '12px 16px' }}
            bordered={snapshot.isDragging}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div {...provided.dragHandleProps} style={{ paddingRight: 16, cursor: 'grab' }}>
                <DragOutlined style={{ color: '#bfbfbf', fontSize: 18 }} />
              </div>
              
              <Avatar 
                shape="square" 
                size={64} 
                src={item.diemDen.hinhAnh} 
                style={{ marginRight: 16, borderRadius: 4 }}
              />

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Space size={8}>
                    <Tag color="orange" style={{ margin: 0, borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {item.thuTu}
                    </Tag>
                    <Title level={5} style={{ margin: 0 }}>{item.diemDen.ten}</Title>
                  </Space>
                  <Button 
                    type="text" 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={() => onRemove(item.id)}
                  />
                </div>
                
                <Space size={16} style={{ marginTop: 4 }}>
                  <Text type="secondary" size="small"><EnvironmentOutlined /> {item.diemDen.ten}</Text>
                  <Text type="secondary" size="small"><ClockCircleOutlined /> ~{item.diemDen.thoiGianThamQuan}h</Text>
                  <Text type="danger" strong size="small"><DollarOutlined /> {formatCurrency(totalCost)}</Text>
                </Space>
              </div>
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default LichTrinhItem;
