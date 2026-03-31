import React, { useRef, useState } from 'react';
import { Button, message, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, ModalForm, ProFormTextArea, DrawerForm, ProForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import type { Application } from '@/services/ApplicationManagement/application';
import { getApplications, updateApplication, bulkApproveApplications, bulkRejectApplications, addApplication } from '@/services/ApplicationManagement/application';
import { getClubs } from '@/services/ClubManagement/club';
import moment from 'moment';

const ApplicationManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<Application>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isBulkReject, setIsBulkReject] = useState(false);
  const [historyDrawerVisible, setHistoryDrawerVisible] = useState(false);

  const [createModalVisible, setCreateModalVisible] = useState(false);

  const fetchApplications = async (params: any) => {
    const res = await getApplications(params);
    return {
      data: res.data,
      success: res.success,
      total: res.total,
    };
  };

  const handleCreate = async (values: any) => {
    try {
      await addApplication(values);
      message.success('Tạo đơn thành công');
      setCreateModalVisible(false);
      actionRef.current?.reload();
      return true;
    } catch {
      message.error('Tạo đơn thất bại');
      return false;
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateApplication(id, { status: 'Approved' });
      message.success('Đã duyệt');
      actionRef.current?.reload();
    } catch {
      message.error('Duyệt thất bại');
    }
  };

  const handleRejectSubmit = async (values: any) => {
    try {
      if (isBulkReject) {
        await bulkRejectApplications(selectedRowKeys as string[], values.rejectNote);
        setSelectedRowKeys([]);
      } else if (currentRow) {
        await updateApplication(currentRow.id, { status: 'Rejected', rejectNote: values.rejectNote });
      }
      message.success('Đã từ chối');
      setRejectModalVisible(false);
      actionRef.current?.reload();
      return true;
    } catch {
      message.error('Thất bại');
      return false;
    }
  };

  const handleBulkApprove = async () => {
    try {
      await bulkApproveApplications(selectedRowKeys as string[]);
      message.success('Đã duyệt hàng loạt');
      setSelectedRowKeys([]);
      actionRef.current?.reload();
    } catch {
      message.error('Thất bại');
    }
  };

  const columns: ProColumns<Application>[] = [
    { title: 'Họ tên', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email', hideInSearch: true },
    { title: 'SĐT', dataIndex: 'phone', hideInSearch: true },
    { title: 'Giới tính', dataIndex: 'gender', hideInSearch: true },
    {
      title: 'Câu lạc bộ',
      dataIndex: 'clubId',
      request: async () => {
        const res = await getClubs();
        return res.data.map((item: any) => ({ label: item.name, value: item.id }));
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      valueEnum: {
        Pending: { text: 'Pending', status: 'Processing' },
        Approved: { text: 'Approved', status: 'Success' },
        Rejected: { text: 'Rejected', status: 'Error' },
      },
    },
    {
      title: 'Lịch sử',
      hideInSearch: true,
      render: (_, record) => (
        <a onClick={() => { setCurrentRow(record); setHistoryDrawerVisible(true); }}>
          Xem lịch sử
        </a>
      )
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          {record.status === 'Pending' && (
            <>
              <a onClick={() => handleApprove(record.id)}>Duyệt</a>
              <a onClick={() => { setCurrentRow(record); setIsBulkReject(false); setRejectModalVisible(true); }} style={{ color: 'red' }}>Từ chối</a>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <ProTable<Application>
        headerTitle="Quản lý Đơn đăng ký"
        actionRef={actionRef}
        rowKey="id"
        request={fetchApplications}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> Tạo đơn mới
          </Button>,
        ]}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <a onClick={handleBulkApprove}>Duyệt {selectedRowKeys.length} đơn</a>
              <a onClick={() => { setIsBulkReject(true); setRejectModalVisible(true); }}>Từ chối {selectedRowKeys.length} đơn</a>
            </Space>
          );
        }}
      />
      <ModalForm
        title="Tạo đơn đăng ký mới"
        visible={createModalVisible}
        onVisibleChange={setCreateModalVisible}
        onFinish={handleCreate}
        modalProps={{ destroyOnClose: true }}
      >
        <ProForm.Group>
          <ProFormText
            name="fullName"
            label="Họ và tên"
            width="md"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          />
          <ProFormText
            name="email"
            label="Email"
            width="md"
            rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProFormText
            name="phone"
            label="Số điện thoại"
            width="md"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          />
          <ProFormSelect
            name="gender"
            label="Giới tính"
            width="md"
            options={[
              { label: 'Nam', value: 'Nam' },
              { label: 'Nữ', value: 'Nữ' },
              { label: 'Khác', value: 'Khác' },
            ]}
          />
        </ProForm.Group>
        <ProFormSelect
          name="clubId"
          label="Câu lạc bộ đăng ký"
          request={async () => {
            const res = await getClubs();
            return res.data.map((item: any) => ({ label: item.name, value: item.id }));
          }}
          rules={[{ required: true, message: 'Vui lòng chọn câu lạc bộ' }]}
        />
        <ProFormText name="address" label="Địa chỉ" />
        <ProFormTextArea name="strengths" label="Sở trường" />
        <ProFormTextArea name="reason" label="Lý do đăng ký" />
      </ModalForm>
      <ModalForm
        title="Lý do từ chối"
        visible={rejectModalVisible}
        onVisibleChange={setRejectModalVisible}
        onFinish={handleRejectSubmit}
      >
        <ProFormTextArea
          name="rejectNote"
          label="Lý do"
          rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối' }]}
        />
      </ModalForm>
      
      <DrawerForm
        title="Lịch sử duyệt đơn"
        visible={historyDrawerVisible}
        onVisibleChange={setHistoryDrawerVisible}
        drawerProps={{ destroyOnClose: true }}
      >
        {currentRow?.historyLogs?.map((log, index) => (
          <div key={index} style={{ marginBottom: 16, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
            <p><strong>{log.user}</strong> đã <strong>{log.action}</strong> vào lúc {moment(log.timestamp).format('HH:mm DD/MM/YYYY')}</p>
            {log.reason && <p>Lý do: {log.reason}</p>}
          </div>
        ))}
        {(!currentRow?.historyLogs || currentRow.historyLogs.length === 0) && (
          <p>Chưa có lịch sử.</p>
        )}
      </DrawerForm>
    </>
  );
};

export default ApplicationManagement;
