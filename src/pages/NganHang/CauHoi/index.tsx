import { Button, Card, Input, Popconfirm, Select, Space, Table, Tag, Typography } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { CauHoi } from '@/models/nganhang/cauhoi';
import { MucDo } from '@/models/nganhang/cauhoi';
import Form from './components/Form';

const { Title } = Typography;
const { Option } = Select;

const MUC_DO_COLOR: Record<MucDo, string> = {
	[MucDo.De]: 'green',
	[MucDo.TrungBinh]: 'blue',
	[MucDo.Kho]: 'orange',
	[MucDo.RatKho]: 'red',
};

const CauHoiPage: React.FC = () => {
	const { filteredData, filter, setFilter, xoa, handleEdit, handleCreate } =
		useModel('nganhang.cauhoi');
	const { data: monHocList } = useModel('nganhang.monhoc');
	const { data: khoiList } = useModel('nganhang.khoikienthuc');

	const columns = [
		{
			title: 'Mã CH',
			dataIndex: 'maCauHoi',
			width: 100,
			render: (val: string) => <Tag>{val}</Tag>,
		},
		{
			title: 'Môn học',
			dataIndex: ['monHoc', 'tenMon'],
			width: 180,
		},
		{
			title: 'Nội dung',
			dataIndex: 'noiDung',
			ellipsis: true,
		},
		{
			title: 'Mức độ',
			dataIndex: 'mucDo',
			width: 120,
			align: 'center' as const,
			render: (val: MucDo) => <Tag color={MUC_DO_COLOR[val]}>{val}</Tag>,
		},
		{
			title: 'Khối KT',
			dataIndex: ['khoiKienThuc', 'ten'],
			width: 140,
		},
		{
			title: 'Thao tác',
			width: 100,
			align: 'center' as const,
			render: (record: CauHoi) => (
				<Space>
					<Button type='link' icon={<EditOutlined />} onClick={() => handleEdit(record)} />
					<Popconfirm
						title='Xóa câu hỏi này?'
						onConfirm={() => xoa(record.maCauHoi)}
						okText='Xóa'
						cancelText='Hủy'
					>
						<Button danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	return (
		<Card>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
				<Title level={4} style={{ margin: 0 }}>
					❓ Ngân hàng Câu hỏi
				</Title>
				<Button type='primary' icon={<PlusOutlined />} onClick={handleCreate}>
					Thêm câu hỏi
				</Button>
			</div>


			<Card
				size='small'
				style={{ marginBottom: 16, background: '#fafafa' }}
				title={<span><SearchOutlined /> Tìm kiếm / Lọc</span>}
			>
				<Space wrap>
					<Select
						placeholder='Lọc theo Môn học'
						allowClear
						style={{ width: 220 }}
						onChange={(val) => setFilter({ ...filter, maMon: val })}
					>
						{monHocList.map((m) => (
							<Option key={m.maMon} value={m.maMon}>
								{m.maMon} - {m.tenMon}
							</Option>
						))}
					</Select>
					<Select
						placeholder='Lọc theo Mức độ'
						allowClear
						style={{ width: 160 }}
						onChange={(val) => setFilter({ ...filter, mucDo: val })}
					>
						{Object.values(MucDo).map((md) => (
							<Option key={md} value={md}>
								{md}
							</Option>
						))}
					</Select>
					<Select
						placeholder='Lọc theo Khối KT'
						allowClear
						style={{ width: 200 }}
						onChange={(val) => setFilter({ ...filter, khoiId: val })}
					>
						{khoiList.map((k) => (
							<Option key={k.id} value={k.id}>
								{k.ten}
							</Option>
						))}
					</Select>
					<Input
						placeholder='Tìm theo từ khóa nội dung...'
						style={{ width: 260 }}
						allowClear
						onChange={(e) => setFilter({ ...filter, tuKhoa: e.target.value })}
						prefix={<SearchOutlined />}
					/>
				</Space>
			</Card>

			<Table
				columns={columns}
				dataSource={filteredData}
				rowKey='maCauHoi'
				pagination={{ pageSize: 10 }}
				locale={{ emptyText: 'Không có câu hỏi nào thỏa mãn điều kiện tìm kiếm.' }}
				size='middle'
				bordered
			/>
			<Form />
		</Card>
	);
};

export default CauHoiPage;
