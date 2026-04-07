import React, { useState, useMemo } from 'react';
import { 
  Row, Col, Card, Typography, Button, 
  Tabs, Empty, Progress, Badge, Space, DatePicker, 
  Form, Modal, Input, InputNumber, 
  Divider, Statistic 
} from 'antd';
import { 
  PlusOutlined, DeleteOutlined, 
  CalendarOutlined, UserOutlined, 
  WalletOutlined, ArrowRightOutlined,
  CompassOutlined
} from '@ant-design/icons';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useModel, history } from 'umi';
import moment from 'moment';
import LichTrinhItem from '../components/LichTrinhItem';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const LichTrinhPage: React.FC = () => {
  const { 
    lichTrinhHienTai, 
    taoLichTrinhMoi, 
    sapXepLaiDiem, 
    xoaDiemKhoiLichTrinh, 
    tinhNganSach,
    setLichTrinhHienTai
  } = useModel('duLich');

  const [activeTab, setActiveTab] = useState<string>('1');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const daysCount = useMemo(() => {
    if (!lichTrinhHienTai) return 0;
    return moment(lichTrinhHienTai.ngayKetThuc).diff(moment(lichTrinhHienTai.ngayBatDau), 'days') + 1;
  }, [lichTrinhHienTai]);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.index === destination.index) return;
    
    sapXepLaiDiem(parseInt(activeTab), source.index, destination.index);
  };

  const handleCreateNew = async (values: any) => {
    const dates = values.dateRange;
    await taoLichTrinhMoi({
      tieuDe: values.tieuDe,
      ngayBatDau: dates[0].toISOString(),
      ngayKetThuc: dates[1].toISOString(),
      soNguoi: values.soNguoi,
      nganSachTong: values.nganSachTong,
    });
    setIsModalVisible(false);
    form.resetFields();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const currentNganSach = tinhNganSach();
  const progressPercent = lichTrinhHienTai?.nganSachTong 
    ? Math.min(100, (currentNganSach.tong / lichTrinhHienTai.nganSachTong) * 100) 
    : 0;

  if (!lichTrinhHienTai) {
    return (
      <div style={{ padding: '48px 24px', display: 'flex', justifyContent: 'center' }}>
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{ height: 160 }}
          description={
            <div style={{ marginTop: 24 }}>
              <Text type="secondary" style={{ fontSize: 18 }}>Bạn chưa có lịch trình du lịch nào</Text>
            </div>
          }
        >
          <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Tạo lịch trình ngay
          </Button>
          
          <Modal
            title="Khởi tạo lịch trình mới"
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            onOk={() => form.submit()}
            width={600}
          >
            <Form form={form} layout="vertical" onFinish={handleCreateNew}>
              <Form.Item name="tieuDe" label="Tiêu đề chuyến đi" rules={[{ required: true }]}>
                <Input placeholder="Ví dụ: Du hè Đà Nẵng 2026" />
              </Form.Item>
              <Form.Item name="dateRange" label="Thời gian" rules={[{ required: true }]}>
                <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="soNguoi" label="Số người" initialValue={1} rules={[{ required: true }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="nganSachTong" label="Ngân sách tổng (VNĐ)" rules={[{ required: true }]}>
                    <InputNumber 
                      min={0} 
                      style={{ width: '100%' }} 
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={value => value!.replace(/\$\s?|(,*)/g, '') as any}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </Empty>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card 
            className="lich-trinh-header" 
            style={{ marginBottom: 24, borderRadius: 8 }}
            bodyStyle={{ padding: '24px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Badge 
                  status={lichTrinhHienTai.trangThai === 'nhap' ? 'processing' : 'success'} 
                  text={lichTrinhHienTai.trangThai === 'nhap' ? 'Đang lên kế hoạch' : 'Đã xác nhận'} 
                  style={{ marginBottom: 12, display: 'block' }}
                />
                <Title level={2} style={{ margin: 0 }}>{lichTrinhHienTai.tieuDe}</Title>
                <Space size={16} style={{ marginTop: 12 }}>
                  <Text type="secondary"><CalendarOutlined /> {moment(lichTrinhHienTai.ngayBatDau).format('DD/MM/YYYY')} - {moment(lichTrinhHienTai.ngayKetThuc).format('DD/MM/YYYY')}</Text>
                  <Text type="secondary"><UserOutlined /> {lichTrinhHienTai.soNguoi} người</Text>
                </Space>
              </div>
              <Button danger icon={<DeleteOutlined />} onClick={() => setLichTrinhHienTai(null)}>Xóa lịch trình</Button>
            </div>
          </Card>

          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab} 
            type="card"
            className="lich-trinh-tabs"
          >
            {Array.from({ length: daysCount }).map((_, index) => {
              const day = index + 1;
              const pointsInDay = lichTrinhHienTai.cacDiem
                .filter(d => d.ngay === day)
                .sort((a, b) => a.thuTu - b.thuTu);
              
              const dayCost = pointsInDay.reduce((sum, p) => 
                sum + (p.diemDen.chiPhi.anUong + p.diemDen.chiPhi.luuTru + p.diemDen.chiPhi.diChuyen) * lichTrinhHienTai.soNguoi, 0
              );

              return (
                <TabPane tab={`Ngày ${day}`} key={day.toString()}>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId={`droppable-day-${day}`}>
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} style={{ minHeight: 100 }}>
                          {pointsInDay.length === 0 ? (
                            <Empty 
                              description={
                                <div>
                                  <Text type="secondary">Chưa có điểm đến nào trong ngày này</Text>
                                  <div style={{ marginTop: 12 }}>
                                    <Button icon={<PlusOutlined />} onClick={() => history.push('/du-lich/kham-pha')}>
                                      Thêm điểm đến
                                    </Button>
                                  </div>
                                </div>
                              } 
                            />
                          ) : (
                            pointsInDay.map((item, idx) => (
                              <React.Fragment key={item.id}>
                                <LichTrinhItem 
                                  item={item} 
                                  index={idx} 
                                  onRemove={xoaDiemKhoiLichTrinh}
                                />
                                {idx < pointsInDay.length - 1 && (
                                  <div style={{ 
                                    padding: '8px 0 20px 48px', 
                                    borderLeft: '2px dashed #d9d9d9', 
                                    marginLeft: 78,
                                    marginBlock: -12,
                                    position: 'relative'
                                  }}>
                                    <Badge 
                                      count={<ArrowRightOutlined style={{ color: '#d9d9d9' }} />} 
                                      style={{ position: 'absolute', top: '50%', left: -11, backgroundColor: '#fff', transform: 'translateY(-50%) rotate(90deg)' }}
                                    />
                                    <Text type="secondary">
                                      {(() => {
                                        const dist = calculateDistance(
                                          item.diemDen.viTri.lat, item.diemDen.viTri.lng,
                                          pointsInDay[idx + 1].diemDen.viTri.lat, pointsInDay[idx + 1].diemDen.viTri.lng
                                        );
                                        const timeMinutes = Math.round((dist / 40) * 60);
                                        return `→ Di chuyển: ~${dist.toFixed(1)} km | ~${timeMinutes} phút`;
                                      })()}
                                    </Text>
                                  </div>
                                )}
                              </React.Fragment>
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  <div style={{ marginTop: 24, textAlign: 'right', padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
                    <Text strong>Tổng chi phí ngày {day}: </Text>
                    <Text strong type="danger" style={{ fontSize: 18 }}>{formatCurrency(dayCost)}</Text>
                  </div>
                </TabPane>
              );
            })}
          </Tabs>
        </Col>

        <Col xs={24} lg={8}>
          <Card 
            title={<Title level={4} style={{ margin: 0 }}><WalletOutlined /> Tóm tắt lịch trình</Title>}
            bordered={false}
            style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', position: 'sticky', top: 24 }}
          >
            <Space direction="vertical" size={24} style={{ width: '100%' }}>
              <Row gutter={16}>
                <Col span={12}>
                  <Statistic 
                    title="Số ngày" 
                    value={daysCount} 
                    prefix={<CalendarOutlined />} 
                  />
                </Col>
                <Col span={12}>
                  <Statistic 
                    title="Số điểm" 
                    value={lichTrinhHienTai.cacDiem.length} 
                    prefix={<CompassOutlined />} 
                  />
                </Col>
              </Row>

              <Divider style={{ margin: '8px 0' }} />

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text type="secondary">Ngân sách tổng</Text>
                  <Text strong>{formatCurrency(lichTrinhHienTai.nganSachTong)}</Text>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text type="secondary">Dự tính hiện tại</Text>
                  <Text strong type={progressPercent > 100 ? 'danger' : 'success'}>
                    {formatCurrency(currentNganSach.tong)}
                  </Text>
                </div>
                
                <Progress 
                  percent={progressPercent} 
                  status={progressPercent > 100 ? 'exception' : (progressPercent > 90 ? 'active' : 'normal')}
                  strokeColor={progressPercent > 100 ? '#ff4d4f' : (progressPercent > 90 ? '#faad14' : '#52c41a')}
                />
                
                {progressPercent > 100 && (
                  <Text type="danger" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                    * Đã vượt ngân sách dự kiến!
                  </Text>
                )}
              </div>

              <Button 
                type="primary" 
                block 
                size="large" 
                icon={<WalletOutlined />}
                onClick={() => history.push('/du-lich/ngan-sach')}
              >
                Xem ngân sách chi tiết
              </Button>

              <Button icon={<CompassOutlined />} block onClick={() => history.push('/du-lich/kham-pha')}>
                Tiếp tục tìm điểm đến
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LichTrinhPage;
