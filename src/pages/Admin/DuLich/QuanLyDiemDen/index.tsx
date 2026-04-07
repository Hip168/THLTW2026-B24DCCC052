import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Space, Input, Select, 
  Tag, Modal, Form, InputNumber, Rate, 
  message, Popconfirm, Avatar, Typography,
  Card, Row, Col
} from 'antd';
import { 
  PlusOutlined, SearchOutlined, EditOutlined, 
  DeleteOutlined, UploadOutlined, EnvironmentOutlined
} from '@ant-design/icons';
import * as duLichService from '@/services/duLich';
import type { DiemDen } from '@/types/duLich';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const QuanLyDiemDen: React.FC = () => {
  const [data, setData] = useState<DiemDen[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<DiemDen | null>(null);
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    loaiHinh: 'all',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await duLichService.getDanhSachDiemDen(searchParams);
      setData(res);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (item: DiemDen) => {
    setEditingItem(item);
    form.setFieldsValue(item);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await duLichService.xoaDiemDen(id);
      message.success('Đã xóa điểm đến');
      fetchData();
    } catch (error) {
      message.error('Lỗi khi xóa');
    }
  };

  const handleModalOk = async (values: any) => {
    try {
      if (editingItem) {
        await duLichService.suaDiemDen(editingItem.id, values);
        message.success('Cập nhật thành công');
      } else {
        await duLichService.themDiemDen({
          ...values,
          hinhAnh: values.hinhAnh || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
        });
        message.success('Thêm mới thành công');
      }
      setIsModalVisible(false);
      fetchData();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const loaiHinhLabels = {
    bien: { label: 'Biển', color: 'blue' },
    nui: { label: 'Núi', color: 'green' },
    thanhPho: { label: 'Thành phố', color: 'orange' },
    langQue: { label: 'Làng quê', color: 'gold' },
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'hinhAnh',
      key: 'hinhAnh',
      width: 100,
      render: (src: string) => <Avatar shape="square" size={64} src={src} />,
    },
    {
      title: 'Điểm đến',
      key: 'diemDen',
      render: (_: any, record: DiemDen) => (
        <div>
          <Title level={5} style={{ margin: 0 }}>{record.ten}</Title>
          <Tag color={loaiHinhLabels[record.loaiHinh].color}>{loaiHinhLabels[record.loaiHinh].label}</Tag>
        </div>
      ),
    },
    {
      title: 'Chi phí/Ngày',
      key: 'chiPhi',
      render: (_: any, record: DiemDen) => {
        const total = record.chiPhi.anUong + record.chiPhi.luuTru + record.chiPhi.diChuyen;
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total);
      },
    },
    {
      title: 'TG tham quan',
      dataIndex: 'thoiGianThamQuan',
      key: 'thoiGianThamQuan',
      render: (val: number) => `${val} giờ`,
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (val: number) => <Rate disabled defaultValue={val} allowHalf />,
    },
    {
      title: 'Lượt xem',
      dataIndex: 'luotXem',
      key: 'luotXem',
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: DiemDen) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>Sửa</Button>
          <Popconfirm title="Bạn có chắc muốn xóa điểm này?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card style={{ marginBottom: 24 }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col span={12}>
            <Title level={3} style={{ margin: 0 }}>Quản Lý Điểm Đến</Title>
          </Col>
          <Col>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large">
              Thêm điểm đến mới
            </Button>
          </Col>
        </Row>
        
        <Row gutter={16} style={{ marginTop: 24 }}>
          <Col span={8}>
            <Input 
              placeholder="Tìm theo tên..." 
              prefix={<SearchOutlined />} 
              onChange={(e) => setSearchParams({ ...searchParams, keyword: e.target.value })}
            />
          </Col>
          <Col span={6}>
            <Select 
              style={{ width: '100%' }} 
              placeholder="Lọc theo loại hình"
              defaultValue="all"
              onChange={(v) => setSearchParams({ ...searchParams, loaiHinh: v })}
            >
              <Option value="all">Tất cả loại hình</Option>
              <Option value="bien">Biển</Option>
              <Option value="nui">Núi</Option>
              <Option value="thanhPho">Thành phố</Option>
              <Option value="langQue">Làng quê</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      <Table 
        columns={columns} 
        dataSource={data} 
        rowKey="id" 
        loading={loading}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={editingItem ? 'Sửa điểm đến' : 'Thêm điểm đến mới'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => form.submit()}
        width={700}
      >
        <Form form={form} layout="vertical" onFinish={handleModalOk}>
          <Row gutter={16}>
            <Col span={16}>
              <Form.Item name="ten" label="Tên điểm đến" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
                <Input placeholder="Ví dụ: Vịnh Hạ Long" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="loaiHinh" label="Loại hình" rules={[{ required: true }]}>
                <Select placeholder="Chọn loại hình">
                  <Option value="bien">Biển</Option>
                  <Option value="nui">Núi</Option>
                  <Option value="thanhPho">Thành phố</Option>
                  <Option value="langQue">Làng quê</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="moTa" label="Mô tả" rules={[{ required: true, min: 50, message: 'Mô tả tối thiểu 50 ký tự' }]}>
            <TextArea rows={4} placeholder="Nhập mô tả chi tiết về điểm đến..." />
          </Form.Item>

          <Form.Item name="viTri" label="Vị trí & Địa chỉ" rules={[{ required: true }]}>
            <div style={{ display: 'flex', gap: 8 }}>
              <Form.Item name={['viTri', 'diaChi']} noStyle rules={[{ required: true }]}>
                <Input prefix={<EnvironmentOutlined />} placeholder="Địa chỉ chi tiết" style={{ flex: 1 }} />
              </Form.Item>
              <Form.Item name={['viTri', 'lat']} noStyle>
                <InputNumber placeholder="Lat" style={{ width: 80 }} />
              </Form.Item>
              <Form.Item name={['viTri', 'lng']} noStyle>
                <InputNumber placeholder="Lng" style={{ width: 80 }} />
              </Form.Item>
            </div>
          </Form.Item>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item name="thoiGianThamQuan" label="TG tham quan (h)" rules={[{ required: true }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={['chiPhi', 'anUong']} label="Ăn uống/Ngày" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={['chiPhi', 'luuTru']} label="Lưu trú/Đêm" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name={['chiPhi', 'diChuyen']} label="Di chuyển" rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="rating" label="Rating ban đầu" initialValue={5}>
                <Rate allowHalf />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item name="hinhAnh" label="Hình ảnh (URL)">
                <Input prefix={<UploadOutlined />} placeholder="Dán link hình ảnh vào đây" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default QuanLyDiemDen;
