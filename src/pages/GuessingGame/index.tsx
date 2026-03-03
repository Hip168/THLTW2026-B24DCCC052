import React, { useState, useEffect } from 'react';
import { Card, InputNumber, Button, Typography, Space, Alert, Statistic, Row, Col, Tag } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { SyncOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const GuessingGame: React.FC = () => {
	const MAX_ATTEMPTS = 10;
	const MIN_NUMBER = 1;
	const MAX_NUMBER = 100;

	const [targetNumber, setTargetNumber] = useState(0);
	const [attempts, setAttempts] = useState(MAX_ATTEMPTS);
	const [guess, setGuess] = useState<number | null>(null);
	const [message, setMessage] = useState('');
	const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');
	const [historyList, setHistoryList] = useState<{ value: number; result: string }[]>([]);

	const initGame = () => {
		setTargetNumber(Math.floor(Math.random() * (MAX_NUMBER - MIN_NUMBER + 1)) + MIN_NUMBER);
		setAttempts(MAX_ATTEMPTS);
		setGuess(null);
		setMessage('');
		setStatus('playing');
		setHistoryList([]);
	};

	useEffect(() => {
		initGame();
	}, []);

	const handleGuess = () => {
		if (status !== 'playing') return;
		if (guess === null) {
			setMessage('Vui lòng nhập một số!');
			return;
		}

		let currentResult = '';
		if (guess < targetNumber) {
			currentResult = 'Quá thấp';
			setMessage('Bạn đoán quá thấp!');
		} else if (guess > targetNumber) {
			currentResult = 'Quá cao';
			setMessage('Bạn đoán quá cao!');
		} else {
			currentResult = 'Chính xác';
			setMessage('Chúc mừng! Bạn đã đoán đúng!');
			setHistoryList([{ value: guess, result: currentResult }, ...historyList]);
			setStatus('won');
			return;
		}

		setHistoryList([{ value: guess, result: currentResult }, ...historyList]);
		const remainingAttempts = attempts - 1;
		setAttempts(remainingAttempts);

		if (remainingAttempts === 0 && guess !== targetNumber) {
			setMessage(`Bạn đã hết lượt! Số đúng là ${targetNumber}.`);
			setStatus('lost');
		}

		setGuess(null);
	};

	return (
		<PageContainer title={false}>
			<Row gutter={24} justify="center">
				<Col xs={24} md={12}>
					<Card style={{ textAlign: 'center', borderRadius: 12, height: '100%' }}>
						<Title level={2} style={{ marginBottom: 24 }}>
							Trò chơi Đoán số
						</Title>

						<Text type="secondary" style={{ display: 'block', marginBottom: 24, fontSize: 16 }}>
							Số ngẫu nhiên từ {MIN_NUMBER} đến {MAX_NUMBER}. Bạn có {MAX_ATTEMPTS} lượt.
						</Text>

						{message && (
							<Alert
								message={message}
								type={status === 'won' ? 'success' : status === 'lost' ? 'error' : 'info'}
								showIcon
								style={{ marginBottom: 24, textAlign: 'left', fontWeight: 'bold' }}
							/>
						)}

						<Space direction="vertical" size="large" style={{ width: '100%' }}>
							<Statistic
								title="Lượt còn lại"
								value={attempts}
								valueStyle={{ color: attempts <= 3 ? '#cf1322' : '#3f8600' }}
							/>

							<Space>
								<InputNumber
									min={MIN_NUMBER}
									max={MAX_NUMBER}
									value={guess}
									onChange={(value) => setGuess(value)}
									onPressEnter={handleGuess}
									disabled={status !== 'playing'}
									placeholder="Nhập số"
									style={{ width: 150, height: 40, lineHeight: '40px' }}
									autoFocus
								/>
								<Button
									type="primary"
									onClick={handleGuess}
									disabled={status !== 'playing' || guess === null}
									style={{ height: 40 }}
								>
									Đoán
								</Button>
							</Space>

							{(status === 'won' || status === 'lost') && (
								<Button
									type="primary"
									icon={<SyncOutlined />}
									onClick={initGame}
									size="large"
									style={{ marginTop: 24, borderRadius: 8 }}
								>
									Chơi lại
								</Button>
							)}
						</Space>
					</Card>
				</Col>

				<Col xs={24} md={8}>
					<Card title="Lịch sử dự đoán" style={{ borderRadius: 12, height: '100%' }}>
						<div style={{ maxHeight: 400, overflowY: 'auto' }}>
							{historyList.length === 0 ? (
								<Text type="secondary">Chưa có lượt dự đoán nào.</Text>
							) : (
								historyList.map((item, index) => (
									<div
										key={index}
										style={{
											display: 'flex',
											justifyContent: 'space-between',
											padding: '8px 0',
											borderBottom: '1px solid #f0f0f0',
										}}
									>
										<Text strong>Lượt {historyList.length - index}: {item.value}</Text>
										<Tag color={item.result === 'Quá thấp' ? 'blue' : item.result === 'Quá cao' ? 'red' : 'green'}>
											{item.result}
										</Tag>
									</div>
								))
							)}
						</div>
					</Card>
				</Col>
			</Row>
		</PageContainer>
	);
};

export default GuessingGame;
