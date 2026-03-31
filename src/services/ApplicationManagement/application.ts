import axios from '@/utils/axios';

export interface HistoryLog {
  action: string;
  timestamp: string;
  user: string;
  reason: string;
}

export interface Application {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  address: string;
  strengths: string;
  clubId: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  rejectNote: string;
  historyLogs: HistoryLog[];
}

export const getApplications = async (params?: any) => {
  const res = await axios.get('/api/applications', { params });
  return res.data;
};

export const addApplication = async (data: any) => {
  const res = await axios.post('/api/applications', data);
  return res.data;
};

export const updateApplication = async (id: string, data: any) => {
  const res = await axios.put(`/api/applications/${id}`, data);
  return res.data;
};

export const deleteApplication = async (id: string) => {
  const res = await axios.delete(`/api/applications/${id}`);
  return res.data;
};

export const bulkApproveApplications = async (ids: string[]) => {
  const res = await axios.post('/api/applications/bulk-approve', { ids });
  return res.data;
};

export const bulkRejectApplications = async (ids: string[], reason: string) => {
  const res = await axios.post('/api/applications/bulk-reject', { ids, reason });
  return res.data;
};

export const bulkTransferApplications = async (ids: string[], clubId: string) => {
  const res = await axios.post('/api/applications/bulk-transfer', { ids, clubId });
  return res.data;
};
