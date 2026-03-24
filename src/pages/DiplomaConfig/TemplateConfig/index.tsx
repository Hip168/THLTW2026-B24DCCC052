import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Tooltip } from 'antd';
import { useModel } from 'umi';
import Form from './components/Form';

const TemplateConfigPage = () => {
  const { getModel, page, limit, deleteModel, handleEdit } = useModel('diploma.cauhinhbieumau');

  const columns: IColumn<Diploma.ICauHinhBieuMau>[] = [
    {
      title: 'Tên trường thông tin',
      dataIndex: 'tenTruong',
      width: 250,
      filterType: 'string',
      sortable: true,
    },
    {
      title: 'Kiểu dữ liệu',
      dataIndex: 'kieuDuLieu',
      width: 150,
      align: 'center',
      filterType: 'select',
      filterData: ['String', 'Number', 'Date'],
      sortable: true,
    },
    {
      title: 'Thao tác',
      align: 'center',
      width: 90,
      fixed: 'right',
      render: (record: Diploma.ICauHinhBieuMau) => (
        <>
          <Tooltip title="Chỉnh sửa">
            <Button onClick={() => handleEdit(record)} type="link" icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              onConfirm={() => deleteModel(record._id, getModel)}
              title="Bạn có chắc chắn muốn xóa trường thông tin này?"
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
      modelName="diploma.cauhinhbieumau"
      title="Cấu hình biểu mẫu"
      Form={Form}
    />
  );
};

export default TemplateConfigPage;
