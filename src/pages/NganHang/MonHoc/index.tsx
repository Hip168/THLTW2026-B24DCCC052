import { Button, Card, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { MonHoc } from '@/models/nganhang/monhoc';
import Form from './components/Form';

const { Title } = Typography;

const MonHocPage: React.FC = () => {
	const { data, xoa, handleEdit, handleCreate } = useModel('nganhang.monhoc');

	const columns = [
		{
			title: 'STT',
			render: (_: any, __: any, index: number) => index + 1,
			width: 60,
			align: 'center' as const,
		},
		{
			title: 'Mã môn',
			dataIndex: 'maMon',
			width: 140,
			render: (val: string) => <Tag color='blue'>{val}</Tag>,
		},
		{
			title: 'Tên môn học',
			dataIndex: 'tenMon',
		},
		{
			title: 'Số tín chỉ',
			dataIndex: 'soTinChi',
			width: 110,
			align: 'center' as const,
			render: (val: number) => <Tag color='green'>{val} TC</Tag>,
		},
		{
			title: 'Thao tác',
			width: 120,
			align: 'center' as const,
			render: (record: MonHoc) => (
				<Space>
					<Button
						type='link'
						icon={<EditOutlined />}
						onClick={() => handleEdit(record)}
						title='Chỉnh sửa'
					/>
					<Popconfirm
						title='Bạn có chắc muốn xóa môn học này?'
						onConfirm={() => xoa(record.maMon)}
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
					📖 Quản lý Môn học
				</Title>
				<Button type='primary' icon={<PlusOutlined />} onClick={handleCreate}>
					Thêm mới
				</Button>
			</div>
			<Table
				columns={columns}
				dataSource={data}
				rowKey='maMon'
				pagination={{ pageSize: 10 }}
				locale={{ emptyText: 'Chưa có môn học nào.' }}
				size='middle'
				bordered
			/>
			<Form />
		</Card>
	);
};

export default MonHocPage;
