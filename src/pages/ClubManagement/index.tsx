import React, { useRef, useState } from 'react';
import { Button, Popconfirm, message, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, ModalForm, ProFormText, ProFormSwitch } from '@ant-design/pro-components';
import { Editor } from '@tinymce/tinymce-react';
import type { Club } from '@/services/ClubManagement/club';
import { getClubs, addClub, updateClub, deleteClub } from '@/services/ClubManagement/club';
import moment from 'moment';
import { Link } from 'umi';

const ClubManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<Club>();
  const [descriptionHtml, setDescriptionHtml] = useState<string>('');

  const fetchClubs = async (params: any) => {
    const res = await getClubs(params);
    return {
      data: res.data,
      success: res.success,
      total: res.total,
    };
  };

  const handleAdd = async (fields: Club) => {
    try {
      await addClub({ ...fields, descriptionHtml });
      message.success('Thêm thành công');
      return true;
    } catch (error) {
      message.error('Thêm thất bại');
      return false;
    }
  };

  const handleUpdate = async (fields: Club) => {
    try {
      await updateClub(currentRow?.id as string, { ...currentRow, ...fields, descriptionHtml });
      message.success('Cập nhật thành công');
      return true;
    } catch (error) {
      message.error('Cập nhật thất bại');
      return false;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteClub(id);
      message.success('Xóa thành công');
      actionRef.current?.reload();
    } catch (error) {
      message.error('Xóa thất bại');
    }
  };

  const columns: ProColumns<Club>[] = [
    {
      title: 'Ảnh đại diện',
      dataIndex: 'avatar',
      hideInSearch: true,
      render: (dom, entity) => <img src={entity.avatar} alt="avatar" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '50%' }} />,
    },
    {
      title: 'Tên câu lạc bộ',
      dataIndex: 'name',
    },
    {
      title: 'Ngày thành lập',
      dataIndex: 'foundedDate',
      valueType: 'date',
      hideInSearch: true,
      render: (_, entity) => entity.foundedDate ? moment(entity.foundedDate).format('DD/MM/YYYY HH:mm') : '',
    },
    {
      title: 'Chủ nhiệm CLB',
      dataIndex: 'president',
      hideInSearch: true,
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      hideInSearch: true,
      render: (_, entity) => <Switch checked={entity.isActive} disabled />,
    },
    {
      title: 'Mô tả',
      dataIndex: 'descriptionHtml',
      hideInSearch: true,
      render: (_, entity) => <div dangerouslySetInnerHTML={{ __html: entity.descriptionHtml || '' }} style={{ maxHeight: 60, overflow: 'hidden' }} />,
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setCurrentRow(record);
            setDescriptionHtml(record.descriptionHtml || '');
            setModalVisible(true);
          }}
        >
          Sửa
        </a>,
        <Popconfirm
          key="delete"
          title="Bạn có chắc chắn muốn xóa?"
          onConfirm={() => handleDelete(record.id)}
        >
          <a style={{ color: 'red' }}>Xóa</a>
        </Popconfirm>,
        <Link key="members" to={`/member-management?clubId=${record.id}`}>
          Xem danh sách thành viên
        </Link>,
      ],
    },
  ];

  return (
    <>
      <ProTable<Club>
        headerTitle="Danh sách Câu lạc bộ"
        actionRef={actionRef}
        rowKey="id"
        search={{ labelWidth: 120 }}
        request={fetchClubs}
        columns={columns}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCurrentRow(undefined);
              setDescriptionHtml('');
              setModalVisible(true);
            }}
          >
            <PlusOutlined /> Thêm mới
          </Button>,
        ]}
      />
      <ModalForm
        title={currentRow ? 'Cập nhật Câu lạc bộ' : 'Thêm mới Câu lạc bộ'}
        visible={modalVisible}
        onVisibleChange={setModalVisible}
        initialValues={currentRow}
        onFinish={async (value) => {
          const success = currentRow ? await handleUpdate(value as Club) : await handleAdd(value as Club);
          if (success) {
            setModalVisible(false);
            if (actionRef.current) actionRef.current.reload();
          }
        }}
      >
        <ProFormText
          name="name"
          label="Tên câu lạc bộ"
          rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
        />
        <ProFormText
          name="avatar"
          label="Avatar URL"
        />
        <ProFormText
          name="president"
          label="Chủ nhiệm CLB"
        />
        <ProFormSwitch
          name="isActive"
          label="Hoạt động"
        />
        <div style={{ marginBottom: 24 }}>
          <label style={{ paddingBottom: 8, display: 'block' }}>Mô tả chi tiết</label>
          <Editor
            value={descriptionHtml}
            onEditorChange={(content) => setDescriptionHtml(content)}
            init={{
              height: 300,
              menubar: false,
              plugins: ['lists link image paste help wordcount'],
              toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | help',
            }}
          />
        </div>
      </ModalForm>
    </>
  );
};

export default ClubManagement;
