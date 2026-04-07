import { useState, useCallback, useEffect } from 'react';
import type { DiemDen, LichTrinh, FilterParams, NganSach, DiemTrongLichTrinh } from '@/types/duLich';
import * as duLichService from '@/services/duLich';
import { message } from 'antd';

export default function useDuLichModel() {
  const [danhSachDiemDen, setDanhSachDiemDen] = useState<DiemDen[]>([]);
  const [lichTrinhHienTai, setLichTrinhHienTai] = useState<LichTrinh | null>(null);
  const [danhSachLichTrinh, setDanhSachLichTrinh] = useState<LichTrinh[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterParams>({
    loaiHinh: 'all',
    sort: 'popular',
  });

  const fetchDanhSachDiemDen = useCallback(async (params?: FilterParams) => {
    setLoading(true);
    try {
      const res = await duLichService.getDanhSachDiemDen(params || filters);
      setDanhSachDiemDen(res);
    } catch (error) {
      message.error('Không thể tải danh sách điểm đến');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchDanhSachLichTrinh = useCallback(async () => {
    try {
      const res = await duLichService.getLichTrinh();
      setDanhSachLichTrinh(res);
      if (res.length > 0 && !lichTrinhHienTai) {
        setLichTrinhHienTai(res[0]);
      }
    } catch (error) {
      console.error(error);
    }
  }, [lichTrinhHienTai]);

  const taoLichTrinhMoi = async (data: Partial<LichTrinh>) => {
    try {
      const res = await duLichService.taoLichTrinh(data);
      setLichTrinhHienTai(res);
      await fetchDanhSachLichTrinh();
      message.success('Đã tạo lịch trình mới');
      return res;
    } catch (error) {
      message.error('Lỗi khi tạo lịch trình');
      return null;
    }
  };

  const themDiemVaoLichTrinh = async (diemDen: DiemDen, ngay: number) => {
    if (!lichTrinhHienTai) return;
    
    const newDiem: DiemTrongLichTrinh = {
      id: Math.random().toString(36).substr(2, 9),
      diemDenId: diemDen.id,
      diemDen,
      ngay,
      thuTu: lichTrinhHienTai.cacDiem.filter(d => d.ngay === ngay).length + 1,
    };

    const updatedCacDiem = [...lichTrinhHienTai.cacDiem, newDiem];
    try {
      const res = await duLichService.capNhatLichTrinh(lichTrinhHienTai.id, {
        cacDiem: updatedCacDiem
      });
      setLichTrinhHienTai(res);
      message.success(`Đã thêm ${diemDen.ten} vào ngày ${ngay}`);
    } catch (error) {
      message.error('Lỗi khi thêm điểm đến');
    }
  };

  const xoaDiemKhoiLichTrinh = async (diemId: string) => {
    if (!lichTrinhHienTai) return;
    const updatedCacDiem = lichTrinhHienTai.cacDiem.filter(d => d.id !== diemId);
    try {
      const res = await duLichService.capNhatLichTrinh(lichTrinhHienTai.id, {
        cacDiem: updatedCacDiem
      });
      setLichTrinhHienTai(res);
      message.success('Đã xóa điểm đến');
    } catch (error) {
      message.error('Lỗi khi xóa điểm đến');
    }
  };

  const sapXepLaiDiem = async (ngay: number, fromIndex: number, toIndex: number) => {
    if (!lichTrinhHienTai) return;
    
    const cacDiemTrongNgay = lichTrinhHienTai.cacDiem.filter(d => d.ngay === ngay);
    const cacDiemKhac = lichTrinhHienTai.cacDiem.filter(d => d.ngay !== ngay);
    
    const [movedItem] = cacDiemTrongNgay.splice(fromIndex, 1);
    cacDiemTrongNgay.splice(toIndex, 0, movedItem);
    
    // Cập nhật lại thứ tự
    const updatedNgay = cacDiemTrongNgay.map((d, index) => ({ ...d, thuTu: index + 1 }));
    
    try {
      const res = await duLichService.capNhatLichTrinh(lichTrinhHienTai.id, {
        cacDiem: [...cacDiemKhac, ...updatedNgay]
      });
      setLichTrinhHienTai(res);
    } catch (error) {
      message.error('Lỗi khi sắp xếp lại');
    }
  };

  const tinhNganSach = (): NganSach => {
    const defaultNganSach: NganSach = {
      lichTrinhId: lichTrinhHienTai?.id || '',
      anUong: 0,
      luuTru: 0,
      diChuyen: 0,
      vuiChoi: 0,
      khac: 0,
      tong: 0,
    };

    if (!lichTrinhHienTai) return defaultNganSach;

    const soNguoi = lichTrinhHienTai.soNguoi || 1;
    
    lichTrinhHienTai.cacDiem.forEach(d => {
      defaultNganSach.anUong += d.diemDen.chiPhi.anUong * soNguoi;
      defaultNganSach.luuTru += d.diemDen.chiPhi.luuTru * soNguoi;
      defaultNganSach.diChuyen += d.diemDen.chiPhi.diChuyen * soNguoi;
    });

    defaultNganSach.tong = defaultNganSach.anUong + defaultNganSach.luuTru + defaultNganSach.diChuyen;
    return defaultNganSach;
  };

  useEffect(() => {
    fetchDanhSachDiemDen();
    fetchDanhSachLichTrinh();
  }, [fetchDanhSachDiemDen, fetchDanhSachLichTrinh]);

  return {
    danhSachDiemDen,
    lichTrinhHienTai,
    setLichTrinhHienTai,
    danhSachLichTrinh,
    loading,
    filters,
    setFilters,
    fetchDanhSachDiemDen,
    taoLichTrinhMoi,
    themDiemVaoLichTrinh,
    xoaDiemKhoiLichTrinh,
    sapXepLaiDiem,
    tinhNganSach,
  };
}
