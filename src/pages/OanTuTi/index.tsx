import { Button, Card, Col, Popconfirm, Row, Statistic, Table, Tag, Typography } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import type { GameRecord } from '@/models/oantuti';

const { Title } = Typography;

const CHOICE_ICON: Record<string, string> = {
	Kéo: '✌️',
	Búa: '✊',
	Bao: '✋',
};

const RESULT_COLOR: Record<string, string> = {
	Thắng: 'success',
	Thua: 'error',
	Hòa: 'warning',
};

const OanTuTi: React.FC = () => {
	const { history, lastRecord, play, clearHistory, stats } = useModel('oantuti');

	const columns = [
		{
			title: 'Lượt',
			render: (_: any, __: any, index: number) => stats.total - index,
			width: 70,
			align: 'center' as const,
		},
		{
			title: 'Người chơi',
			dataIndex: 'playerChoice',
			render: (val: string) => `${CHOICE_ICON[val]} ${val}`,
			align: 'center' as const,
		},
		{
			title: 'Máy tính',
			dataIndex: 'computerChoice',
			render: (val: string) => `${CHOICE_ICON[val]} ${val}`,
			align: 'center' as const,
		},
		{
			title: 'Kết quả',
			dataIndex: 'result',
			align: 'center' as const,
			render: (val: string) => <Tag color={RESULT_COLOR[val]}>{val}</Tag>,
		},
		{
			title: 'Thời gian',
			dataIndex: 'playedAt',
			align: 'center' as const,
			render: (val: string) => moment(val).format('HH:mm:ss DD/MM/YYYY'),
		},
	];

	return (
		<div style={{ padding: '0 8px' }}>
			<Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
				✊✌️✋ Oẳn Tù Tì
			</Title>


			<Row gutter={[16, 16]}>
				<Col xs={12} sm={6}>
					<Card>
						<Statistic title='Tổng ván' value={stats.total} />
					</Card>
				</Col>
				<Col xs={12} sm={6}>
					<Card>
						<Statistic title='Thắng' value={stats.wins} valueStyle={{ color: '#52c41a' }} />
					</Card>
				</Col>
				<Col xs={12} sm={6}>
					<Card>
						<Statistic title='Thua' value={stats.losses} valueStyle={{ color: '#ff4d4f' }} />
					</Card>
				</Col>
				<Col xs={12} sm={6}>
					<Card>
						<Statistic title='Hòa' value={stats.draws} valueStyle={{ color: '#faad14' }} />
					</Card>
				</Col>
			</Row>


			<Card style={{ marginBottom: 24, textAlign: 'center' }}>
				<Title level={5} style={{ marginBottom: 16 }}>
					Chọn lựa của bạn:
				</Title>
				<Row justify='center' gutter={[16, 16]}>
					{(['Kéo', 'Búa', 'Bao'] as const).map((choice) => (
						<Col key={choice}>
							<Button
								type='primary'
								size='large'
								onClick={() => play(choice)}
								style={{ width: 120, height: 80, fontSize: 28, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
							>
								<span style={{ fontSize: 32 }}>{CHOICE_ICON[choice]}</span>
								<span style={{ fontSize: 14, marginTop: 4 }}>{choice}</span>
							</Button>
						</Col>
					))}
				</Row>


				{lastRecord && (
					<Card
						style={{ marginTop: 20, background: '#fafafa', border: '1px dashed #d9d9d9' }}
						bodyStyle={{ padding: '12px 24px' }}
					>
						<Row justify='center' align='middle' gutter={24}>
							<Col>
								<div style={{ fontSize: 48 }}>{CHOICE_ICON[lastRecord.playerChoice]}</div>
								<div style={{ textAlign: 'center' }}>Bạn: {lastRecord.playerChoice}</div>
							</Col>
							<Col>
								<div style={{ fontSize: 32, fontWeight: 'bold' }}>VS</div>
							</Col>
							<Col>
								<div style={{ fontSize: 48 }}>{CHOICE_ICON[lastRecord.computerChoice]}</div>
								<div style={{ textAlign: 'center' }}>Máy: {lastRecord.computerChoice}</div>
							</Col>
							<Col>
								<Tag
									color={RESULT_COLOR[lastRecord.result]}
									style={{ fontSize: 22, padding: '8px 20px', borderRadius: 8 }}
								>
									{lastRecord.result}!
								</Tag>
							</Col>
						</Row>
					</Card>
				)}
			</Card>


			<Card
				title={`📋 Lịch sử ván đấu (${stats.total} ván)`}
				extra={
					history.length > 0 && (
						<Popconfirm
							title='Bạn có chắc muốn xóa toàn bộ lịch sử?'
							onConfirm={clearHistory}
							okText='Xóa'
							cancelText='Hủy'
						>
							<Button danger size='small'>
								Xóa lịch sử
							</Button>
						</Popconfirm>
					)
				}
			>
				<Table<GameRecord>
					columns={columns}
					dataSource={history}
					rowKey={(r) => r.playedAt}
					pagination={{ pageSize: 10, showSizeChanger: false }}
					locale={{ emptyText: 'Chưa có ván đấu nào. Hãy bắt đầu chơi!' }}
					size='small'
				/>
			</Card>
		</div>
	);
};

export default OanTuTi;
