import React from 'react';
import { Descriptions, Modal, Tag } from 'antd';
import { useModel } from 'umi';
import { TrangThaiKhoaHoc } from '../types';

const TAG_TRANG_THAI: Record<TrangThaiKhoaHoc, { color: string; label: string }> = {
  [TrangThaiKhoaHoc.DANG_MO]: { color: 'green', label: 'Đang mở' },
  [TrangThaiKhoaHoc.DA_KET_THUC]: { color: 'red', label: 'Đã kết thúc' },
  [TrangThaiKhoaHoc.TAM_DUNG]: { color: 'orange', label: 'Tạm dừng' },
};

const ModalChiTiet: React.FC = () => {
  const { visibleDetail, setVisibleDetail, recordEdit } = useModel('khoahoc');

  return (
    <Modal
      title="Chi tiết khóa học"
      visible={visibleDetail}
      onCancel={() => setVisibleDetail(false)}
      footer={null}
      width={700}
      destroyOnClose
    >
      <Descriptions bordered column={1} labelStyle={{ fontWeight: 'bold', width: 180 }}>
        <Descriptions.Item label="ID khóa học">{recordEdit?.id}</Descriptions.Item>
        <Descriptions.Item label="Tên khóa học">{recordEdit?.tenKhoaHoc}</Descriptions.Item>
        <Descriptions.Item label="Giảng viên">{recordEdit?.giangVien}</Descriptions.Item>
        <Descriptions.Item label="Số lượng học viên">{recordEdit?.soLuongHocVien}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {recordEdit?.trangThai && (
            <Tag color={TAG_TRANG_THAI[recordEdit.trangThai]?.color}>
              {TAG_TRANG_THAI[recordEdit.trangThai]?.label}
            </Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả">
          <div dangerouslySetInnerHTML={{ __html: recordEdit?.moTa || '<i>Chưa có mô tả</i>' }} />
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ModalChiTiet;
