
import { useState, useEffect } from 'react';
import { useModel } from 'umi';
import { getLocalStorage, setLocalStorage } from '@/utils/storage';

export type OrderStatus = 'Chờ xử lý' | 'Đang giao' | 'Hoàn thành' | 'Đã hủy';

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  products: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

const ORDERS_KEY = 'orders_data';

const defaultOrders: Order[] = [
  {
    id: 'DH001',
    customerName: 'Nguyễn Văn A',
    phone: '0912345678',
    address: '123 Nguyễn Huệ, Q1, TP.HCM',
    products: [{ productId: 1, productName: 'Laptop Dell XPS 13', quantity: 1, price: 25000000 }],
    totalAmount: 25000000,
    status: 'Chờ xử lý',
    createdAt: '2024-01-15',
  },
];

export default () => {
  const [orders, setOrders] = useState<Order[]>(() => {
    return getLocalStorage(ORDERS_KEY, defaultOrders);
  });
  
  // Connect to products model to update stock
  const { updateStock } = useModel('products');

  useEffect(() => {
    setLocalStorage(ORDERS_KEY, orders);
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    // Generate Order ID: DH + 3 digits
    const lastNum = orders.reduce((max, order) => {
        const num = parseInt(order.id.replace('DH', ''), 10);
        return isNaN(num) ? max : Math.max(max, num);
    }, 0);
    
    const newId = `DH${String(lastNum + 1).padStart(3, '0')}`;

    const newOrder: Order = {
      ...orderData,
      id: newId,
      status: 'Chờ xử lý',
      createdAt: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };
    setOrders((prev) => [...prev, newOrder]);
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const oldStatus = order.status;
    if (oldStatus === newStatus) return;

    // Inventory Logic
    // Rule: Subtract when entering 'Hoàn thành'. Add back when leaving 'Hoàn thành'.
    
    // 1. Transition TO 'Hoàn thành'
    if (newStatus === 'Hoàn thành' && oldStatus !== 'Hoàn thành') {
        order.products.forEach(item => {
            updateStock(item.productId, -item.quantity);
        });
    }
    
    // 2. Transition FROM 'Hoàn thành'
    if (oldStatus === 'Hoàn thành' && newStatus !== 'Hoàn thành') {
        order.products.forEach(item => {
            updateStock(item.productId, item.quantity);
        });
    }

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return {
    orders,
    addOrder,
    updateOrderStatus,
  };
};
