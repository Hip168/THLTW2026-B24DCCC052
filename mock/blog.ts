import type { Author, Post, Tag } from '@/types/blog';

const tags: Tag[] = [
  { id: 'tag-1', name: 'ReactJS', postCount: 5 },
  { id: 'tag-2', name: 'TypeScript', postCount: 4 },
  { id: 'tag-3', name: 'UmiJS', postCount: 3 },
  { id: 'tag-4', name: 'Ant Design', postCount: 6 },
  { id: 'tag-5', name: 'NestJS', postCount: 2 },
  { id: 'tag-6', name: 'PostgreSQL', postCount: 2 },
];

const author: Author = {
  name: 'Lê Minh Đạo',
  avatar: 'https://avatars.githubusercontent.com/u/9919?s=200',
  bio: 'Sinh viên PTIT, đam mê lập trình web và công nghệ mới. Tôi thích khám phá React, TypeScript và hệ sinh thái của chúng.',
  skills: ['React', 'TypeScript', 'UmiJS', 'Ant Design', 'NestJS', 'PostgreSQL', 'Git'],
  social: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    facebook: 'https://facebook.com',
  },
};

const posts: Post[] = [
  {
    id: 'post-1',
    title: 'Giới thiệu về React 17 và những thay đổi mới',
    slug: 'gioi-thieu-react-17',
    summary: 'React 17 mang đến nhiều cải tiến quan trọng giúp việc nâng cấp phiên bản trở nên dễ dàng hơn.',
    content: `## React 17 là gì?\n\nReact 17 là phiên bản mới nhất của thư viện UI phổ biến nhất hiện nay. Phiên bản này tập trung vào việc cải thiện quá trình nâng cấp.\n\n## Những thay đổi chính\n\nKhông có tính năng mới dành cho developer, thay vào đó React 17 tập trung vào việc làm cho React dễ nâng cấp hơn.\n\n## Kết luận\n\nReact 17 là bước đệm quan trọng để chuẩn bị cho React 18 với nhiều tính năng thú vị hơn.`,
    thumbnail: 'https://picsum.photos/seed/react17/800/400',
    author: 'Lê Minh Đạo',
    tags: ['tag-1', 'tag-2'],
    status: 'published',
    viewCount: 245,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-10T08:00:00Z',
  },
  {
    id: 'post-2',
    title: 'Hướng dẫn sử dụng UmiJS cho người mới bắt đầu',
    slug: 'huong-dan-umijs-nguoi-moi',
    summary: 'UmiJS là framework mạnh mẽ giúp xây dựng ứng dụng React một cách nhanh chóng và có cấu trúc.',
    content: `## UmiJS là gì?\n\nUmiJS là một enterprise-level front-end framework dựa trên React, được phát triển bởi Ant Design team.\n\n## Tại sao nên dùng UmiJS?\n\nUmiJS cung cấp routing, SSR, micro-frontend và nhiều plugin hữu ích giúp tiết kiệm thời gian phát triển.\n\n## Bắt đầu với UmiJS\n\nCài đặt UmiJS bằng lệnh: yarn create umi và làm theo hướng dẫn từng bước để tạo project mới.`,
    thumbnail: 'https://picsum.photos/seed/umijs/800/400',
    author: 'Lê Minh Đạo',
    tags: ['tag-3', 'tag-1'],
    status: 'published',
    viewCount: 180,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 'post-3',
    title: 'Ant Design 4 - Component Library hoàn hảo cho Enterprise',
    slug: 'ant-design-4-enterprise',
    summary: 'Ant Design 4 cung cấp hơn 70 component chất lượng cao phù hợp với ứng dụng doanh nghiệp.',
    content: `## Ant Design là gì?\n\nAnt Design là một hệ thống thiết kế UI dành cho enterprise của Alibaba, cung cấp các component React chất lượng cao.\n\n## Tính năng nổi bật\n\nAnt Design 4 cải thiện hiệu suất đáng kể, giảm kích thước bundle và cải thiện TypeScript support.\n\n## Ví dụ sử dụng\n\nSử dụng component Table, Form, Modal từ antd giúp xây dựng UI phức tạp nhanh chóng mà không cần viết nhiều code.`,
    thumbnail: 'https://picsum.photos/seed/antd/800/400',
    author: 'Lê Minh Đạo',
    tags: ['tag-4', 'tag-1'],
    status: 'published',
    viewCount: 320,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'post-4',
    title: 'TypeScript - Tại sao bạn nên học ngay hôm nay',
    slug: 'typescript-tai-sao-nen-hoc',
    summary: 'TypeScript giúp code JavaScript trở nên an toàn hơn, dễ bảo trì hơn và giảm thiểu lỗi runtime.',
    content: `## TypeScript là gì?\n\nTypeScript là superset của JavaScript, thêm vào khả năng type-checking tĩnh trước khi compile.\n\n## Lợi ích của TypeScript\n\nViệc sử dụng TypeScript giúp bắt lỗi sớm, cải thiện developer experience và tài liệu code tự động.\n\n## Bắt đầu học TypeScript\n\nBắt đầu với các type cơ bản như string, number, boolean, array và interface để làm quen với TypeScript.`,
    thumbnail: 'https://picsum.photos/seed/typescript/800/400',
    author: 'Lê Minh Đạo',
    tags: ['tag-2'],
    status: 'published',
    viewCount: 415,
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-02-01T08:00:00Z',
  },
  {
    id: 'post-5',
    title: 'NestJS - Framework Node.js cho Backend chuyên nghiệp',
    slug: 'nestjs-backend-chuyen-nghiep',
    summary: 'NestJS là framework TypeScript-first mang kiến trúc Angular vào thế giới Node.js backend.',
    content: `## Giới thiệu NestJS\n\nNestJS là progressive Node.js framework cho việc xây dựng server-side applications hiệu quả và scalable.\n\n## Kiến trúc NestJS\n\nNestJS sử dụng Decorator pattern, Dependency Injection và Module system tương tự Angular.\n\n## Kết nối với PostgreSQL\n\nNestJS tích hợp tốt với TypeORM và PostgreSQL để xây dựng REST API hoàn chỉnh.`,
    thumbnail: 'https://picsum.photos/seed/nestjs/800/400',
    author: 'Lê Minh Đạo',
    tags: ['tag-5', 'tag-6'],
    status: 'published',
    viewCount: 290,
    createdAt: '2024-02-10T09:00:00Z',
    updatedAt: '2024-02-10T09:00:00Z',
  },
  {
    id: 'post-6',
    title: 'PostgreSQL - Cơ sở dữ liệu quan hệ mạnh mẽ',
    slug: 'postgresql-co-so-du-lieu',
    summary: 'PostgreSQL là hệ quản trị cơ sở dữ liệu quan hệ mã nguồn mở mạnh mẽ nhất hiện nay.',
    content: `## PostgreSQL là gì?\n\nPostgreSQL là object-relational database system với hơn 35 năm phát triển, nổi tiếng về độ tin cậy và hiệu suất.\n\n## Tính năng nổi bật\n\nPostgreSQL hỗ trợ JSON, Full-text search, Advanced indexing và nhiều tính năng enterprise khác.\n\n## So sánh với MySQL\n\nPostgreSQL vượt trội hơn MySQL trong các tình huống cần xử lý dữ liệu phức tạp và đảm bảo ACID.`,
    thumbnail: 'https://picsum.photos/seed/postgres/800/400',
    author: 'Lê Minh Đạo',
    tags: ['tag-6', 'tag-5'],
    status: 'published',
    viewCount: 178,
    createdAt: '2024-02-15T10:00:00Z',
    updatedAt: '2024-02-15T10:00:00Z',
  },
  {
    id: 'post-7',
    title: 'Dva.js - State Management cho UmiJS',
    slug: 'dvajs-state-management-umijs',
    summary: 'Dva là lightweight state management framework dựa trên Redux và Redux-saga, được tích hợp sẵn trong UmiJS.',
    content: `## Dva là gì?\n\nDva là một state management framework kết hợp redux, redux-saga và react-router thành một giải pháp đơn giản.\n\n## Model trong Dva\n\nMỗi model trong Dva bao gồm namespace, state, effects và reducers. Effects xử lý async, reducers xử lý sync.\n\n## Cách sử dụng trong UmiJS\n\nTrong UmiJS, bạn chỉ cần tạo file trong thư mục models và UmiJS sẽ tự động load chúng.`,
    thumbnail: 'https://picsum.photos/seed/dvajs/800/400',
    author: 'Lê Minh Đạo',
    tags: ['tag-3', 'tag-1'],
    status: 'draft',
    viewCount: 95,
    createdAt: '2024-02-20T08:00:00Z',
    updatedAt: '2024-02-20T08:00:00Z',
  },
  {
    id: 'post-8',
    title: 'Axios - HTTP Client tốt nhất cho React',
    slug: 'axios-http-client-react',
    summary: 'Axios là promise-based HTTP client phổ biến nhất cho browser và Node.js với nhiều tính năng tiện lợi.',
    content: `## Tại sao chọn Axios?\n\nAxios cung cấp interceptors, automatic JSON transformation, request cancellation và nhiều tính năng khác so với fetch API.\n\n## Cấu hình Axios với interceptors\n\nInterceptors cho phép bạn xử lý request/response globally, tiện lợi để thêm auth token hoặc xử lý lỗi.\n\n## Best practices\n\nTạo một axios instance với baseURL và timeout mặc định thay vì sử dụng axios trực tiếp.`,
    thumbnail: 'https://picsum.photos/seed/axios/800/400',
    author: 'Lê Minh Đạo',
    tags: ['tag-1', 'tag-2'],
    status: 'published',
    viewCount: 203,
    createdAt: '2024-03-01T09:00:00Z',
    updatedAt: '2024-03-01T09:00:00Z',
  },
  {
    id: 'post-9',
    title: 'React Hooks - Hiểu sâu về useState và useEffect',
    slug: 'react-hooks-usestate-useeffect',
    summary: 'React Hooks thay đổi cách chúng ta viết component, loại bỏ class component và làm code gọn gàng hơn.',
    content: `## useState Hook\n\nuseState là hook cơ bản nhất, cho phép functional component có state internal riêng của mình.\n\n## useEffect Hook\n\nuseEffect thay thế lifecycle methods trong class component, cho phép thực hiện side effects trong functional component.\n\n## Dependency Array\n\nDependency array trong useEffect kiểm soát khi nào effect chạy lại. Mảng rỗng nghĩa là chỉ chạy một lần.`,
    thumbnail: 'https://picsum.photos/seed/hooks/800/400',
    author: 'Lê Minh Đạo',
    tags: ['tag-1'],
    status: 'published',
    viewCount: 387,
    createdAt: '2024-03-10T08:00:00Z',
    updatedAt: '2024-03-10T08:00:00Z',
  },
  {
    id: 'post-10',
    title: 'TypeScript Generic - Kỹ thuật nâng cao',
    slug: 'typescript-generic-nang-cao',
    summary: 'Generic trong TypeScript giúp viết code tái sử dụng cao, type-safe mà không cần dùng any.',
    content: `## Generic là gì?\n\nGeneric là tính năng cho phép tạo component, function hoặc class hoạt động với nhiều kiểu dữ liệu khác nhau.\n\n## Ví dụ thực tế\n\nMột hàm identity generic có thể nhận và trả về bất kỳ kiểu nào trong khi vẫn đảm bảo type safety.\n\n## Constraint trong Generic\n\nSử dụng extends để giới hạn kiểu có thể được sử dụng với generic, tăng tính an toàn.`,
    thumbnail: 'https://picsum.photos/seed/generic/800/400',
    author: 'Lê Minh Đạo',
    tags: ['tag-2'],
    status: 'draft',
    viewCount: 142,
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-15T10:00:00Z',
  },
  {
    id: 'post-11',
    title: 'Ant Design Form - Quản lý form phức tạp dễ dàng',
    slug: 'ant-design-form-quan-ly',
    summary: 'Ant Design Form cung cấp API mạnh mẽ để xây dựng và validate form phức tạp một cách đơn giản.',
    content: `## Ant Design Form cơ bản\n\nForm.Item là wrapper component cung cấp label, validation message và liên kết với Form instance.\n\n## Validation Rules\n\nAnt Design Form hỗ trợ validation rules chi tiết bao gồm required, min/max length, pattern và custom validator.\n\n## Form.useForm Hook\n\nHook useForm trả về form instance cho phép kiểm soát form programmatically từ bên ngoài.`,
    thumbnail: 'https://picsum.photos/seed/antdform/800/400',
    author: 'Lê Minh Đạo',
    tags: ['tag-4', 'tag-1'],
    status: 'published',
    viewCount: 265,
    createdAt: '2024-03-20T09:00:00Z',
    updatedAt: '2024-03-20T09:00:00Z',
  },
  {
    id: 'post-12',
    title: 'SSO với Keycloak và React OIDC',
    slug: 'sso-keycloak-react-oidc',
    summary: 'Tích hợp Single Sign-On với Keycloak vào ứng dụng React sử dụng thư viện react-oidc-context.',
    content: `## Keycloak là gì?\n\nKeycloak là open-source Identity và Access Management solution, hỗ trợ SSO, OAuth2 và OpenID Connect.\n\n## Tích hợp với React\n\nSử dụng react-oidc-context và oidc-client-ts để tích hợp Keycloak vào React application một cách đơn giản.\n\n## Quản lý Token\n\nKhi user đăng nhập, Keycloak trả về access_token và refresh_token. Library sẽ tự động refresh token khi hết hạn.`,
    thumbnail: 'https://picsum.photos/seed/keycloak/800/400',
    author: 'Lê Minh Đạo',
    tags: ['tag-1', 'tag-2', 'tag-3'],
    status: 'draft',
    viewCount: 67,
    createdAt: '2024-03-25T08:00:00Z',
    updatedAt: '2024-03-25T08:00:00Z',
  },
];

export default {
  'GET /api/blog/tags': (_req: any, res: any) => {
    res.json({ data: tags, success: true });
  },

  'GET /api/blog/posts': (req: any, res: any) => {
    const { keyword, tag, status, page = 1, pageSize = 9 } = req.query;
    let filtered = [...posts];
    if (keyword) {
      filtered = filtered.filter((p) => p.title.toLowerCase().includes((keyword as string).toLowerCase()));
    }
    if (tag) {
      filtered = filtered.filter((p) => p.tags.includes(tag as string));
    }
    if (status) {
      filtered = filtered.filter((p) => p.status === status);
    }
    const total = filtered.length;
    const start = (Number(page) - 1) * Number(pageSize);
    const end = start + Number(pageSize);
    res.json({ data: filtered.slice(start, end), total, success: true });
  },

  'GET /api/blog/posts/:slug': (req: any, res: any) => {
    const post = posts.find((p) => p.slug === req.params.slug);
    if (!post) {
      res.status(404).json({ success: false, message: 'Không tìm thấy bài viết' });
    } else {
      res.json({ data: post, success: true });
    }
  },

  'POST /api/blog/posts': (req: any, res: any) => {
    const newPost: Post = {
      ...req.body,
      id: `post-${Date.now()}`,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    posts.push(newPost);
    res.json({ data: newPost, success: true });
  },

  'PUT /api/blog/posts/:id': (req: any, res: any) => {
    const index = posts.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ success: false });
    } else {
      posts[index] = { ...posts[index], ...req.body, updatedAt: new Date().toISOString() };
      res.json({ data: posts[index], success: true });
    }
  },

  'DELETE /api/blog/posts/:id': (req: any, res: any) => {
    const index = posts.findIndex((p) => p.id === req.params.id);
    if (index !== -1) posts.splice(index, 1);
    res.json({ success: true });
  },

  'POST /api/blog/tags': (req: any, res: any) => {
    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name: req.body.name,
      postCount: 0,
    };
    tags.push(newTag);
    res.json({ data: newTag, success: true });
  },

  'PUT /api/blog/tags/:id': (req: any, res: any) => {
    const index = tags.findIndex((t) => t.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ success: false });
    } else {
      tags[index] = { ...tags[index], ...req.body };
      res.json({ data: tags[index], success: true });
    }
  },

  'DELETE /api/blog/tags/:id': (req: any, res: any) => {
    const index = tags.findIndex((t) => t.id === req.params.id);
    if (index !== -1) tags.splice(index, 1);
    res.json({ success: true });
  },

  'GET /api/blog/author': (_req: any, res: any) => {
    res.json({ data: author, success: true });
  },

  'PATCH /api/blog/posts/:id/view': (req: any, res: any) => {
    const post = posts.find((p) => p.id === req.params.id);
    if (post) post.viewCount += 1;
    res.json({ success: true });
  },
};
