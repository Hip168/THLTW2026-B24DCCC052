// Kiểu điểm đến
export interface DiemDen {
  id: string;
  ten: string;
  moTa: string;
  hinhAnh: string;           // URL hình ảnh
  loaiHinh: 'bien' | 'nui' | 'thanhPho' | 'langQue';
  rating: number;            // 1-5
  thoiGianThamQuan: number;  // giờ
  chiPhi: {
    anUong: number;          // VNĐ/ngày
    luuTru: number;          // VNĐ/đêm
    diChuyen: number;        // VNĐ (ước tính)
  };
  viTri: {
    lat: number;
    lng: number;
    diaChi: string;
  };
  luotXem: number;
  createdAt: string;
}

// Một điểm trong lịch trình
export interface DiemTrongLichTrinh {
  id: string;
  diemDenId: string;
  diemDen: DiemDen;
  ngay: number;              // ngày thứ mấy trong chuyến đi
  thuTu: number;             // thứ tự trong ngày
  ghiChu?: string;
  thoiGianBatDau?: string;   // "HH:mm"
}

// Lịch trình
export interface LichTrinh {
  id: string;
  tieuDe: string;
  ngayBatDau: string;        // ISO date
  ngayKetThuc: string;
  soNguoi: number;
  nganSachTong: number;      // VNĐ
  cacDiem: DiemTrongLichTrinh[];
  trangThai: 'nhap' | 'xacNhan' | 'hoanthanh';
  createdAt: string;
}

// Ngân sách phân bổ
export interface NganSach {
  lichTrinhId: string;
  anUong: number;
  luuTru: number;
  diChuyen: number;
  vuiChoi: number;
  khac: number;
  tong: number;
}

export type FilterParams = {
  keyword?: string;
  loaiHinh?: string;
  mucChiPhi?: string;
  rating?: number;
  sort?: string;
};
