import { Request, Response } from 'express';

let applicationList = [
  {
    id: '1',
    fullName: 'Trần Văn C',
    email: 'tvc@gmail.com',
    phone: '0987654321',
    gender: 'Nam',
    address: 'Hà Nội',
    strengths: 'Hát',
    clubId: '1',
    reason: 'Đam mê',
    status: 'Pending',
    rejectNote: '',
    historyLogs: [],
  },
  {
    id: '2',
    fullName: 'Lê Thị D',
    email: 'ltd@gmail.com',
    phone: '0123456789',
    gender: 'Nữ',
    address: 'Hà Nội',
    strengths: 'Vẽ',
    clubId: '2',
    reason: 'Sở thích',
    status: 'Approved',
    rejectNote: '',
    historyLogs: [
      {
        action: 'Approved',
        timestamp: '2024-04-09T17:00:00.000Z',
        user: 'Admin',
        reason: '',
      }
    ],
  },
];

export default {
  'GET /api/applications': (req: Request, res: Response) => {
    let result = [...applicationList];
    const { status, clubId, fullName } = req.query;
    if (status) {
      result = result.filter(item => item.status === status);
    }
    if (clubId) {
      result = result.filter(item => item.clubId === clubId);
    }
    if (fullName) {
      result = result.filter(item => item.fullName.toLowerCase().includes((fullName as string).toLowerCase()));
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
  'POST /api/applications': (req: Request, res: Response) => {
    const newApp = { ...req.body, id: Date.now().toString(), status: 'Pending', historyLogs: [], rejectNote: '' };
    applicationList.unshift(newApp);
    res.json({ data: newApp, success: true });
  },
  'PUT /api/applications/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    applicationList = applicationList.map((item) => {
      if (item.id === id) {
        let newHistory = [...item.historyLogs];
        if (req.body.status && req.body.status !== item.status) {
          newHistory.push({
            action: req.body.status,
            timestamp: new Date().toISOString(),
            user: 'Admin',
            reason: req.body.rejectNote || '',
          });
        }
        return { ...item, ...req.body, historyLogs: newHistory };
      }
      return item;
    });
    res.json({ data: req.body, success: true });
  },
  'DELETE /api/applications/:id': (req: Request, res: Response) => {
    const { id } = req.params;
    applicationList = applicationList.filter((item) => item.id !== id);
    res.json({ success: true });
  },
  'POST /api/applications/bulk-approve': (req: Request, res: Response) => {
    const { ids } = req.body;
    applicationList = applicationList.map((item) => {
      if (ids.includes(item.id)) {
        item.status = 'Approved';
        item.historyLogs.push({
          action: 'Approved',
          timestamp: new Date().toISOString(),
          user: 'Admin',
          reason: '',
        });
      }
      return item;
    });
    res.json({ success: true });
  },
  'POST /api/applications/bulk-reject': (req: Request, res: Response) => {
    const { ids, reason } = req.body;
    applicationList = applicationList.map((item) => {
      if (ids.includes(item.id)) {
        item.status = 'Rejected';
        item.rejectNote = reason;
        item.historyLogs.push({
          action: 'Rejected',
          timestamp: new Date().toISOString(),
          user: 'Admin',
          reason: reason,
        });
      }
      return item;
    });
    res.json({ success: true });
  },
  'POST /api/applications/bulk-transfer': (req: Request, res: Response) => {
    const { ids, clubId } = req.body;
    applicationList = applicationList.map((item) => {
      if (ids.includes(item.id)) {
        item.clubId = clubId;
        item.historyLogs.push({
          action: 'Transferred',
          timestamp: new Date().toISOString(),
          user: 'Admin',
          reason: `Admin transferred member to club ${clubId}`,
        });
      }
      return item;
    });
    res.json({ success: true });
  },
};
