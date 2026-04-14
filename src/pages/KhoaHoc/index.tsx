import React, { useEffect, useState } from 'react';
import { Button, Input, Modal, Select, Space, Table, Tag, Tooltip } from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { ColumnType } from 'antd/lib/table';
import { useModel } from 'umi';
import { IKhoaHoc, TrangThaiKhoaHoc } from './types';
import ModalKhoaHoc from './components/ModalKhoaHoc';
import ModalChiTiet from './components/ModalChiTiet';

const DANH_SACH_GIANG_VIEN = [
  'Nguyễn Văn An',
  'Trần Thị Bình',
  'Phan Quang Thành',
  'Phạm Thị Dung',
  'Đỗ Văn Em',
];

const TAG_TRANG_THAI: Record<TrangThaiKhoaHoc, { color: string; label: string }> = {
  [TrangThaiKhoaHoc.DANG_MO]: { color: 'green', label: 'Đang mở' },
  [TrangThaiKhoaHoc.DA_KET_THUC]: { color: 'red', label: 'Đã kết thúc' },
  [TrangThaiKhoaHoc.TAM_DUNG]: { color: 'orange', label: 'Tạm dừng' },
};

const KhoaHocPage: React.FC = () => {
  const {
    danhSach,
    loading,
    fetchDanhSach,
    handleThem,
    handleSua,
    handleXoa,
    handleXemChiTiet,
  } = useModel('khoahoc');

  const [search, setSearch] = useState<string>('');
  const [filterGiangVien, setFilterGiangVien] = useState<string | undefined>(undefined);
  const [filterTrangThai, setFilterTrangThai] = useState<string | undefined>(undefined);

  useEffect(() => {
    fetchDanhSach();
  }, []);

  const onSearch = () => {
    fetchDanhSach({
      tenKhoaHoc: search || undefined,
      giangVien: filterGiangVien,
      trangThai: filterTrangThai,
    });
  };

  const onReset = () => {
    setSearch('');
    setFilterGiangVien(undefined);
    setFilterTrangThai(undefined);
    fetchDanhSach();
  };

  const confirmXoa = (record: IKhoaHoc) => {
    if (record.soLuongHocVien > 0) {
      handleXoa(record);
      return;
    }
    Modal.confirm({
      title: `Bạn có chắc chắn muốn xóa khóa học "${record.tenKhoaHoc}"?`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => handleXoa(record),
    });
  };

  const columns: ColumnType<IKhoaHoc>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 60,
      align: 'center',
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'tenKhoaHoc',
    },
    {
      title: 'Giảng viên',
      dataIndex: 'giangVien',
      width: 180,
    },
    {
      title: 'Số lượng học viên',
      dataIndex: 'soLuongHocVien',
      width: 170,
      align: 'center',
      sorter: (a: IKhoaHoc, b: IKhoaHoc) => a.soLuongHocVien - b.soLuongHocVien,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      width: 140,
      align: 'center',
      render: (val: TrangThaiKhoaHoc) => {
        const cfg = TAG_TRANG_THAI[val];
        return <Tag color={cfg?.color}>{cfg?.label ?? val}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 150,
      fixed: 'right' as const,
      render: (_: unknown, record: IKhoaHoc) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleXemChiTiet(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleSua(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => confirmXoa(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          gap: 12,
          marginBottom: 16,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Input
          placeholder="Tìm theo tên khóa học"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onPressEnter={onSearch}
          style={{ width: 240 }}
          prefix={<SearchOutlined />}
          allowClear
        />

        <Select
          placeholder="Lọc theo giảng viên"
          style={{ width: 200 }}
          value={filterGiangVien}
          onChange={(val) => setFilterGiangVien(val)}
          allowClear
        >
          {DANH_SACH_GIANG_VIEN.map((gv) => (
            <Select.Option key={gv} value={gv}>
              {gv}
            </Select.Option>
          ))}
        </Select>

        <Select
          placeholder="Lọc theo trạng thái"
          style={{ width: 180 }}
          value={filterTrangThai}
          onChange={(val) => setFilterTrangThai(val)}
          allowClear
        >
          <Select.Option value={TrangThaiKhoaHoc.DANG_MO}>Đang mở</Select.Option>
          <Select.Option value={TrangThaiKhoaHoc.DA_KET_THUC}>Đã kết thúc</Select.Option>
          <Select.Option value={TrangThaiKhoaHoc.TAM_DUNG}>Tạm dừng</Select.Option>
        </Select>

        <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
          Tìm kiếm
        </Button>

        <Button onClick={onReset}>Đặt lại</Button>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleThem}
          style={{ marginLeft: 'auto' }}
        >
          Thêm mới
        </Button>
      </div>

      <Table<IKhoaHoc>
        rowKey="id"
        columns={columns}
        dataSource={danhSach}
        loading={loading}
        bordered
        scroll={{ x: 900 }}
        pagination={{ pageSize: 10, showTotal: (total) => `Tổng ${total} khóa học` }}
      />

      <ModalKhoaHoc danhSachHienTai={danhSach} />
      <ModalChiTiet />
    </div>
  );
};

export default KhoaHocPage;
