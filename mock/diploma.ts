import { Request, Response } from 'express';

let diplomaBooks = [
  { _id: '1', ten: 'Sổ văn bằng năm 2023', nam: 2023 },
  { _id: '2', ten: 'Sổ văn bằng năm 2024', nam: 2024 },
];

let decisions = [
  { _id: '1', soQuyetDinh: 'QĐ-2024-01', ngayBanHanh: '2024-01-15T00:00:00Z', trichYeu: 'Quyết định công nhận tốt nghiệp đợt 1 năm 2024', idSoVanBang: '2', luotTraCuu: 0 },
];

let templateConfigs = [
  { _id: '1', tenTruong: 'Ngành đào tạo', kieuDuLieu: 'String' },
  { _id: '2', tenTruong: 'Xếp loại', kieuDuLieu: 'String' },
];

let diplomaInfos = [
  {
    _id: '1',
    soVaoSo: 1,
    soHieu: 'VB0001',
    maSinhVien: 'B20DCCN001',
    hoTen: 'Nguyễn Văn A',
    ngaySinh: '2002-01-01T00:00:00Z',
    idQuyetDinh: '1',
    duLieuDong: { 'Ngành đào tạo': 'Công nghệ thông tin', 'Xếp loại': 'Giỏi' },
  },
];

const getNextSoVaoSo = (idSoVanBang: string) => {
  const decisionIds = decisions.filter(d => d.idSoVanBang === idSoVanBang).map(d => d._id);
  const infosInBook = diplomaInfos.filter(info => decisionIds.includes(info.idQuyetDinh));
  if (infosInBook.length === 0) return 1;
  const maxSo = Math.max(...infosInBook.map(info => info.soVaoSo));
  return maxSo + 1;
};

export default {
  'GET /api/so-van-bang': (req: Request, res: Response) => {
    res.send({ data: diplomaBooks, total: diplomaBooks.length, success: true });
  },
  'POST /api/so-van-bang': (req: Request, res: Response) => {
    const newItem = { ...req.body, _id: Date.now().toString() };
    diplomaBooks.push(newItem);
    res.send({ data: newItem, success: true });
  },
  'PUT /api/so-van-bang': (req: Request, res: Response) => {
    const { _id } = req.body;
    diplomaBooks = diplomaBooks.map(item => item._id === _id ? req.body : item);
    res.send({ data: req.body, success: true });
  },
  'DELETE /api/so-van-bang/:id': (req: Request, res: Response) => {
    diplomaBooks = diplomaBooks.filter(item => item._id !== req.params.id);
    res.send({ success: true });
  },

  'GET /api/quyet-dinh': (req: Request, res: Response) => {
    res.send({ data: decisions, total: decisions.length, success: true });
  },
  'POST /api/quyet-dinh': (req: Request, res: Response) => {
    const newItem = { ...req.body, _id: Date.now().toString(), luotTraCuu: 0 };
    decisions.push(newItem);
    res.send({ data: newItem, success: true });
  },

  'GET /api/cau-hinh-bieu-mau': (req: Request, res: Response) => {
    res.send({ data: templateConfigs, total: templateConfigs.length, success: true });
  },
  'POST /api/cau-hinh-bieu-mau': (req: Request, res: Response) => {
    const newItem = { ...req.body, _id: Date.now().toString() };
    templateConfigs.push(newItem);
    res.send({ data: newItem, success: true });
  },
  'DELETE /api/cau-hinh-bieu-mau/:id': (req: Request, res: Response) => {
    templateConfigs = templateConfigs.filter(item => item._id !== req.params.id);
    res.send({ success: true });
  },

  'GET /api/thong-tin-van-bang': (req: Request, res: Response) => {
    res.send({ data: diplomaInfos, total: diplomaInfos.length, success: true });
  },
  'POST /api/thong-tin-van-bang': (req: Request, res: Response) => {
    const decision = decisions.find(d => d._id === req.body.idQuyetDinh);
    if (!decision) return res.status(400).send({ success: false, message: 'Quyết định không tồn tại' });
    
    const soVaoSo = getNextSoVaoSo(decision.idSoVanBang);
    const newItem = { ...req.body, _id: Date.now().toString(), soVaoSo };
    diplomaInfos.push(newItem);
    res.send({ data: newItem, success: true });
  },

  'GET /api/tra-cuu': (req: Request, res: Response) => {
    const { soHieu, soVaoSo, maSinhVien, hoTen, ngaySinh } = req.query;
    const params = [soHieu, soVaoSo, maSinhVien, hoTen, ngaySinh].filter(p => !!p);
    
    if (params.length < 2) {
      return res.status(400).send({ success: false, message: 'Vui lòng nhập ít nhất 2 thông tin để tra cứu' });
    }

    const result = diplomaInfos.find(item => {
      if (soHieu && item.soHieu !== soHieu) return false;
      if (soVaoSo && item.soVaoSo.toString() !== soVaoSo) return false;
      if (maSinhVien && item.maSinhVien !== maSinhVien) return false;
      if (hoTen && !item.hoTen.toLowerCase().includes((hoTen as string).toLowerCase())) return false;
      if (ngaySinh && item.ngaySinh.split('T')[0] !== (ngaySinh as string).split('T')[0]) return false;
      return true;
    });

    if (result) {
      const decision = decisions.find(d => d._id === result.idQuyetDinh);
      if (decision) {
        decision.luotTraCuu += 1;
      }
      res.send({ data: { ...result, decision }, success: true });
    } else {
      res.send({ data: null, success: false, message: 'Không tìm thấy thông tin văn bằng' });
    }
  },
};
