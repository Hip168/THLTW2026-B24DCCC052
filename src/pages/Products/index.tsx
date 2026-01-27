
import React, { useState, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Modal,
  Form,
  InputNumber,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
  Slider,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
// Fix import path to map to src/models/product
// Since Umi models are global hooks, we import the Types, but consume via useModel
import type { Product } from '@/models/products';
import { formatCurrency } from '@/utils/format';

const { Option } = Select;

const ProductsPage: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useModel('products');
  const [form] = Form.useForm();

  // --- State ---
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Filters
  const [searchText, setSearchText] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | undefined>(undefined);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);

  // Derived Data
  const categories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category)));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Search Name
      const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
      
      // 2. Filter Category
      const matchesCategory = filterCategory ? product.category === filterCategory : true;
      
      // 3. Filter Price
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      
      // 4. Filter Status
      let status = '';
      if (product.quantity === 0) status = 'Hết hàng';
      else if (product.quantity <= 10) status = 'Sắp hết';
      else status = 'Còn hàng';
      
      const matchesStatus = filterStatus ? status === filterStatus : true;

      return matchesSearch && matchesCategory && matchesPrice && matchesStatus;
    });
  }, [products, searchText, filterCategory, filterStatus, priceRange]);

  // --- Actions ---
  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Product) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: number) => {
    deleteProduct(id);
    message.success('Đã xóa sản phẩm thành công');
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      if (editingProduct) {
        updateProduct(editingProduct.id, values);
        message.success('Cập nhật sản phẩm thành công');
      } else {
        addProduct(values);
        message.success('Thêm sản phẩm mới thành công');
      }
      setIsModalVisible(false);
    });
  };

  // --- Columns ---
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      sorter: (a: Product, b: Product) => a.name.localeCompare(b.name),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      sorter: (a: Product, b: Product) => a.price - b.price,
      render: (price: number) => formatCurrency(price),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'quantity',
      sorter: (a: Product, b: Product) => a.quantity - b.quantity,
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: Product) => {
        let color = 'green';
        let text = 'Còn hàng';
        if (record.quantity === 0) {
          color = 'red';
          text = 'Hết hàng';
        } else if (record.quantity <= 10) {
          color = 'orange';
          text = 'Sắp hết';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ color: '#1890ff' }}
          />
          <Popconfirm
            title="Bạn có chắc muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer title="Quản lý sản phẩm">
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col span={6}>
            <Input
              placeholder="Tìm kiếm theo tên..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Danh mục"
              allowClear
              style={{ width: '100%' }}
              onChange={(val) => setFilterCategory(val)}
            >
              {categories.map((c) => (
                <Option key={c} value={c}>
                  {c}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: '100%' }}
              onChange={(val) => setFilterStatus(val)}
            >
              <Option value="Còn hàng">Còn hàng</Option>
              <Option value="Sắp hết">Sắp hết</Option>
              <Option value="Hết hàng">Hết hàng</Option>
            </Select>
          </Col>
          <Col span={6}>
             <span style={{ marginRight: 8 }}>Giá (VNĐ):</span>
             <Slider
                range
                min={0}
                max={50000000}
                step={1000000}
                defaultValue={[0, 50000000]}
                onChange={(val) => setPriceRange(val)}
                style={{ width: '90%', display: 'inline-block', verticalAlign: 'middle' }}
              />
          </Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm sản phẩm
            </Button>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredProducts}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn hoặc nhập danh mục' }]}
          >
            {/* AutoComplete or Select with tags to allow new categories */}
             <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Giá (VNĐ)"
            rules={[
              { required: true, message: 'Vui lòng nhập giá' },
              { type: 'number', min: 1, message: 'Giá phải lớn hơn 0' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Số lượng tồn kho"
            rules={[
              { required: true, message: 'Vui lòng nhập số lượng' },
              { type: 'number', min: 0, message: 'Số lượng không được âm' },
            ]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ProductsPage;
