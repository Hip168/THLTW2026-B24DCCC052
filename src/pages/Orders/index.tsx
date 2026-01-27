
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
  message,
  Card,
  Row,
  Col,
  DatePicker,
  Statistic,
  List,
  Typography,
} from 'antd';
import { PlusOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { Order, OrderItem, OrderStatus } from '@/models/orders';
import { formatCurrency, formatDate } from '@/utils/format';
import moment from 'moment';

const { Option } = Select;
const { RangePicker } = DatePicker;

const OrdersPage: React.FC = () => {
  const { orders, addOrder, updateOrderStatus } = useModel('orders');
  const { products } = useModel('products');
  const [form] = Form.useForm();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [currentTotal, setCurrentTotal] = useState(0);

  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[moment.Moment, moment.Moment] | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const keyword = searchText.toLowerCase();
      const matchesSearch =
        order.id.toLowerCase().includes(keyword) ||
        order.customerName.toLowerCase().includes(keyword);

      const matchesStatus = filterStatus ? order.status === filterStatus : true;

      let matchesDate = true;
      if (dateRange) {
        const orderDate = moment(order.createdAt);
        matchesDate = orderDate.isBetween(dateRange[0], dateRange[1], 'day', '[]');
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [orders, searchText, filterStatus, dateRange]);

  const handleAdd = () => {
    form.resetFields();
    setCurrentTotal(0);
    setIsModalVisible(true);
  };

  const calculateTotal = (items: OrderItem[]) => {
      return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleFormValuesChange = (_: any, allValues: any) => {
      if (allValues.products) {
          let total = 0;
          allValues.products.forEach((idxItem: any) => {
              if (idxItem && idxItem.productId && idxItem.quantity) {
                  const product = products.find(p => p.id === idxItem.productId);
                  if (product) {
                      total += product.price * idxItem.quantity;
                  }
              }
          });
          setCurrentTotal(total);
      }
  };

  const handleModalOk = () => {
    form.validateFields().then((values) => {
      const orderItems: OrderItem[] = values.products.map((item: any) => {
          const product = products.find(p => p.id === item.productId);
          return {
              productId: item.productId,
              productName: product?.name || 'Unknown',
              quantity: item.quantity,
              price: product?.price || 0,
          };
      });

      const totalAmount = calculateTotal(orderItems);

      addOrder({
          customerName: values.customerName,
          phone: values.phone,
          address: values.address,
          products: orderItems,
          totalAmount: totalAmount,
      });

      message.success('Tạo đơn hàng thành công');
      setIsModalVisible(false);
    });
  };

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
      updateOrderStatus(orderId, newStatus);
      message.success(`Đã cập nhật trạng thái đơn hàng ${orderId}`);
  };

  const viewDetail = (order: Order) => {
      setSelectedOrder(order);
      setDetailVisible(true);
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
    },
    {
      title: 'Số SP',
      key: 'itemCount',
      render: (_: any, record: Order) => record.products.length,
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      sorter: (a: Order, b: Order) => a.totalAmount - b.totalAmount,
      render: (val: number) => formatCurrency(val),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      sorter: (a: Order, b: Order) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (val: string) => formatDate(val),
    },
    {
      title: 'Trạng thái',
      key: 'status',
      render: (_: any, record: Order) => (
        <Select
            value={record.status}
            onChange={(val) => handleStatusChange(record.id, val)}
            style={{ width: 140 }}
            status={record.status === 'Đã hủy' ? 'error' : record.status === 'Hoàn thành' ? 'success' : 'warning'}
        >
            <Option value="Chờ xử lý">Chờ xử lý</Option>
            <Option value="Đang giao">Đang giao</Option>
            <Option value="Hoàn thành">Hoàn thành</Option>
            <Option value="Đã hủy">Đã hủy</Option>
        </Select>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Order) => (
        <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => viewDetail(record)}
        >
            Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <PageContainer title="Quản lý đơn hàng">
      <Card bordered={false} style={{ marginBottom: 24 }}>
        <Row gutter={[16, 16]} align="middle">
          <Col span={6}>
            <Input
              placeholder="Tìm theo Mã ĐH hoặc Tên KH..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Trạng thái"
              allowClear
              style={{ width: '100%' }}
              onChange={(val) => setFilterStatus(val)}
            >
              <Option value="Chờ xử lý">Chờ xử lý</Option>
              <Option value="Đang giao">Đang giao</Option>
              <Option value="Hoàn thành">Hoàn thành</Option>
              <Option value="Đã hủy">Đã hủy</Option>
            </Select>
          </Col>
          <Col span={6}>
             <RangePicker 
                style={{ width: '100%' }} 
                onChange={(dates: any) => setDateRange(dates)}
             />
          </Col>
          <Col span={8} style={{ textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Tạo đơn hàng mới
            </Button>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Tạo đơn hàng mới"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        destroyOnClose
      >
        <Form 
            form={form} 
            layout="vertical" 
            onValuesChange={handleFormValuesChange}
        >
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item name="customerName" label="Tên khách hàng" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item 
                        name="phone" 
                        label="Số điện thoại" 
                        rules={[
                            { required: true },
                            { pattern: /^\d{10,11}$/, message: 'SĐT không hợp lệ' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
                <Input.TextArea rows={2} />
            </Form.Item>

            <Typography.Title level={5}>Sản phẩm</Typography.Title>
            <Form.List name="products" initialValue={[{}]}>
                {(fields, { add, remove }) => (
                    <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                            <Row key={key} gutter={16} align="middle">
                                <Col span={12}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'productId']}
                                        fieldKey={[fieldKey, 'productId']}
                                        rules={[{ required: true, message: 'Chọn SP' }]}
                                    >
                                        <Select placeholder="Chọn sản phẩm" showSearch optionFilterProp="children">
                                            {products.filter(p => p.quantity > 0).map(p => (
                                                <Option key={p.id} value={p.id}>
                                                    {p.name} (Tồn: {p.quantity}) - {formatCurrency(p.price)}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'quantity']}
                                        fieldKey={[fieldKey, 'quantity']}
                                        rules={[{ required: true, message: 'SL' }]}
                                        dependencies={[['products', name, 'productId']]}
                                    >
                                        <InputNumber min={1} placeholder="SL" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={2}>
                                    <Button type="text" danger icon={<PlusOutlined rotate={45} />} onClick={() => remove(name)} />
                                </Col>
                            </Row>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                Thêm sản phẩm
                            </Button>
                        </Form.Item>
                    </>
                )}
            </Form.List>
            
            <div style={{ textAlign: 'right', marginTop: 16 }}>
                <Statistic title="Tổng tiền đơn hàng" value={currentTotal} precision={0} formatter={(val) => formatCurrency(Number(val))} />
            </div>
        </Form>
      </Modal>

      <Modal
        title="Chi tiết đơn hàng"
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
            <Button key="close" onClick={() => setDetailVisible(false)}>Đóng</Button>
        ]}
        width={700}
      >
        {selectedOrder && (
            <div>
                <Card bordered={false} size="small" title="Thông tin khách hàng" style={{ backgroundColor: '#f5f5f5', marginBottom: 16 }}>
                    <p><strong>Khách hàng:</strong> {selectedOrder.customerName}</p>
                    <p><strong>SĐT:</strong> {selectedOrder.phone}</p>
                    <p><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
                    <p><strong>Ngày đặt:</strong> {formatDate(selectedOrder.createdAt)}</p>
                    <p><strong>Trạng thái:</strong> <Tag color="blue">{selectedOrder.status}</Tag></p>
                </Card>
                
                <Typography.Title level={5}>Danh sách sản phẩm</Typography.Title>
                <Table
                    dataSource={selectedOrder.products}
                    rowKey="id"
                    pagination={false}
                    columns={[
                        { title: 'Sản phẩm', dataIndex: 'productName' },
                        { title: 'Đơn giá', dataIndex: 'price', render: (val) => formatCurrency(val) },
                        { title: 'SL', dataIndex: 'quantity' },
                        { title: 'Thành tiền', render: (_, r) => formatCurrency(r.price * r.quantity) }
                    ]}
                    summary={() => {
                        return (
                            <Table.Summary.Row>
                                <Table.Summary.Cell index={0} colSpan={3} align="right"><strong>Tổng cộng:</strong></Table.Summary.Cell>
                                <Table.Summary.Cell index={1}><strong>{formatCurrency(selectedOrder.totalAmount)}</strong></Table.Summary.Cell>
                            </Table.Summary.Row>
                        );
                    }}
                />
            </div>
        )}
      </Modal>
    </PageContainer>
  );
};

export default OrdersPage;
