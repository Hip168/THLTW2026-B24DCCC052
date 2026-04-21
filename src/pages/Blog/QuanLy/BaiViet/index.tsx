import { PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Space,
  Table,
  Tag as AntTag,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import TinyEditor from '@/components/TinyEditor';
import type { PostModelState } from '@/models/blog/post';
import type { TagModelState } from '@/models/blog/tag';
import type { Post, Tag } from '@/types/blog';

interface BaiVietProps {
  blogPost: PostModelState;
  blogTag: TagModelState;
  dispatch: (action: { type: string; payload?: Record<string, unknown> }) => void;
}

const BaiViet: React.FC<BaiVietProps> = ({ blogPost, blogTag, dispatch }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [filterKeyword, setFilterKeyword] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');

  useEffect(() => {
    dispatch({ type: 'blogPost/fetchList', payload: { keyword: filterKeyword, status: filterStatus } });
    dispatch({ type: 'blogTag/fetchList' });
  }, [filterKeyword, filterStatus, dispatch]);

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9 ]/g, '')
      .trim()
      .replace(/\s+/g, '-');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    form.setFieldsValue({ slug: generateSlug(e.target.value) });
  };

  const handleOpen = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      form.setFieldsValue(post);
    } else {
      setEditingPost(null);
      form.resetFields();
    }
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
    setEditingPost(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editingPost) {
      dispatch({ type: 'blogPost/update', payload: { id: editingPost.id, ...values } });
    } else {
      dispatch({ type: 'blogPost/create', payload: values });
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'blogPost/remove', payload: { id } });
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <AntTag color={status === 'published' ? 'green' : 'default'}>
          {status === 'published' ? 'Đã đăng' : 'Nháp'}
        </AntTag>
      ),
    },
    {
      title: 'Thẻ',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) => (
        <>
          {tags.map((tagId) => {
            const found = blogTag.list.find((t: Tag) => t.id === tagId);
            return <AntTag key={tagId}>{found ? found.name : tagId}</AntTag>;
          })}
        </>
      ),
    },
    {
      title: 'Lượt xem',
      dataIndex: 'viewCount',
      key: 'viewCount',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: unknown, record: Post) => (
        <Space>
          <Button type="link" onClick={() => handleOpen(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa bài viết này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="link" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12, justifyContent: 'space-between' }}>
        <Space>
          <Input.Search
            placeholder="Tìm kiếm theo tiêu đề..."
            allowClear
            style={{ width: 280 }}
            onSearch={(v) => setFilterKeyword(v)}
            onChange={(e) => !e.target.value && setFilterKeyword('')}
          />
          <Select
            placeholder="Lọc theo trạng thái"
            allowClear
            style={{ width: 180 }}
            onChange={(v) => setFilterStatus(v || '')}
          >
            <Select.Option value="published">Đã đăng</Select.Option>
            <Select.Option value="draft">Nháp</Select.Option>
          </Select>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpen()} style={{ background: '#CC0D00', borderColor: '#CC0D00' }}>
          Thêm bài viết
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={blogPost.list}
        loading={blogPost.loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingPost ? 'Sửa bài viết' : 'Thêm bài viết mới'}
        open={visible}
        onOk={handleSubmit}
        onCancel={handleClose}
        width={800}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{ style: { background: '#CC0D00', borderColor: '#CC0D00' } }}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
            <Input onChange={handleTitleChange} />
          </Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true, message: 'Vui lòng nhập slug' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="summary" label="Tóm tắt" rules={[{ required: true, message: 'Vui lòng nhập tóm tắt' }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="content" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
            <TinyEditor />
          </Form.Item>
          <Form.Item name="thumbnail" label="Ảnh đại diện (URL)">
            <Input placeholder="https://..." />
          </Form.Item>
          <Form.Item name="tags" label="Thẻ">
            <Select mode="multiple" placeholder="Chọn thẻ">
              {blogTag.list.map((tag: Tag) => (
                <Select.Option key={tag.id} value={tag.id}>
                  {tag.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" initialValue="draft">
            <Radio.Group>
              <Radio value="draft">Nháp</Radio>
              <Radio value="published">Đã đăng</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect(
  ({ blogPost, blogTag }: { blogPost: PostModelState; blogTag: TagModelState }) => ({
    blogPost,
    blogTag,
  }),
)(BaiViet);
