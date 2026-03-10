import {
	Button,
	Card,
	Col,
	notification,
	Popconfirm,
	Row,
	Space,
	Table,
	Tabs,
	Tag,
	Typography,
} from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
	EyeOutlined,
	PlusOutlined,
	ThunderboltOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import { useModel } from 'umi';
import type { CauTrucDe, DeThi } from '@/models/nganhang/dethi';
import CauTrucForm from './components/CauTrucForm';
import DetailModal from './components/DetailModal';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const DeThiPage: React.FC = () => {
	const {
		cauTrucList,
		deThiList,
		handleEditCauTruc,
		handleCreateCauTruc,
		xoaCauTruc,
		sinhDeThi,
		xemDeThi,
		xoaDeThi,
	} = useModel('nganhang.dethi');
	const { data: cauHoiData } = useModel('nganhang.cauhoi');

	const handleSinhDe = (cauTruc: CauTrucDe) => {
		const result = sinhDeThi(cauTruc, cauHoiData);
		if (result.ok) {
			notification.success({
				message: 'Sinh đề thành công!',
				description: `Đề thi "${cauTruc.tenCauTruc}" đã được tạo với ${result.deThi.danhSachCauHoi.length} câu hỏi.`,
			});
		} else {
			const errorLines = result.errors.map(
				(e) => `• Mức "${e.mucDo}": yêu cầu ${e.yeuCau} câu, ngân hàng chỉ có ${e.coSan} câu`,
			);
			notification.error({
				message: 'Không đủ câu hỏi để sinh đề!',
				description: (
					<div>
						{errorLines.map((line, i) => (
							<div key={i}>{line}</div>
						))}
					</div>
				),
				duration: 8,
			});
		}
	};

	const cauTrucColumns = [
		{
			title: 'STT',
			render: (_: any, __: any, index: number) => index + 1,
			width: 55,
			align: 'center' as const,
		},
		{ title: 'Tên cấu trúc', dataIndex: 'tenCauTruc' },
		{ title: 'Môn học', dataIndex: ['monHoc', 'tenMon'], width: 200 },
		{
			title: 'Tổng câu',
			width: 100,
			align: 'center' as const,
			render: (record: CauTrucDe) => {
				const total = Object.values(record.soLuongTheoMucDo).reduce((a, b) => a + b, 0);
				return <Tag color='blue'>{total}</Tag>;
			},
		},
		{
			title: 'Thao tác',
			width: 170,
			align: 'center' as const,
			render: (record: CauTrucDe) => (
				<Space>
					<Button
						type='primary'
						size='small'
						icon={<ThunderboltOutlined />}
						onClick={() => handleSinhDe(record)}
					>
						Sinh đề
					</Button>
					<Button type='link' icon={<EditOutlined />} onClick={() => handleEditCauTruc(record)} />
					<Popconfirm
						title='Xóa cấu trúc đề này?'
						onConfirm={() => xoaCauTruc(record.id)}
						okText='Xóa'
						cancelText='Hủy'
					>
						<Button danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			),
		},
	];

	const deThiColumns = [
		{
			title: 'STT',
			render: (_: any, __: any, index: number) => index + 1,
			width: 55,
			align: 'center' as const,
		},
		{ title: 'Cấu trúc đề', dataIndex: ['cauTruc', 'tenCauTruc'] },
		{ title: 'Môn học', dataIndex: ['cauTruc', 'monHoc', 'tenMon'], width: 180 },
		{
			title: 'Số câu',
			width: 90,
			align: 'center' as const,
			render: (record: DeThi) => <Tag color='green'>{record.danhSachCauHoi.length}</Tag>,
		},
		{
			title: 'Ngày tạo',
			dataIndex: 'ngayTao',
			width: 160,
			render: (val: string) => moment(val).format('HH:mm DD/MM/YYYY'),
		},
		{
			title: 'Thao tác',
			width: 110,
			align: 'center' as const,
			render: (record: DeThi) => (
				<Space>
					<Button type='link' icon={<EyeOutlined />} onClick={() => xemDeThi(record)} title='Xem đề' />
					<Popconfirm
						title='Xóa đề thi này?'
						onConfirm={() => xoaDeThi(record.id)}
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
			<Title level={4} style={{ marginBottom: 16 }}>
				📝 Quản lý Đề thi
			</Title>
			<Tabs defaultActiveKey='cauTruc'>
				<TabPane tab={`🗂 Cấu trúc đề (${cauTrucList.length})`} key='cauTruc'>
					<div style={{ marginBottom: 12 }}>
						<Button type='primary' icon={<PlusOutlined />} onClick={handleCreateCauTruc}>
							Thêm cấu trúc đề
						</Button>
					</div>
					<Table
						columns={cauTrucColumns}
						dataSource={cauTrucList}
						rowKey='id'
						pagination={{ pageSize: 10 }}
						locale={{
							emptyText: 'Chưa có cấu trúc đề nào. Hãy tạo cấu trúc trước khi sinh đề.',
						}}
						size='middle'
						bordered
						expandable={{
							expandedRowRender: (record: CauTrucDe) => (
								<Row gutter={[8, 8]} style={{ padding: '8px 0' }}>
									{Object.entries(record.soLuongTheoMucDo).map(([md, count]) => (
										<Col key={md}>
											<Tag>
												{md}: <Text strong>{count}</Text> câu
											</Tag>
										</Col>
									))}
								</Row>
							),
						}}
					/>
				</TabPane>
				<TabPane tab={`📋 Đề thi đã tạo (${deThiList.length})`} key='deThi'>
					<Table
						columns={deThiColumns}
						dataSource={deThiList}
						rowKey='id'
						pagination={{ pageSize: 10 }}
						locale={{
							emptyText: 'Chưa có đề thi nào. Hãy chọn cấu trúc và nhấn "Sinh đề".',
						}}
						size='middle'
						bordered
					/>
				</TabPane>
			</Tabs>
			<CauTrucForm />
			<DetailModal />
		</Card>
	);
};

export default DeThiPage;
