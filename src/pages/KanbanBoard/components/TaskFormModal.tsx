// src/pages/KanbanBoard/components/TaskFormModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button } from 'antd';
import moment from 'moment';
import { Task, TaskStatus, TaskPriority } from '@/types/task';

const { TextArea } = Input;
const { Option } = Select;

interface Props {
  visible: boolean;
  initialValues?: Task | null;
  defaultStatus?: TaskStatus;
  onCancel: () => void;
  onSubmit: (values: Omit<Task, 'id' | 'createdAt'>) => void;
}

const TaskFormModal: React.FC<Props> = ({
  visible,
  initialValues,
  defaultStatus = 'todo',
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          deadline: initialValues.deadline ? moment(initialValues.deadline) : undefined,
          tags: initialValues.tags?.join(','),
        });
      } else {
        form.resetFields();
        form.setFieldValue('status', defaultStatus);
        form.setFieldValue('priority', 'medium');
      }
    }
  }, [visible, initialValues, defaultStatus]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const submittedValues = {
        ...values,
        deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : undefined,
        tags: values.tags
          ? values.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
          : [],
      };
      onSubmit(submittedValues);
    } catch {}
  };

  return (
    <Modal
      title={initialValues ? '✏️ Chỉnh sửa Task' : '➕ Thêm Task Mới'}
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      okText={initialValues ? 'Cập nhật' : 'Thêm mới'}
      cancelText="Hủy"
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="title"
          label="Tên Task"
          rules={[{ required: true, message: 'Vui lòng nhập tên task!' }]}
        >
          <Input placeholder="VD: Thiết kế giao diện trang chủ" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <TextArea rows={3} placeholder="Mô tả chi tiết công việc..." />
        </Form.Item>

        <Form.Item name="deadline" label="Deadline">
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item name="priority" label="Mức độ ưu tiên" rules={[{ required: true }]}>
          <Select placeholder="Chọn mức độ ưu tiên">
            <Option value="high">🔴 Cao</Option>
            <Option value="medium">🟡 Trung bình</Option>
            <Option value="low">🟢 Thấp</Option>
          </Select>
        </Form.Item>

        <Form.Item name="status" label="Trạng thái">
          <Select>
            <Option value="todo">📋 Cần làm</Option>
            <Option value="inprogress">🔄 Đang làm</Option>
            <Option value="done">✅ Hoàn thành</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="tags"
          label="Tags"
          extra="Nhập các tag cách nhau bằng dấu phẩy (VD: design, frontend, urgent)"
        >
          <Input placeholder="design, frontend, urgent" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskFormModal;
