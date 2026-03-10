import { Button, Card, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { KhoiKienThuc } from '@/models/nganhang/khoikienthuc';
import Form from './components/Form';

const { Title } = Typography;

const KhoiKienThucPage: React.FC = () => {
	const { data, xoa, handleEdit, handleCreate } = useModel('nganhang.khoikienthuc');

	const columns = [
		{
			title: 'STT',
			render: (_: any, __: any, index: number) => index + 1,
			width: 60,
			align: 'center' as const,
		},
		{
			title: 'ID',
			dataIndex: 'id',
			width: 260,
			render: (val: string) => <Tag>{val}</Tag>,
		},
		{
			title: 'Tên Khối kiến thức',
			dataIndex: 'ten',
		},
		{
			title: 'Thao tác',
			width: 120,
			align: 'center' as const,
			render: (record: KhoiKienThuc) => (
				<Space>
					<Button
						type='link'
						icon={<EditOutlined />}
						onClick={() => handleEdit(record)}
						title='Chỉnh sửa'
					/>
					<Popconfirm
						title='Bạn có chắc muốn xóa khối kiến thức này?'
						onConfirm={() => xoa(record.id)}
						okText='Xóa'
						cancelText='Hủy'
					>
						<Button danger type='link' icon={<DeleteOutlined />} title='Xóa' />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
				<Title level={4} style={{ margin: 0 }}>
					📚 Quản lý Khối kiến thức
				</Title>
				<Button type='primary' icon={<PlusOutlined />} onClick={handleCreate}>
					Thêm mới
				</Button>
			</div>
			<Table
				columns={columns}
				dataSource={data}
				rowKey='id'
				pagination={{ pageSize: 10 }}
				locale={{ emptyText: 'Chưa có khối kiến thức nào.' }}
				size='middle'
				bordered
			/>
			<Form />
		</Card>
	);
};

export default KhoiKienThucPage;
