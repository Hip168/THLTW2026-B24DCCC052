import { Request, Response } from 'express';

let clubList = [
  {
    id: '1',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
    name: 'CLB Âm nhạc',
    foundedDate: '2023-01-01',
    descriptionHtml: '<p>Câu lạc bộ âm nhạc</p>',
    president: 'Nguyễn Văn A',
    isActive: true,
  },
  {
    id: '2',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp',
    name: 'CLB Mỹ thuật',
    foundedDate: '2023-02-01',
    descriptionHtml: '<p>Câu lạc bộ Mỹ thuật</p>',
    president: 'Nguyễn Văn B',
    isActive: true,
  },
];

export default {
  'GET /api/clubs': (req: Request, res: Response) => {
    let result = [...clubList];
    const { name } = req.query;
    if (name) {
      result = result.filter(item => item.name.toLowerCase().includes((name as string).toLowerCase()));
    }
    const { current = 1, pageSize = 10 } = req.query;
    res.json({
      data: result.slice((Number(current) - 1) * Number(pageSize), Number(current) * Number(pageSize)),
      total: result.length,
      success: true,
      pageSize: Number(pageSize),
      current: Number(current),
    });
  },
  'POST /api/clubs': (req: Request, res: Response) => {
    const newClub = { ...req.body, id: Date.now().toString() };
    clubList.unshift(newClub);
    res.json({ data: newClub, success: true });
  },
  'PUT /api/clubs/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    clubList = clubList.map((item) => (item.id === id ? { ...item, ...req.body } : item));
    res.json({ data: req.body, success: true });
  },
  'DELETE /api/clubs/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    clubList = clubList.filter((item) => item.id !== id);
    res.json({ success: true });
  },
};
