import axios from '@/utils/axios';

export const traCuuVanBang = (params: Record<string, any>) => {
  return axios.get('/api/tra-cuu', { params });
};
