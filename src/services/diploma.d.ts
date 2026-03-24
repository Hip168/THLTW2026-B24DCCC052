declare namespace Diploma {
  export interface ISoVanBang {
    _id: string;
    ten: string;
    nam: number;
  }

  export interface IQuyetDinh {
    _id: string;
    soQuyetDinh: string;
    ngayBanHanh: string;
    trichYeu: string;
    idSoVanBang: string;
    luotTraCuu: number;
  }

  export interface ICauHinhBieuMau {
    _id: string;
    tenTruong: string;
    kieuDuLieu: 'String' | 'Number' | 'Date';
  }

  export interface IThongTinVanBang {
    _id: string;
    soVaoSo: number;
    soHieu: string;
    maSinhVien: string;
    hoTen: string;
    ngaySinh: string;
    idQuyetDinh: string;
    duLieuDong: Record<string, any>;
  }

  export interface ITraCuuResult extends IThongTinVanBang {
    decision: IQuyetDinh;
  }
}
