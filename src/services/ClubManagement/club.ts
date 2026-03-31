import axios from '@/utils/axios';

export interface Club {
  id: string;
  avatar: string;
  name: string;
  foundedDate: string;
  descriptionHtml: string;
  president: string;
  isActive: boolean;
}

export const getClubs = async (params?: any) => {
  const res = await axios.get('/api/clubs', { params });
  return res.data;
};

export const addClub = async (data: any) => {
  const res = await axios.post('/api/clubs', data);
  return res.data;
};

export const updateClub = async (id: string, data: any) => {
  const res = await axios.put(`/api/clubs/${id}`, data);
  return res.data;
};

export const deleteClub = async (id: string) => {
  const res = await axios.delete(`/api/clubs/${id}`);
  return res.data;
};
