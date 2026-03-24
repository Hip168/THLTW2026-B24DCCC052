import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';

const DiplomaInfoPage = () => {
  const { getModel, page, limit, deleteModel, handleEdit } = useModel('diploma.thongtinvanbang');
  const { danhSach: danhSachQuyetDinh } = useModel('diploma.quyetdinh');

  const columns: IColumn<Diploma.IThongTinVanBang>[] = [
    {
      title: 'Số vào sổ',
      dataIndex: 'soVaoSo',
      width: 100,
      align: 'center',
      sortable: true,
    },
    {
      title: 'Số hiệu',
      dataIndex: 'soHieu',
      width: 120,
      filterType: 'string',
    },
    {
      title: 'Họ tên',
      dataIndex: 'hoTen',
      width: 200,
      filterType: 'string',
    },
    {
      title: 'Mã sinh viên',
      dataIndex: 'maSinhVien',
      width: 120,
      filterType: 'string',
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'ngaySinh',
      width: 120,
      align: 'center',
      render: (val) => moment(val).format('DD/MM/YYYY'),
    },
    {
      title: 'Quyết định',
      dataIndex: 'idQuyetDinh',
      width: 200,
      render: (val) => danhSachQuyetDinh.find(d => d._id === val)?.soQuyetDinh ?? val,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: Diploma.IThongTinVanBang) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa thông tin văn bằng này?"
              placement="topLeft"
            >
              <Button danger type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <TableBase
      columns={columns}
      dependencies={[page, limit]}
      modelName="diploma.thongtinvanbang"
      title="Thông tin văn bằng"
      Form={Form}
    />
  );
};

export default DiplomaInfoPage;
