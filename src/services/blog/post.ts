import type { Post } from '@/types/blog';
import axios from '@/utils/axios';

export async function getPosts(params?: {
  keyword?: string;
  tag?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return axios.get('/api/blog/posts', { params });
}

export async function getPostBySlug(slug: string) {
  return axios.get(`/api/blog/posts/${slug}`);
}

export async function createPost(data: Omit<Post, 'id' | 'viewCount' | 'createdAt' | 'updatedAt'>) {
  return axios.post('/api/blog/posts', data);
}

export async function updatePost(id: string, data: Partial<Post>) {
  return axios.put(`/api/blog/posts/${id}`, data);
}

export async function deletePost(id: string) {
  return axios.delete(`/api/blog/posts/${id}`);
}

export async function incrementView(id: string) {
  return axios.patch(`/api/blog/posts/${id}/view`);
}
