// src/pages/KanbanBoard/index.tsx
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Card, Tag, Button, Typography, Space, Tooltip, Badge } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import moment from 'moment';
import { Task, TaskStatus } from '@/types/task';
import TaskFormModal from './components/TaskFormModal'; // Component form (xem bước 5)

const { Title, Text } = Typography;

const COLUMNS: { key: TaskStatus; label: string; color: string }[] = [
  { key: 'todo', label: '📋 Cần làm', color: '#f0f2f5' },
  { key: 'inprogress', label: '🔄 Đang làm', color: '#e6f7ff' },
  { key: 'done', label: '✅ Hoàn thành', color: '#f6ffed' },
];

const PRIORITY_COLOR: Record<string, string> = {
  high: 'red',
  medium: 'orange',
  low: 'green',
};

const KanbanBoard: React.FC = () => {
  const { tasks, moveTask, deleteTask, addTask, updateTask } = useModel('task');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');

  // Xử lý khi thả task sang cột khác
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    moveTask(draggableId, destination.droppableId as TaskStatus);
  };

  const handleOpenAdd = (status: TaskStatus) => {
    setEditingTask(null);
    setDefaultStatus(status);
    setModalVisible(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleSubmit = (values: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, values);
    } else {
      addTask({ ...values, status: defaultStatus });
    }
    setModalVisible(false);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>🗂️ Kanban Board</Title>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', alignItems: 'flex-start' }}>
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.key);
            return (
              <div
                key={col.key}
                style={{
                  minWidth: 300,
                  flex: 1,
                  background: col.color,
                  borderRadius: 8,
                  padding: 12,
                  border: '1px solid #d9d9d9',
                }}
              >
                {/* Header cột */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <Space>
                    <Text strong>{col.label}</Text>
                    <Badge count={colTasks.length} style={{ backgroundColor: '#1890ff' }} />
                  </Space>
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    size="small"
                    onClick={() => handleOpenAdd(col.key)}
                  >
                    Thêm
                  </Button>
                </div>

                {/* Droppable vùng thả */}
                <Droppable droppableId={col.key}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        minHeight: 200,
                        background: snapshot.isDraggingOver ? '#bae7ff' : 'transparent',
                        borderRadius: 4,
                        transition: 'background 0.2s',
                        padding: 4,
                      }}
                    >
                      {colTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(prov, snap) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                              style={{
                                marginBottom: 8,
                                ...prov.draggableProps.style,
                              }}
                            >
                              <Card
                                size="small"
                                style={{
                                  boxShadow: snap.isDragging
                                    ? '0 8px 24px rgba(0,0,0,0.2)'
                                    : '0 1px 4px rgba(0,0,0,0.1)',
                                  cursor: 'grab',
                                  borderLeft: `4px solid ${PRIORITY_COLOR[task.priority] === 'red' ? '#ff4d4f' : task.priority === 'medium' ? '#faad14' : '#52c41a'}`,
                                }}
                                actions={[
                                  <Tooltip title="Chỉnh sửa">
                                    <EditOutlined key="edit" onClick={() => handleOpenEdit(task)} />
                                  </Tooltip>,
                                  <Tooltip title="Xoá">
                                    <DeleteOutlined key="delete" style={{ color: '#ff4d4f' }} onClick={() => deleteTask(task.id)} />
                                  </Tooltip>,
                                ]}
                              >
                                <Text strong>{task.title}</Text>
                                {task.description && (
                                  <div>
                                    <Text type="secondary" style={{ fontSize: 12 }}>{task.description}</Text>
                                  </div>
                                )}
                                <div style={{ marginTop: 8 }}>
                                  <Tag color={PRIORITY_COLOR[task.priority]}>{task.priority.toUpperCase()}</Tag>
                                  {task.tags?.map(tag => (
                                    <Tag key={tag}>{tag}</Tag>
                                  ))}
                                </div>
                                {task.deadline && (
                                  <div style={{ marginTop: 4 }}>
                                    <Text
                                      type={moment(task.deadline).isBefore(moment()) && task.status !== 'done' ? 'danger' : 'secondary'}
                                      style={{ fontSize: 12 }}
                                    >
                                      ⏰ {moment(task.deadline).format('DD/MM/YYYY')}
                                    </Text>
                                  </div>
                                )}
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Modal Form */}
      <TaskFormModal
        visible={modalVisible}
        initialValues={editingTask}
        defaultStatus={defaultStatus}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default KanbanBoard;
