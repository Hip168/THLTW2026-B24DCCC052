import React, { useRef, useState } from 'react';
import { Space, message } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable, ModalForm, ProFormSelect } from '@ant-design/pro-components';
import type { Application } from '@/services/ApplicationManagement/application';
import { getApplications, bulkTransferApplications } from '@/services/ApplicationManagement/application';
import { getClubs } from '@/services/ClubManagement/club';

const MemberManagement: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [transferModalVisible, setTransferModalVisible] = useState(false);

  const fetchMembers = async (params: any) => {
    // Only fetch Approved applications
    const res = await getApplications({ ...params, status: 'Approved' });
    return {
      data: res.data,
      success: res.success,
      total: res.total,
    };
  };

  const handleTransfer = async (values: any) => {
    try {
      if (selectedRowKeys.length === 0) {
        message.warning('Vui lòng chọn thành viên cần chuyển');
        return false;
      }
      await bulkTransferApplications(selectedRowKeys as string[], values.clubId);
      message.success('Chuyển câu lạc bộ thành công');
      setSelectedRowKeys([]);
      setTransferModalVisible(false);
      actionRef.current?.reload();
      return true;
    } catch {
      message.error('Chuyển thất bại');
      return false;
    }
  };

  const columns: ProColumns<Application>[] = [
    { title: 'Họ tên', dataIndex: 'fullName' },
    { title: 'Email', dataIndex: 'email', hideInSearch: true },
    { title: 'SĐT', dataIndex: 'phone', hideInSearch: true },
    {
      title: 'Câu lạc bộ',
      dataIndex: 'clubId',
      request: async () => {
        const res = await getClubs();
        return res.data.map((item: any) => ({ label: item.name, value: item.id }));
      },
    },
  ];

  return (
    <>
      <ProTable<Application>
        headerTitle="Danh sách Thành viên"
        actionRef={actionRef}
        rowKey="id"
        request={fetchMembers}
        columns={columns}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        tableAlertOptionRender={() => (
          <Space size={16}>
            <a onClick={() => setTransferModalVisible(true)}>Chuyển CLB cho {selectedRowKeys.length} thành viên</a>
          </Space>
        )}
      />
      
      <ModalForm
        title={`Chuyển CLB cho ${selectedRowKeys.length} thành viên`}
        visible={transferModalVisible}
        onVisibleChange={setTransferModalVisible}
        onFinish={handleTransfer}
        modalProps={{ destroyOnClose: true }}
      >
        <ProFormSelect
          name="clubId"
          label="Chọn Câu lạc bộ mới"
          request={async () => {
            const res = await getClubs();
            return res.data.map((item: any) => ({ label: item.name, value: item.id }));
          }}
          rules={[{ required: true, message: 'Vui lòng chọn CLB' }]}
        />
      </ModalForm>
    </>
  );
};

export default MemberManagement;
