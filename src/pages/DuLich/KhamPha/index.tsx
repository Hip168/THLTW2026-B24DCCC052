import React, { useState } from 'react';
import { 
  Row, Col, Input, Select, Rate, Button, 
  List, Modal, Drawer, Form, 
  DatePicker, InputNumber, Typography, 
  Space, Tag, Image 
} from 'antd';
import { 
  SyncOutlined, PlusOutlined, EnvironmentOutlined,
  ClockCircleOutlined, DollarOutlined, EyeOutlined
} from '@ant-design/icons';
import { useModel } from 'umi';
import type { DiemDen, FilterParams } from '@/types/duLich';
import DiemDenCard from '../components/DiemDenCard';
import moment from 'moment';
import '../index.less';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const KhamPha: React.FC = () => {
  const { 
    danhSachDiemDen, 
    loading, 
    fetchDanhSachDiemDen, 
    lichTrinhHienTai, 
    taoLichTrinhMoi, 
    themDiemVaoLichTrinh 
  } = useModel('duLich');

  const [filterParams, setFilterParams] = useState<FilterParams>({
    keyword: '',
    loaiHinh: 'all',
    mucChiPhi: 'all',
    rating: 0,
    sort: 'popular',
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDiemDen, setSelectedDiemDen] = useState<DiemDen | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [detailDiemDen, setDetailDiemDen] = useState<DiemDen | null>(null);
  const [form] = Form.useForm();

  const handleSearch = (value: string) => {
    const newParams = { ...filterParams, keyword: value };
    setFilterParams(newParams);
    fetchDanhSachDiemDen(newParams);
  };

  const handleFilterChange = (key: string, value: any) => {
    const newParams = { ...filterParams, [key]: value };
    setFilterParams(newParams);
    fetchDanhSachDiemDen(newParams);
  };

  const resetFilters = () => {
    const defaultParams = {
      keyword: '',
      loaiHinh: 'all',
      mucChiPhi: 'all',
      rating: 0,
      sort: 'popular',
    };
    setFilterParams(defaultParams);
    fetchDanhSachDiemDen(defaultParams);
  };

  const showAddToItineraryModal = (item: DiemDen) => {
    setSelectedDiemDen(item);
    setIsModalVisible(true);
  };

  const showDetailDrawer = (item: DiemDen) => {
    setDetailDiemDen(item);
    setIsDrawerVisible(true);
  };

  const handleAddConfirm = async (values: any) => {
    if (!selectedDiemDen) return;

    if (!lichTrinhHienTai) {
      const dates = values.dateRange;
      const newPlan = await taoLichTrinhMoi({
        tieuDe: values.tieuDe,
        ngayBatDau: dates[0].toISOString(),
        ngayKetThuc: dates[1].toISOString(),
        soNguoi: values.soNguoi,
        nganSachTong: values.nganSachTong,
      });
      if (newPlan) {
        await themDiemVaoLichTrinh(selectedDiemDen, values.ngay || 1);
        setIsModalVisible(false);
        form.resetFields();
      }
    } else {
      await themDiemVaoLichTrinh(selectedDiemDen, values.ngay);
      setIsModalVisible(false);
      form.resetFields();
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const loaiHinhLabels = {
    bien: { label: 'Biển', color: 'blue' },
    nui: { label: 'Núi', color: 'green' },
    thanhPho: { label: 'Thành phố', color: 'orange' },
    langQue: { label: 'Làng quê', color: 'gold' },
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 32 }}>
        <Title level={2}>Khám Phá Điểm Đến</Title>
        <Input.Search
          placeholder="Tìm kiếm điểm đến mơ ước của bạn..."
          size="large"
          allowClear
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ maxWidth: 600 }}
        />
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Text strong>Loại hình</Text>
          <Select
            value={filterParams.loaiHinh}
            onChange={(v) => handleFilterChange('loaiHinh', v)}
            style={{ width: '100%' }}
          >
            <Option value="all">Tất cả</Option>
            <Option value="bien">Biển</Option>
            <Option value="nui">Núi</Option>
            <Option value="thanhPho">Thành phố</Option>
            <Option value="langQue">Làng quê</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Text strong>Chi phí/ngày</Text>
          <Select
            value={filterParams.mucChiPhi}
            onChange={(v) => handleFilterChange('mucChiPhi', v)}
            style={{ width: '100%' }}
          >
            <Option value="all">Tất cả</Option>
            <Option value="under1">Dưới 1 triệu</Option>
            <Option value="1-3">1 - 3 triệu</Option>
            <Option value="over3">Trên 3 triệu</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Text strong>Đánh giá</Text>
          <Select
            value={filterParams.rating}
            onChange={(v) => handleFilterChange('rating', v)}
            style={{ width: '100%' }}
          >
            <Option value={0}>Tất cả</Option>
            <Option value={3}>3★ trở lên</Option>
            <Option value={4}>4★ trở lên</Option>
            <Option value={5}>5★</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4}>
          <Text strong>Sắp xếp</Text>
          <Select
            value={filterParams.sort}
            onChange={(v) => handleFilterChange('sort', v)}
            style={{ width: '100%' }}
          >
            <Option value="popular">Phổ biến</Option>
            <Option value="rating">Rating cao</Option>
            <Option value="priceAsc">Chi phí thấp → cao</Option>
            <Option value="priceDesc">Chi phí cao → thấp</Option>
          </Select>
        </Col>
        <Col xs={24} sm={12} md={6} lg={4} style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button icon={<SyncOutlined />} onClick={resetFilters} block>Reset bộ lọc</Button>
        </Col>
      </Row>

      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
        loading={loading}
        dataSource={danhSachDiemDen}
        renderItem={(item) => (
          <List.Item>
            <DiemDenCard 
              data={item} 
              onAdd={showAddToItineraryModal}
              onView={showDetailDrawer}
            />
          </List.Item>
        )}
      />

      {/* Modal Add to Itinerary */}
      <Modal
        title={lichTrinhHienTai ? `Thêm vào ${lichTrinhHienTai.tieuDe}` : "Khởi tạo lịch trình mới"}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={window.innerWidth < 576 ? "90vw" : 600}
      >
        <Form form={form} layout="vertical" onFinish={handleAddConfirm}>
          {!lichTrinhHienTai ? (
            <>
              <Form.Item name="tieuDe" label="Tiêu đề chuyến đi" rules={[{ required: true }]}>
                <Input placeholder="Ví dụ: Du hè Đà Nẵng 2026" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="dateRange" label="Thời gian" rules={[{ required: true }]}>
                    <RangePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
                  </Form.Item>
                </Col>
              </Row>
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
            </>
          ) : (
            <Form.Item name="ngay" label="Chọn ngày" initialValue={1} rules={[{ required: true }]}>
              <Select placeholder="Chọn ngày trong chuyến đi">
                {Array.from({ length: moment(lichTrinhHienTai.ngayKetThuc).diff(moment(lichTrinhHienTai.ngayBatDau), 'days') + 1 }).map((_, i) => (
                  <Option key={i + 1} value={i + 1}>Ngày {i + 1}</Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>

      {/* Drawer Detail */}
      <Drawer
        title={detailDiemDen?.ten}
        placement="right"
        width={window.innerWidth < 576 ? "100%" : 600}
        onClose={() => setIsDrawerVisible(false)}
        visible={isDrawerVisible}
      >
        {detailDiemDen && (
          <div>
            <Image
              src={detailDiemDen.hinhAnh}
              style={{ width: '100%', height: 350, objectFit: 'cover', borderRadius: 8, marginBottom: 24 }}
            />
            
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
              <Col>
                <Tag color={loaiHinhLabels[detailDiemDen.loaiHinh].color} style={{ fontSize: 14, padding: '4px 12px' }}>
                  {loaiHinhLabels[detailDiemDen.loaiHinh].label}
                </Tag>
              </Col>
              <Col>
                <Space size={16}>
                  <Space><EyeOutlined /> {detailDiemDen.luotXem.toLocaleString()}</Space>
                  <Rate disabled defaultValue={detailDiemDen.rating} allowHalf />
                </Space>
              </Col>
            </Row>

            <Title level={4}>Mô tả</Title>
            <Paragraph style={{ fontSize: 16 }}>{detailDiemDen.moTa}</Paragraph>

            <Row gutter={16} style={{ marginTop: 24 }}>
              <Col span={12}>
                <div style={{ padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
                  <Text type="secondary"><EnvironmentOutlined /> Địa chỉ</Text>
                  <div style={{ marginTop: 8 }}>{detailDiemDen.viTri.diaChi}</div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ padding: 16, backgroundColor: '#f9f9f9', borderRadius: 8 }}>
                  <Text type="secondary"><ClockCircleOutlined /> Thời gian tham quan gợi ý</Text>
                  <div style={{ marginTop: 8, fontWeight: 'bold' }}>{detailDiemDen.thoiGianThamQuan} giờ</div>
                </div>
              </Col>
            </Row>

            <Title level={4} style={{ marginTop: 32 }}><DollarOutlined /> Chi phí ước tính/ngày</Title>
            <List
              bordered
              dataSource={[
                { label: 'Ăn uống', value: detailDiemDen.chiPhi.anUong },
                { label: 'Lưu trú', value: detailDiemDen.chiPhi.luuTru },
                { label: 'Di chuyển', value: detailDiemDen.chiPhi.diChuyen },
              ]}
              renderItem={item => (
                <List.Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text>{item.label}</Text>
                  <Text strong>{formatCurrency(item.value)}</Text>
                </List.Item>
              )}
              footer={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>Tổng cộng</Text>
                  <Text strong type="danger" style={{ fontSize: 18 }}>
                    {formatCurrency(detailDiemDen.chiPhi.anUong + detailDiemDen.chiPhi.luuTru + detailDiemDen.chiPhi.diChuyen)}
                  </Text>
                </div>
              }
            />

            <Button 
              type="primary" 
              size="large" 
              block 
              style={{ marginTop: 40 }}
              icon={<PlusOutlined />}
              onClick={() => {
                setIsDrawerVisible(false);
                showAddToItineraryModal(detailDiemDen);
              }}
            >
              Thêm vào lịch trình ngay
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default KhamPha;
