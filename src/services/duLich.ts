import type { DiemDen, LichTrinh, FilterParams } from '@/types/duLich';

const MOCK_DIEM_DEN: DiemDen[] = [
  {
    id: '1',
    ten: 'Hội An',
    moTa: 'Phố cổ Hội An với những con đường đèn lồng rực rỡ, kiến trúc cổ kính và ẩm thực độc đáo.',
    hinhAnh: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=800',
    loaiHinh: 'bien',
    rating: 5,
    thoiGianThamQuan: 4,
    chiPhi: { anUong: 300000, luuTru: 800000, diChuyen: 200000 },
    viTri: { lat: 15.8801, lng: 108.338, diaChi: 'Quảng Nam, Việt Nam' },
    luotXem: 12500,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    ten: 'Đà Nẵng',
    moTa: 'Thành phố đáng sống với những bãi biển đẹp, Cầu Vàng nổi tiếng và cuộc sống hiện đại.',
    hinhAnh: 'https://images.unsplash.com/photo-1559592413-7ece35b49273?auto=format&fit=crop&q=80&w=800',
    loaiHinh: 'bien',
    rating: 4.8,
    thoiGianThamQuan: 6,
    chiPhi: { anUong: 400000, luuTru: 1200000, diChuyen: 300000 },
    viTri: { lat: 16.0544, lng: 108.2022, diaChi: 'Đà Nẵng, Việt Nam' },
    luotXem: 15600,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    ten: 'Phú Quốc',
    moTa: 'Đảo Ngọc với những bãi cát trắng mịn, nước biển trong xanh và các khu nghỉ dưỡng cao cấp.',
    hinhAnh: 'https://images.unsplash.com/photo-1589779202435-841f888b17c2?auto=format&fit=crop&q=80&w=800',
    loaiHinh: 'bien',
    rating: 4.7,
    thoiGianThamQuan: 8,
    chiPhi: { anUong: 600000, luuTru: 2500000, diChuyen: 500000 },
    viTri: { lat: 10.2899, lng: 103.984, diaChi: 'Kiên Giang, Việt Nam' },
    luotXem: 18900,
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    ten: 'Sa Pa',
    moTa: 'Thị trấn trong sương với những ruộng bậc thang hùng vĩ và văn hóa các dân tộc thiểu số.',
    hinhAnh: 'https://images.unsplash.com/photo-1504457047772-27fb10f442d1?auto=format&fit=crop&q=80&w=800',
    loaiHinh: 'nui',
    rating: 4.9,
    thoiGianThamQuan: 6,
    chiPhi: { anUong: 350000, luuTru: 1500000, diChuyen: 400000 },
    viTri: { lat: 22.3364, lng: 103.8438, diaChi: 'Lào Cai, Việt Nam' },
    luotXem: 14200,
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    ten: 'Đà Lạt',
    moTa: 'Thành phố ngàn hoa với khí hậu ôn hòa, những rừng thông bạt ngàn và kiến trúc Pháp cổ.',
    hinhAnh: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800',
    loaiHinh: 'nui',
    rating: 4.6,
    thoiGianThamQuan: 5,
    chiPhi: { anUong: 300000, luuTru: 1000000, diChuyen: 250000 },
    viTri: { lat: 11.9404, lng: 108.4583, diaChi: 'Lâm Đồng, Việt Nam' },
    luotXem: 22000,
    createdAt: new Date().toISOString(),
  },
  {
    id: '6',
    ten: 'Hà Giang',
    moTa: 'Vùng đất địa đầu tổ quốc với cao nguyên đá Đồng Văn hùng vĩ và Mã Pí Lèng - một trong tứ đại đỉnh đèo.',
    hinhAnh: 'https://images.unsplash.com/photo-1581395568285-d86665796214?auto=format&fit=crop&q=80&w=800',
    loaiHinh: 'nui',
    rating: 5,
    thoiGianThamQuan: 10,
    chiPhi: { anUong: 250000, luuTru: 500000, diChuyen: 600000 },
    viTri: { lat: 22.8233, lng: 104.9836, diaChi: 'Hà Giang, Việt Nam' },
    luotXem: 9800,
    createdAt: new Date().toISOString(),
  },
  {
    id: '7',
    ten: 'Hà Nội',
    moTa: 'Thủ đô nghìn năm văn hiến với 36 phố phường sôi động, hồ Gươm thơ mộng và ẩm thực tinh tế.',
    hinhAnh: 'https://images.unsplash.com/photo-1509030450996-dd1a26dda07a?auto=format&fit=crop&q=80&w=800',
    loaiHinh: 'thanhPho',
    rating: 4.5,
    thoiGianThamQuan: 4,
    chiPhi: { anUong: 500000, luuTru: 1500000, diChuyen: 300000 },
    viTri: { lat: 21.0285, lng: 105.8542, diaChi: 'Hà Nội, Việt Nam' },
    luotXem: 25000,
    createdAt: new Date().toISOString(),
  },
  {
    id: '8',
    ten: 'TP. Hồ Chí Minh',
    moTa: 'Thành phố năng động nhất Việt Nam với những tòa nhà chọc trời, cuộc sống về đêm sôi động.',
    hinhAnh: 'https://images.unsplash.com/photo-1544254215-dc34a94fe969?auto=format&fit=crop&q=80&w=800',
    loaiHinh: 'thanhPho',
    rating: 4.4,
    thoiGianThamQuan: 4,
    chiPhi: { anUong: 600000, luuTru: 1800000, diChuyen: 400000 },
    viTri: { lat: 10.7626, lng: 106.6602, diaChi: 'TP.HCM, Việt Nam' },
    luotXem: 28000,
    createdAt: new Date().toISOString(),
  },
  {
    id: '9',
    ten: 'Huế',
    moTa: 'Cố đô với những lăng tẩm cung điện uy nghiêm, nhã nhạc cung đình và ẩm thực hoàng gia.',
    hinhAnh: 'https://images.unsplash.com/photo-1599708145804-aa2c6d944222?auto=format&fit=crop&q=80&w=800',
    loaiHinh: 'thanhPho',
    rating: 4.8,
    thoiGianThamQuan: 5,
    chiPhi: { anUong: 300000, luuTru: 900000, diChuyen: 200000 },
    viTri: { lat: 16.4637, lng: 107.5905, diaChi: 'Thừa Thiên Huế, Việt Nam' },
    luotXem: 11000,
    createdAt: new Date().toISOString(),
  },
  {
    id: '10',
    ten: 'Ninh Bình',
    moTa: 'Vùng đất cố đô với danh thắng Tràng An - Tam Cốc mộng mơ, được ví như Hạ Long trên cạn.',
    hinhAnh: 'https://images.unsplash.com/photo-1594895693444-96696b055306?auto=format&fit=crop&q=80&w=800',
    loaiHinh: 'langQue',
    rating: 4.9,
    thoiGianThamQuan: 6,
    chiPhi: { anUong: 300000, luuTru: 1200000, diChuyen: 350000 },
    viTri: { lat: 20.2506, lng: 105.9745, diaChi: 'Ninh Bình, Việt Nam' },
    luotXem: 13500,
    createdAt: new Date().toISOString(),
  },
  {
    id: '11',
    ten: 'Mộc Châu',
    moTa: 'Cao nguyên đầy hoa với những đồi chè xanh mướt, hoa mận trắng xóa mỗi độ xuân về.',
    hinhAnh: 'https://images.unsplash.com/photo-1614704040973-2e0f46c6ea19?auto=format&fit=crop&q=80&w=800',
    loaiHinh: 'langQue',
    rating: 4.7,
    thoiGianThamQuan: 5,
    chiPhi: { anUong: 250000, luuTru: 600000, diChuyen: 400000 },
    viTri: { lat: 20.8465, lng: 104.6534, diaChi: 'Sơn La, Việt Nam' },
    luotXem: 8500,
    createdAt: new Date().toISOString(),
  },
  {
    id: '12',
    ten: 'Côn Đảo',
    moTa: 'Hòn đảo hoang sơ với những bãi biển tuyệt đẹp, di tích lịch sử linh thiêng và hệ sinh thái đa dạng.',
    hinhAnh: 'https://images.unsplash.com/photo-1534008757030-2670ca4356e1?auto=format&fit=crop&q=80&w=800',
    loaiHinh: 'langQue',
    rating: 4.8,
    thoiGianThamQuan: 6,
    chiPhi: { anUong: 450000, luuTru: 2000000, diChuyen: 500000 },
    viTri: { lat: 8.6811, lng: 106.6067, diaChi: 'Bà Rịa - Vũng Tàu, Việt Nam' },
    luotXem: 7200,
    createdAt: new Date().toISOString(),
  },
];

const LOCAL_STORAGE_KEYS = {
  DIEM_DEN: 'travel_planner_destinations',
  LICH_TRINH: 'travel_planner_itineraries',
};

const getStorageItem = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
};

const setStorageItem = <T>(key: string, value: T): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getDanhSachDiemDen = async (params?: FilterParams): Promise<DiemDen[]> => {
  let data = getStorageItem<DiemDen[]>(LOCAL_STORAGE_KEYS.DIEM_DEN, MOCK_DIEM_DEN);

  if (params?.keyword) {
    data = data.filter((d) => d.ten.toLowerCase().includes(params.keyword!.toLowerCase()));
  }

  if (params?.loaiHinh && params.loaiHinh !== 'all') {
    data = data.filter((d) => d.loaiHinh === params.loaiHinh);
  }

  if (params?.mucChiPhi) {
    data = data.filter((d) => {
      const totalCost = d.chiPhi.anUong + d.chiPhi.luuTru + d.chiPhi.diChuyen;
      if (params.mucChiPhi === 'under1') return totalCost < 1000000;
      if (params.mucChiPhi === '1-3') return totalCost >= 1000000 && totalCost <= 3000000;
      if (params.mucChiPhi === 'over3') return totalCost > 3000000;
      return true;
    });
  }

  if (params?.rating) {
    data = data.filter((d) => d.rating >= params.rating!);
  }

  if (params?.sort) {
    data.sort((a, b) => {
      if (params.sort === 'rating') return b.rating - a.rating;
      if (params.sort === 'priceAsc') {
        const costA = a.chiPhi.anUong + a.chiPhi.luuTru + a.chiPhi.diChuyen;
        const costB = b.chiPhi.anUong + b.chiPhi.luuTru + b.chiPhi.diChuyen;
        return costA - costB;
      }
      if (params.sort === 'priceDesc') {
        const costA = a.chiPhi.anUong + a.chiPhi.luuTru + a.chiPhi.diChuyen;
        const costB = b.chiPhi.anUong + b.chiPhi.luuTru + b.chiPhi.diChuyen;
        return costB - costA;
      }
      return b.luotXem - a.luotXem;
    });
  }

  return new Promise((resolve) => setTimeout(() => resolve(data), 500));
};

export const getDiemDenById = async (id: string): Promise<DiemDen> => {
  const data = getStorageItem<DiemDen[]>(LOCAL_STORAGE_KEYS.DIEM_DEN, MOCK_DIEM_DEN);
  const item = data.find((d) => d.id === id);
  if (!item) throw new Error('Không tìm thấy điểm đến');
  return new Promise((resolve) => setTimeout(() => resolve(item), 300));
};

export const themDiemDen = async (data: Omit<DiemDen, 'id' | 'createdAt'>): Promise<DiemDen> => {
  const current = getStorageItem<DiemDen[]>(LOCAL_STORAGE_KEYS.DIEM_DEN, MOCK_DIEM_DEN);
  const newItem: DiemDen = {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    luotXem: 0,
  };
  setStorageItem(LOCAL_STORAGE_KEYS.DIEM_DEN, [newItem, ...current]);
  return newItem;
};

export const suaDiemDen = async (id: string, data: Partial<DiemDen>): Promise<DiemDen> => {
  const current = getStorageItem<DiemDen[]>(LOCAL_STORAGE_KEYS.DIEM_DEN, MOCK_DIEM_DEN);
  const index = current.findIndex((d) => d.id === id);
  if (index === -1) throw new Error('Không tìm thấy điểm đến');
  const updatedItem = { ...current[index], ...data };
  current[index] = updatedItem;
  setStorageItem(LOCAL_STORAGE_KEYS.DIEM_DEN, current);
  return updatedItem;
};

export const xoaDiemDen = async (id: string): Promise<void> => {
  const current = getStorageItem<DiemDen[]>(LOCAL_STORAGE_KEYS.DIEM_DEN, MOCK_DIEM_DEN);
  setStorageItem(
    LOCAL_STORAGE_KEYS.DIEM_DEN,
    current.filter((d) => d.id !== id),
  );
};

export const getLichTrinh = async (): Promise<LichTrinh[]> => {
  const data = getStorageItem<LichTrinh[]>(LOCAL_STORAGE_KEYS.LICH_TRINH, []);
  return new Promise((resolve) => setTimeout(() => resolve(data), 500));
};

export const taoLichTrinh = async (data: Partial<LichTrinh>): Promise<LichTrinh> => {
  const current = getStorageItem<LichTrinh[]>(LOCAL_STORAGE_KEYS.LICH_TRINH, []);
  const newItem: LichTrinh = {
    id: Math.random().toString(36).substr(2, 9),
    tieuDe: data.tieuDe || 'Chuyến đi chưa đặt tên',
    ngayBatDau: data.ngayBatDau || new Date().toISOString(),
    ngayKetThuc: data.ngayKetThuc || new Date().toISOString(),
    soNguoi: data.soNguoi || 1,
    nganSachTong: data.nganSachTong || 0,
    cacDiem: [],
    trangThai: 'nhap',
    createdAt: new Date().toISOString(),
  };
  setStorageItem(LOCAL_STORAGE_KEYS.LICH_TRINH, [newItem, ...current]);
  return newItem;
};

export const capNhatLichTrinh = async (id: string, data: Partial<LichTrinh>): Promise<LichTrinh> => {
  const current = getStorageItem<LichTrinh[]>(LOCAL_STORAGE_KEYS.LICH_TRINH, []);
  const index = current.findIndex((l) => l.id === id);
  if (index === -1) throw new Error('Không tìm thấy lịch trình');
  const updatedItem = { ...current[index], ...data };
  current[index] = updatedItem;
  setStorageItem(LOCAL_STORAGE_KEYS.LICH_TRINH, current);
  return updatedItem;
};

export const xoaLichTrinh = async (id: string): Promise<void> => {
  const current = getStorageItem<LichTrinh[]>(LOCAL_STORAGE_KEYS.LICH_TRINH, []);
  setStorageItem(
    LOCAL_STORAGE_KEYS.LICH_TRINH,
    current.filter((l) => l.id !== id),
  );
};
