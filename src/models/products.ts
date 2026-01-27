
import { useState, useEffect } from 'react';
import { getLocalStorage, setLocalStorage } from '@/utils/storage';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

const PRODUCTS_KEY = 'products_data';

const defaultProducts: Product[] = [
  { id: 1, name: 'Laptop Dell XPS 13', category: 'Laptop', price: 25000000, quantity: 15 },
  { id: 2, name: 'iPhone 15 Pro Max', category: 'Điện thoại', price: 30000000, quantity: 8 },
  { id: 3, name: 'Samsung Galaxy S24', category: 'Điện thoại', price: 22000000, quantity: 20 },
  { id: 4, name: 'iPad Air M2', category: 'Máy tính bảng', price: 18000000, quantity: 5 },
  { id: 5, name: 'MacBook Air M3', category: 'Laptop', price: 28000000, quantity: 12 },
  { id: 6, name: 'AirPods Pro 2', category: 'Phụ kiện', price: 6000000, quantity: 0 },
  { id: 7, name: 'Samsung Galaxy Tab S9', category: 'Máy tính bảng', price: 15000000, quantity: 7 },
  { id: 8, name: 'Logitech MX Master 3', category: 'Phụ kiện', price: 2500000, quantity: 25 }
];

export default () => {
  const [products, setProducts] = useState<Product[]>(() => {
    return getLocalStorage(PRODUCTS_KEY, defaultProducts);
  });

  useEffect(() => {
    setLocalStorage(PRODUCTS_KEY, products);
  }, [products]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    // Generate simple numeric ID based on max existing ID
    const maxId = products.reduce((max, ctx) => Math.max(max, ctx.id), 0);
    const newProduct = { ...product, id: maxId + 1 };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: number, updatedData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedData } : item))
    );
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const updateStock = (id: number, delta: number) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty < 0 ? 0 : newQty };
        }
        return item;
      })
    );
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
  };
};
