import { request } from 'umi';
import { IKhoaHoc, IKhoaHocFormValues } from '../types';

const BASE_URL = '/api/khoa-hoc';

export async function getKhoaHocList(params?: {
  tenKhoaHoc?: string;
  giangVien?: string;
  trangThai?: string;
}): Promise<{ data: IKhoaHoc[]; total: number }> {
  return request(BASE_URL, { params });
}

export async function createKhoaHoc(body: IKhoaHocFormValues): Promise<IKhoaHoc> {
  return request(BASE_URL, { method: 'POST', data: body });
}

export async function updateKhoaHoc(
  id: number,
  body: Partial<IKhoaHocFormValues>,
): Promise<IKhoaHoc> {
  return request(`${BASE_URL}/${id}`, { method: 'PUT', data: body });
}

export async function deleteKhoaHoc(id: number): Promise<void> {
  return request(`${BASE_URL}/${id}`, { method: 'DELETE' });
}
