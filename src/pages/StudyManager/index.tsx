import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs, Table, Button, Modal, Form, Input, InputNumber, DatePicker, Select, Space, Tag, Popconfirm, message } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';

const { TabPane } = Tabs;
const { Option } = Select;

// Types
interface Subject {
	id: string;
	name: string;
	targetHours: number;
}

interface Schedule {
	id: string;
	subjectId: string;
	date: string;
	duration: number; // in hours
	content: string;
	note?: string;
}

const STORAGE_KEY = 'study_manager_data';

const initialSubjects: Subject[] = [
	{ id: '1', name: 'Toán', targetHours: 20 },
	{ id: '2', name: 'Văn', targetHours: 15 },
	{ id: '3', name: 'Anh', targetHours: 25 },
];

const StudyManager: React.FC = () => {
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [schedules, setSchedules] = useState<Schedule[]>([]);
	
	// Modals State
	const [isSubjectModalVisible, setIsSubjectModalVisible] = useState(false);
	const [isScheduleModalVisible, setIsScheduleModalVisible] = useState(false);
	
	const [subjectForm] = Form.useForm();
	const [scheduleForm] = Form.useForm();
	
	const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
	const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

	// Load Data
	useEffect(() => {
		const storedData = localStorage.getItem(STORAGE_KEY);
		if (storedData) {
			try {
				const { subjects: s, schedules: sch } = JSON.parse(storedData);
				setSubjects(s || []);
				setSchedules(sch || []);
			} catch (e) {
				console.error("Failed to parse localstorage", e);
				setSubjects(initialSubjects);
				setSchedules([]);
			}
		} else {
			setSubjects(initialSubjects);
		}
	}, []);

	// Save Data
	useEffect(() => {
		if (subjects.length > 0 || schedules.length > 0) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify({ subjects, schedules }));
		}
	}, [subjects, schedules]);

	// Format helpers
	const getSubjectTotalHours = (subjectId: string) => {
		const currentMonth = moment().month();
		const currentYear = moment().year();
		
		return schedules
			.filter(sch => {
				const schDate = moment(sch.date);
				return sch.subjectId === subjectId && schDate.month() === currentMonth && schDate.year() === currentYear;
			})
			.reduce((total, sch) => total + sch.duration, 0);
	};

	// Handlers for Subjects
	const handleOpenSubjectModal = (record?: Subject) => {
		setEditingSubject(record || null);
		if (record) {
			subjectForm.setFieldsValue(record);
		} else {
			subjectForm.resetFields();
		}
		setIsSubjectModalVisible(true);
	};

	const handleDeleteSubject = (id: string) => {
		setSubjects(subjects.filter(s => s.id !== id));
		setSchedules(schedules.filter(sch => sch.subjectId !== id)); // Delete cascading schedules
		message.success('Đã xoá danh mục môn học');
	};

	const handleSaveSubject = () => {
		subjectForm.validateFields().then(values => {
			if (editingSubject) {
				setSubjects(subjects.map(s => s.id === editingSubject.id ? { ...s, ...values } : s));
				message.success('Cập nhật thành công');
			} else {
				const newSubject = { ...values, id: Date.now().toString() };
				setSubjects([...subjects, newSubject]);
				message.success('Thêm mới thành công');
			}
			setIsSubjectModalVisible(false);
		});
	};

	// Handlers for Schedules
	const handleOpenScheduleModal = (record?: Schedule) => {
		setEditingSchedule(record || null);
		if (record) {
			scheduleForm.setFieldsValue({
				...record,
				date: moment(record.date),
			});
		} else {
			scheduleForm.resetFields();
			if (subjects.length > 0) {
				scheduleForm.setFieldsValue({ subjectId: subjects[0].id, date: moment() });
			}
		}
		setIsScheduleModalVisible(true);
	};

	const handleDeleteSchedule = (id: string) => {
		setSchedules(schedules.filter(s => s.id !== id));
		message.success('Đã xoá tiến độ học tập');
	};

	const handleSaveSchedule = () => {
		scheduleForm.validateFields().then(values => {
			const formattedValues = {
				...values,
				date: values.date.toISOString(),
			};
			if (editingSchedule) {
				setSchedules(schedules.map(s => s.id === editingSchedule.id ? { ...s, ...formattedValues } : s));
				message.success('Cập nhật tiến độ thành công');
			} else {
				const newSchedule = { ...formattedValues, id: Date.now().toString() };
				setSchedules([...schedules, newSchedule]);
				message.success('Thêm tiến độ thành công');
			}
			setIsScheduleModalVisible(false);
		});
	};

	// Tables Config
	const subjectColumns = [
		{ title: 'Tên Môn Học', dataIndex: 'name', key: 'name' },
		{ title: 'Mục Tiêu (Giờ/Tháng)', dataIndex: 'targetHours', key: 'targetHours' },
		{
			title: 'Đã Học (Tháng Này)',
			key: 'currentHours',
			render: (_: any, record: Subject) => `${getSubjectTotalHours(record.id)} giờ`
		},
		{
			title: 'Trạng Thái Mục Tiêu',
			key: 'status',
			render: (_: any, record: Subject) => {
				const current = getSubjectTotalHours(record.id);
				const isAchieved = current >= record.targetHours;
				return (
					<Tag color={isAchieved ? 'green' : 'orange'}>
						{isAchieved ? 'Đạt Mục Tiêu' : 'Chưa Đạt'}
					</Tag>
				);
			}
		},
		{
			title: 'Thao Tác',
			key: 'action',
			render: (_: any, record: Subject) => (
				<Space>
					<Button type="link" icon={<EditOutlined />} onClick={() => handleOpenSubjectModal(record)} />
					<Popconfirm title="Xoá danh mục?" onConfirm={() => handleDeleteSubject(record.id)} okText="Có" cancelText="Không">
						<Button type="link" danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			)
		}
	];

	const scheduleColumns = [
		{
			title: 'Môn Học',
			dataIndex: 'subjectId',
			key: 'subjectId',
			render: (val: string) => subjects.find(s => s.id === val)?.name || 'Không rõ'
		},
		{
			title: 'Thời Gian',
			dataIndex: 'date',
			key: 'date',
			render: (val: string) => moment(val).format('YYYY-MM-DD HH:mm')
		},
		{
			title: 'Thời Lượng (Giờ)',
			dataIndex: 'duration',
			key: 'duration'
		},
		{ title: 'Nội Dung', dataIndex: 'content', key: 'content' },
		{ title: 'Ghi Chú', dataIndex: 'note', key: 'note' },
		{
			title: 'Thao Tác',
			key: 'action',
			render: (_: any, record: Schedule) => (
				<Space>
					<Button type="link" icon={<EditOutlined />} onClick={() => handleOpenScheduleModal(record)} />
					<Popconfirm title="Xoá tiến độ này?" onConfirm={() => handleDeleteSchedule(record.id)} okText="Có" cancelText="Không">
						<Button type="link" danger icon={<DeleteOutlined />} />
					</Popconfirm>
				</Space>
			)
		}
	];

	return (
		<PageContainer title={false}>
			<Card style={{ borderRadius: 12 }}>
				<Tabs defaultActiveKey="1">
					<TabPane tab="Quản Lý Danh Mục & Mục Tiêu" key="1">
						<div style={{ marginBottom: 16 }}>
							<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenSubjectModal()}>
								Thêm Môn Học
							</Button>
						</div>
						<Table columns={subjectColumns} dataSource={subjects} rowKey="id" pagination={false} bordered />
					</TabPane>
					<TabPane tab="Quản Lý Tiến Độ Học Tập" key="2">
						<div style={{ marginBottom: 16 }}>
							<Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenScheduleModal()} disabled={subjects.length === 0}>
								Thêm Tiến Độ Học Tập
							</Button>
							{subjects.length === 0 && <span style={{ marginLeft: 12, color: 'red' }}>Hãy thêm môn học trước khi thêm tiến độ</span>}
						</div>
						<Table columns={scheduleColumns} dataSource={schedules} rowKey="id" bordered />
					</TabPane>
				</Tabs>
			</Card>

			{/* Modal Môn Học */}
			<Modal
				title={editingSubject ? 'Cập Nhật Môn Học' : 'Thêm Môn Học Mới'}
				visible={isSubjectModalVisible}
				onOk={handleSaveSubject}
				onCancel={() => setIsSubjectModalVisible(false)}
				okText="Lưu"
				cancelText="Huỷ"
			>
				<Form form={subjectForm} layout="vertical">
					<Form.Item name="name" label="Tên Môn Học" rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}>
						<Input placeholder="Ví dụ: Toán, Văn, Anh..." />
					</Form.Item>
					<Form.Item name="targetHours" label="Mục Tiêu Tháng (Giờ)" rules={[{ required: true, message: 'Vui lòng nhập mục tiêu!' }]}>
						<InputNumber min={1} max={500} style={{ width: '100%' }} />
					</Form.Item>
				</Form>
			</Modal>

			{/* Modal Tiến Độ */}
			<Modal
				title={editingSchedule ? 'Cập Nhật Tiến Độ' : 'Thêm Tiến Độ Học Tập'}
				visible={isScheduleModalVisible}
				onOk={handleSaveSchedule}
				onCancel={() => setIsScheduleModalVisible(false)}
				okText="Lưu"
				cancelText="Huỷ"
			>
				<Form form={scheduleForm} layout="vertical">
					<Form.Item name="subjectId" label="Môn Học" rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}>
						<Select placeholder="Chọn môn học">
							{subjects.map(s => (
								<Option key={s.id} value={s.id}>{s.name}</Option>
							))}
						</Select>
					</Form.Item>
					<Form.Item name="date" label="Ngày Giờ Học" rules={[{ required: true, message: 'Vui lòng chọn ngày giờ!' }]}>
						<DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name="duration" label="Thời Lượng Học (Giờ)" rules={[{ required: true, message: 'Vui lòng nhập số giờ!' }]}>
						<InputNumber min={0.5} step={0.5} max={24} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name="content" label="Nội Dung Đã Học" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
						<Input.TextArea rows={3} placeholder="Ví dụ: Ôn tập chương 1..." />
					</Form.Item>
					<Form.Item name="note" label="Ghi Chú (Tuỳ Chọn)">
						<Input.TextArea rows={2} placeholder="Những thắc mắc, nháp..." />
					</Form.Item>
				</Form>
			</Modal>
		</PageContainer>
	);
};

export default StudyManager;
