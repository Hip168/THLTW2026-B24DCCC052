import { useState } from 'react';
import { IKhoaHoc, IKhoaHocFormValues } from '@/pages/KhoaHoc/types';
import {
  getKhoaHocList,
  createKhoaHoc,
  updateKhoaHoc,
  deleteKhoaHoc,
} from '@/pages/KhoaHoc/services/khoaHoc';
import { message } from 'antd';

export default () => {
  const [danhSach, setDanhSach] = useState<IKhoaHoc[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [visibleDetail, setVisibleDetail] = useState<boolean>(false);
  const [recordEdit, setRecordEdit] = useState<IKhoaHoc | undefined>(undefined);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const fetchDanhSach = async (params?: {
    tenKhoaHoc?: string;
    giangVien?: string;
    trangThai?: string;
  }) => {
    setLoading(true);
    try {
      const res = await getKhoaHocList(params);
      setDanhSach(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleThem = () => {
    setRecordEdit(undefined);
    setVisibleModal(true);
  };

  const handleSua = (record: IKhoaHoc) => {
    setRecordEdit(record);
    setVisibleModal(true);
  };

  const handleXemChiTiet = (record: IKhoaHoc) => {
    setRecordEdit(record);
    setVisibleDetail(true);
  };

  const handleXoa = async (record: IKhoaHoc) => {
    if (record.soLuongHocVien > 0) {
      message.error('Không thể xóa khóa học đã có học viên');
      return;
    }
    await deleteKhoaHoc(record.id);
    message.success('Xóa khóa học thành công');
    fetchDanhSach();
  };

  const handleSubmit = async (values: IKhoaHocFormValues) => {
    setSubmitting(true);
    try {
      if (recordEdit) {
        await updateKhoaHoc(recordEdit.id, values);
        message.success('Cập nhật khóa học thành công');
      } else {
        await createKhoaHoc(values);
        message.success('Thêm mới khóa học thành công');
      }
      setVisibleModal(false);
      fetchDanhSach();
    } finally {
      setSubmitting(false);
    }
  };

  return {
    danhSach,
    loading,
    visibleModal,
    setVisibleModal,
    visibleDetail,
    setVisibleDetail,
    recordEdit,
    submitting,
    fetchDanhSach,
    handleThem,
    handleSua,
    handleXemChiTiet,
    handleXoa,
    handleSubmit,
  };
};
