// src/pages/DanhSachTask/index.tsx
import React, { useState, useMemo } from 'react';
import {
  Table, Tag, Button, Space, Input, Select, Typography,
  Tooltip, Popconfirm, Row, Col,
} from 'antd';
import {
  SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import moment from 'moment';
import { Task, TaskStatus } from '@/types/task';
import TaskFormModal from '../KanbanBoard/components/TaskFormModal'; // Tái sử dụng

const { Title } = Typography;
const { Option } = Select;

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: '📋 Cần làm',
  inprogress: '🔄 Đang làm',
  done: '✅ Hoàn thành',
};

const STATUS_COLOR: Record<TaskStatus, string> = {
  todo: 'blue',
  inprogress: 'orange',
  done: 'green',
};

const PRIORITY_COLOR: Record<string, string> = {
  high: 'red',
  medium: 'orange',
  low: 'green',
};

const DanhSachTask: React.FC = () => {
  const { tasks, addTask, updateTask, deleteTask } = useModel('task');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Lọc + tìm kiếm
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchStatus = statusFilter === 'all' || t.status === statusFilter;
      const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [tasks, search, statusFilter]);

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleAdd = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  const handleSubmit = (values: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, values);
    } else {
      addTask(values);
    }
    setModalVisible(false);
  };

  const columns = [
    {
      title: 'Tên Task',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => text || <span style={{ color: '#bbb' }}>—</span>,
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
      sorter: (a: Task, b: Task) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      },
      render: (date: string, record: Task) => {
        if (!date) return <span style={{ color: '#bbb' }}>—</span>;
        const isOverdue = moment(date).isBefore(moment()) && record.status !== 'done';
        return (
          <span style={{ color: isOverdue ? '#ff4d4f' : 'inherit' }}>
            {isOverdue && '⚠️ '}
            {moment(date).format('DD/MM/YYYY')}
          </span>
        );
      },
    },
    {
      title: 'Ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      filters: [
        { text: '🔴 Cao', value: 'high' },
        { text: '🟡 Trung bình', value: 'medium' },
        { text: '🟢 Thấp', value: 'low' },
      ],
      onFilter: (value: string, record: Task) => record.priority === value,
      render: (priority: string) => (
        <Tag color={PRIORITY_COLOR[priority]}>{priority.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: TaskStatus) => (
        <Tag color={STATUS_COLOR[status]}>{STATUS_LABEL[status]}</Tag>
      ),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string[]) =>
        tags?.length ? tags.map(tag => <Tag key={tag}>{tag}</Tag>) : '—',
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Task) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn chắc muốn xoá task này?"
            onConfirm={() => deleteTask(record.id)}
            okText="Xoá"
            cancelText="Hủy"
          >
            <Tooltip title="Xoá">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>📋 Danh sách Task</Title>

      {/* Thanh công cụ */}
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8}>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Tìm kiếm theo tên task..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            allowClear
          />
        </Col>
        <Col xs={24} sm={6}>
          <Select
            style={{ width: '100%' }}
            value={statusFilter}
            onChange={setStatusFilter}
          >
            <Option value="all">🔍 Tất cả</Option>
            <Option value="todo">📋 Cần làm</Option>
            <Option value="inprogress">🔄 Đang làm</Option>
            <Option value="done">✅ Hoàn thành</Option>
          </Select>
        </Col>
        <Col xs={24} sm={10} style={{ textAlign: 'right' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm Task Mới
          </Button>
        </Col>
      </Row>

      {/* Bảng dữ liệu */}
      <Table
        columns={columns}
        dataSource={filteredTasks}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: true }}
        scroll={{ x: 800 }}
        locale={{ emptyText: 'Không có task nào phù hợp 😊' }}
      />

      {/* Modal Form */}
      <TaskFormModal
        visible={modalVisible}
        initialValues={editingTask}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default DanhSachTask;
