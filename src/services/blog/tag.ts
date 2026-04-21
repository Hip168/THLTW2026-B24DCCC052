import type { Tag } from '@/types/blog';
import axios from '@/utils/axios';

export async function getTags() {
  return axios.get('/api/blog/tags');
}

export async function createTag(data: Pick<Tag, 'name'>) {
  return axios.post('/api/blog/tags', data);
}

export async function updateTag(id: string, data: Pick<Tag, 'name'>) {
  return axios.put(`/api/blog/tags/${id}`, data);
}

export async function deleteTag(id: string) {
  return axios.delete(`/api/blog/tags/${id}`);
}
