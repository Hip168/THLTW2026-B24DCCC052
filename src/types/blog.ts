export interface Tag {
  id: string;
  name: string;
  postCount: number;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnail: string;
  author: string;
  tags: string[];
  status: 'draft' | 'published';
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Author {
  name: string;
  avatar: string;
  bio: string;
  skills: string[];
  social: {
    github?: string;
    linkedin?: string;
    facebook?: string;
  };
}
