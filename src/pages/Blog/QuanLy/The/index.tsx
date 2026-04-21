import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Popconfirm, Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import type { TagModelState } from '@/models/blog/tag';
import type { Tag } from '@/types/blog';

interface TheProps {
  blogTag: TagModelState;
  dispatch: (action: { type: string; payload?: Record<string, unknown> }) => void;
}

const The: React.FC<TheProps> = ({ blogTag, dispatch }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  useEffect(() => {
    dispatch({ type: 'blogTag/fetchList' });
  }, [dispatch]);

  const handleOpen = (tag?: Tag) => {
    if (tag) {
      setEditingTag(tag);
      form.setFieldsValue({ name: tag.name });
    } else {
      setEditingTag(null);
      form.resetFields();
    }
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
    setEditingTag(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editingTag) {
      dispatch({ type: 'blogTag/update', payload: { id: editingTag.id, ...values } });
    } else {
      dispatch({ type: 'blogTag/create', payload: values });
    }
    handleClose();
  };

  const handleDelete = (id: string) => {
    dispatch({ type: 'blogTag/remove', payload: { id } });
  };

  const columns = [
    {
      title: 'Tên thẻ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số bài viết',
      dataIndex: 'postCount',
      key: 'postCount',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: unknown, record: Tag) => (
        <Space>
          <Button type="link" onClick={() => handleOpen(record)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa thẻ này?"
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => handleOpen()}
          style={{ background: '#CC0D00', borderColor: '#CC0D00' }}
        >
          Thêm thẻ
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={blogTag.list}
        loading={blogTag.loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingTag ? 'Sửa thẻ' : 'Thêm thẻ mới'}
        open={visible}
        onOk={handleSubmit}
        onCancel={handleClose}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{ style: { background: '#CC0D00', borderColor: '#CC0D00' } }}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên thẻ" rules={[{ required: true, message: 'Vui lòng nhập tên thẻ' }]}>
            <Input placeholder="Nhập tên thẻ..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default connect(({ blogTag }: { blogTag: TagModelState }) => ({ blogTag }))(The);
