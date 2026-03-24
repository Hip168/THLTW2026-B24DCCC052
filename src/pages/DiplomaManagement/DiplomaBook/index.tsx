import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const DiplomaBookPage = () => {
  const { getModel, page, limit, deleteModel, handleEdit } = useModel('diploma.sovanbang');

  const columns: IColumn<Diploma.ISoVanBang>[] = [
    {
      title: 'Tên sổ văn bằng',
      dataIndex: 'ten',
      width: 300,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Năm',
      dataIndex: 'nam',
      width: 120,
      align: 'center',
      filterType: 'string', // Assuming number filter exists or using string for simplicity
      sortable: true,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: Diploma.ISoVanBang) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa sổ văn bằng này?"
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
      modelName="diploma.sovanbang"
      title="Sổ văn bằng"
      Form={Form}
    />
  );
};

export default DiplomaBookPage;
