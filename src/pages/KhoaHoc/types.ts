export enum TrangThaiKhoaHoc {
  DANG_MO = 'DANG_MO',
  DA_KET_THUC = 'DA_KET_THUC',
  TAM_DUNG = 'TAM_DUNG',
}

export interface IKhoaHoc {
  id: number;
  tenKhoaHoc: string;
  giangVien: string;
  soLuongHocVien: number;
  moTa?: string;
  trangThai: TrangThaiKhoaHoc;
}

export interface IKhoaHocFormValues {
  tenKhoaHoc: string;
  giangVien: string;
  soLuongHocVien: number;
  moTa?: string;
  trangThai: TrangThaiKhoaHoc;
}
