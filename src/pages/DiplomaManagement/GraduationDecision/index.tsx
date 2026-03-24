import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/Form';

const GraduationDecisionPage = () => {
  const { getModel, page, limit, deleteModel, handleEdit } = useModel('diploma.quyetdinh');
  const { danhSach: danhSachSo } = useModel('diploma.sovanbang');

  const columns: IColumn<Diploma.IQuyetDinh>[] = [
    {
      title: 'Số quyết định',
      dataIndex: 'soQuyetDinh',
      width: 150,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Ngày ban hành',
      dataIndex: 'ngayBanHanh',
      width: 120,
      align: 'center',
      render: (val) => moment(val).format('DD/MM/YYYY'),
      sortable: true,
    },
    {
      title: 'Trích yếu',
      dataIndex: 'trichYeu',
      width: 300,
      filterType: 'string',
    },
    {
      title: 'Sổ văn bằng',
      dataIndex: 'idSoVanBang',
      width: 200,
      render: (val) => danhSachSo.find(s => s._id === val)?.ten ?? val,
    },
    {
      title: 'Lượt tra cứu',
      dataIndex: 'luotTraCuu',
      width: 100,
      align: 'center',
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: Diploma.IQuyetDinh) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa quyết định này?"
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
      modelName="diploma.quyetdinh"
      title="Quyết định tốt nghiệp"
      Form={Form}
    />
  );
};

export default GraduationDecisionPage;
