import { Request, Response } from 'express';

let khoaHocData = [
  {
    id: 1,
    tenKhoaHoc: 'Lập trình Web với ReactJS',
    giangVien: 'Nguyễn Văn An',
    soLuongHocVien: 45,
    moTa: '<p>Khóa học ReactJS từ cơ bản đến nâng cao</p>',
    trangThai: 'DANG_MO',
  },
  {
    id: 2,
    tenKhoaHoc: 'Cơ sở dữ liệu nâng cao',
    giangVien: 'Trần Thị Bình',
    soLuongHocVien: 0,
    moTa: '<p>Học SQL và NoSQL chuyên sâu</p>',
    trangThai: 'TAM_DUNG',
  },
  {
    id: 3,
    tenKhoaHoc: 'Lập trình Python cơ bản',
    giangVien: 'Phan Quang Thành',
    soLuongHocVien: 120,
    moTa: '<p>Python cho người mới bắt đầu</p>',
    trangThai: 'DA_KET_THUC',
  },
  {
    id: 4,
    tenKhoaHoc: 'Machine Learning với TensorFlow',
    giangVien: 'Phạm Thị Dung',
    soLuongHocVien: 30,
    moTa: '<p>Học máy và deep learning thực tế</p>',
    trangThai: 'DANG_MO',
  },
  {
    id: 5,
    tenKhoaHoc: 'DevOps và CI/CD Pipeline',
    giangVien: 'Đỗ Văn Em',
    soLuongHocVien: 0,
    moTa: '<p>Docker, Kubernetes và tự động hóa triển khai</p>',
    trangThai: 'DANG_MO',
  },
  {
    id: 6,
    tenKhoaHoc: 'An toàn thông tin mạng',
    giangVien: 'Nguyễn Văn An',
    soLuongHocVien: 60,
    moTa: '<p>Bảo mật hệ thống và mạng máy tính</p>',
    trangThai: 'DA_KET_THUC',
  },
];

let nextId = 7;

export default {
  'GET /api/khoa-hoc': (req: Request, res: Response) => {
    const { tenKhoaHoc, giangVien, trangThai } = req.query;
    let result = [...khoaHocData];

    if (tenKhoaHoc) {
      result = result.filter((item) =>
        item.tenKhoaHoc.toLowerCase().includes((tenKhoaHoc as string).toLowerCase()),
      );
    }
    if (giangVien) {
      result = result.filter((item) => item.giangVien === giangVien);
    }
    if (trangThai) {
      result = result.filter((item) => item.trangThai === trangThai);
    }

    res.send({ data: result, total: result.length, success: true });
  },

  'POST /api/khoa-hoc': (req: Request, res: Response) => {
    const body = req.body;
    const newItem = { ...body, id: nextId++ };
    khoaHocData.push(newItem);
    res.send({ data: newItem, success: true });
  },

  'PUT /api/khoa-hoc/:id': (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const body = req.body;
    const index = khoaHocData.findIndex((item) => item.id === id);
    if (index === -1) {
      res.status(404).send({ success: false, message: 'Không tìm thấy khóa học' });
      return;
    }
    khoaHocData[index] = { ...khoaHocData[index], ...body };
    res.send({ data: khoaHocData[index], success: true });
  },

  'DELETE /api/khoa-hoc/:id': (req: Request, res: Response) => {
    const id = parseInt(req.params.id, 10);
    const index = khoaHocData.findIndex((item) => item.id === id);
    if (index === -1) {
      res.status(404).send({ success: false, message: 'Không tìm thấy khóa học' });
      return;
    }
    khoaHocData.splice(index, 1);
    res.send({ success: true });
  },
};
