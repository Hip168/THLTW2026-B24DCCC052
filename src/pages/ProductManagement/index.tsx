import React, { useState, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Table, Button, Input, Modal, Form, InputNumber, Popconfirm, message, Space } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

// 1. Mock Data
interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const initialData: Product[] = [
  { id: 1, name: 'Laptop Dell XPS 13', price: 25000000, quantity: 10 },
  { id: 2, name: 'iPhone 15 Pro Max', price: 30000000, quantity: 15 },
  { id: 3, name: 'Samsung Galaxy S24', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', price: 18000000, quantity: 12 },
  { id: 5, name: 'MacBook Air M3', price: 28000000, quantity: 8 },
];

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(initialData);
  const [searchText, setSearchText] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();

  // 3. Delete Product
  const handleDelete = (id: number) => {
    const newProducts = products.filter((item) => item.id !== id);
    setProducts(newProducts);
    message.success('Deleted product successfully');
  };

  // 2. Add New Product
  const handleAdd = (values: any) => {
    const newProduct: Product = {
      id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
      name: values.name,
      price: values.price,
      quantity: values.quantity,
    };
    setProducts([...products, newProduct]);
    message.success('Added product successfully');
    setIsModalVisible(false);
    form.resetFields();
  };

  // 4. Search functionality with realtime update
  const filteredProducts = useMemo(() => {
    if (!searchText) return products;
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [products, searchText]);

  const columns = [
    {
      title: 'Index',
      dataIndex: 'index',
      key: 'index',
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (text: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(text),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Actions',
      key: 'action',
      render: (_: any, record: Product) => (
        <Popconfirm
          title="Are you sure you want to delete this product?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <PageContainer>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Input.Search
            placeholder="Search by name"
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
            Add Product
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Space>

      <Modal
        title="Add New Product"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name' }]}
          >
            <Input placeholder="Enter product name" />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[
              { required: true, message: 'Please enter price' },
              { type: 'number', min: 0, message: 'Price must be positive' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value ? value.replace(/\$\s?|(,*)/g, '') : ''}
              addonAfter="VND"
            />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Quantity"
            rules={[
              { required: true, message: 'Please enter quantity' },
              { type: 'number', min: 0, message: 'Quantity must be positive integer' },
              // Integer check can be done via regex or custom validator if strict integer is needed, 
              // but InputNumber with precision 0 forces integer usually.
            ]}
          >
            <InputNumber style={{ width: '100%' }} precision={0} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ProductManagement;
