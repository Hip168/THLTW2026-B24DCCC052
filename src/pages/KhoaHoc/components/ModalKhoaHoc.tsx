import React, { useEffect, useRef } from 'react';
import { Form, Input, InputNumber, Modal, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { useModel } from 'umi';
import { IKhoaHoc, IKhoaHocFormValues, TrangThaiKhoaHoc } from '../types';

const DANH_SACH_GIANG_VIEN = [
  'Nguyễn Văn An',
  'Trần Thị Bình',
  'Phan Quang Thành',
  'Phạm Thị Dung',
  'Đỗ Văn Em',
];

interface Props {
  danhSachHienTai: IKhoaHoc[];
}

const ModalKhoaHoc: React.FC<Props> = ({ danhSachHienTai }) => {
  const formRef = useRef<FormInstance>(null);
  const { visibleModal, setVisibleModal, recordEdit, submitting, handleSubmit } =
    useModel('khoahoc');

  useEffect(() => {
    if (!visibleModal) {
      formRef.current?.resetFields();
      return;
    }
    if (recordEdit) {
      formRef.current?.setFieldsValue(recordEdit);
    } else {
      formRef.current?.resetFields();
    }
  }, [visibleModal, recordEdit]);

  const onFinish = async (values: IKhoaHocFormValues) => {
    await handleSubmit(values);
  };

  const validateTenKhoaHoc = (_: unknown, value: string) => {
    if (!value) return Promise.resolve();
    const trung = danhSachHienTai.some(
      (item) =>
        item.tenKhoaHoc.trim().toLowerCase() === value.trim().toLowerCase() &&
        item.id !== recordEdit?.id,
    );
    if (trung) return Promise.reject(new Error('Tên khóa học đã tồn tại'));
    return Promise.resolve();
  };

  return (
    <Modal
      title={recordEdit ? 'Chỉnh sửa khóa học' : 'Thêm mới khóa học'}
      visible={visibleModal}
      onCancel={() => setVisibleModal(false)}
      onOk={() => formRef.current?.submit()}
      confirmLoading={submitting}
      okText={recordEdit ? 'Lưu lại' : 'Thêm mới'}
      cancelText="Hủy"
      destroyOnClose
      width={600}
    >
      <Form
        ref={formRef}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="tenKhoaHoc"
          label="Tên khóa học"
          rules={[
            { required: true, message: 'Bắt buộc' },
            { max: 100, message: 'Không quá 100 ký tự' },
            { whitespace: true, message: 'Toàn ký tự trắng không hợp lệ' },
            { validator: validateTenKhoaHoc },
          ]}
        >
          <Input placeholder="Nhập tên khóa học" />
        </Form.Item>

        <Form.Item
          name="giangVien"
          label="Giảng viên"
          rules={[{ required: true, message: 'Bắt buộc' }]}
        >
          <Select placeholder="Chọn giảng viên">
            {DANH_SACH_GIANG_VIEN.map((gv) => (
              <Select.Option key={gv} value={gv}>
                {gv}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="soLuongHocVien"
          label="Số lượng học viên"
          rules={[
            { required: true, message: 'Bắt buộc' },
            { type: 'number', min: 0, message: 'Tối thiểu 0' },
          ]}
        >
          <InputNumber min={0} style={{ width: '100%' }} placeholder="Nhập số lượng học viên" />
        </Form.Item>

        <Form.Item name="moTa" label="Mô tả">
          <Input.TextArea rows={4} placeholder="Nhập mô tả khóa học (HTML hoặc văn bản thường)" />
        </Form.Item>

        <Form.Item
          name="trangThai"
          label="Trạng thái"
          rules={[{ required: true, message: 'Bắt buộc' }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Select.Option value={TrangThaiKhoaHoc.DANG_MO}>Đang mở</Select.Option>
            <Select.Option value={TrangThaiKhoaHoc.DA_KET_THUC}>Đã kết thúc</Select.Option>
            <Select.Option value={TrangThaiKhoaHoc.TAM_DUNG}>Tạm dừng</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalKhoaHoc;
