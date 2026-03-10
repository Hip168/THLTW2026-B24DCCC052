import { Badge, Descriptions, Modal, Table, Tag, Typography } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import type { CauHoi } from '@/models/nganhang/cauhoi';
import { MucDo } from '@/models/nganhang/cauhoi';

const { Title, Text } = Typography;

const MUC_DO_COLOR: Record<MucDo, string> = {
	[MucDo.De]: 'green',
	[MucDo.TrungBinh]: 'blue',
	[MucDo.Kho]: 'orange',
	[MucDo.RatKho]: 'red',
};

const DetailModal: React.FC = () => {
	const { selectedDeThi, visibleDeThiDetail, setVisibleDeThiDetail } = useModel('nganhang.dethi');

	const columns = [
		{
			title: 'STT',
			render: (_: any, __: any, index: number) => index + 1,
			width: 55,
			align: 'center' as const,
		},
		{ title: 'Mã CH', dataIndex: 'maCauHoi', width: 100 },
		{ title: 'Nội dung', dataIndex: 'noiDung', ellipsis: true },
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
			width: 130,
		},
	];

	if (!selectedDeThi) return null;

	const { cauTruc, danhSachCauHoi, ngayTao } = selectedDeThi;

	return (
		<Modal
			title={<Title level={5}>📄 Chi tiết Đề thi — {cauTruc.tenCauTruc}</Title>}
			visible={visibleDeThiDetail}
			onCancel={() => setVisibleDeThiDetail(false)}
			footer={null}
			width={860}
			destroyOnClose
		>
			<Descriptions bordered size='small' column={2} style={{ marginBottom: 16 }}>
				<Descriptions.Item label='Tên cấu trúc'>{cauTruc.tenCauTruc}</Descriptions.Item>
				<Descriptions.Item label='Môn học'>
					{cauTruc.monHoc.maMon} — {cauTruc.monHoc.tenMon}
				</Descriptions.Item>
				<Descriptions.Item label='Ngày tạo'>
					{moment(ngayTao).format('HH:mm DD/MM/YYYY')}
				</Descriptions.Item>
				<Descriptions.Item label='Tổng số câu'>
					<Badge count={danhSachCauHoi.length} showZero color='blue' />
				</Descriptions.Item>
				{Object.values(MucDo).map((md) => (
					<Descriptions.Item key={md} label={`Câu mức "${md}"`}>
						<Text strong>{cauTruc.soLuongTheoMucDo[md]}</Text> yêu cầu /{' '}
						<Text type='success'>
							{danhSachCauHoi.filter((c: CauHoi) => c.mucDo === md).length}
						</Text>{' '}
						trong đề
					</Descriptions.Item>
				))}
			</Descriptions>

			<Table<CauHoi>
				columns={columns}
				dataSource={danhSachCauHoi}
				rowKey='maCauHoi'
				size='small'
				pagination={false}
				bordered
				scroll={{ y: 400 }}
			/>
		</Modal>
	);
};

export default DetailModal;
