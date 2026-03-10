import { Button, Form, Input, Modal, Select } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import { MucDo } from '@/models/nganhang/cauhoi';

const { TextArea } = Input;
const { Option } = Select;

const FormCauHoi: React.FC = () => {
	const [form] = Form.useForm();
	const { record, isEdit, them, sua, visibleForm, setVisibleForm } = useModel('nganhang.cauhoi');
	const { data: monHocList } = useModel('nganhang.monhoc');
	const { data: khoiList } = useModel('nganhang.khoikienthuc');

	useEffect(() => {
		if (!visibleForm) {
			form.resetFields();
		} else if (isEdit && record) {
			form.setFieldsValue({
				...record,
				monHoc: record.monHoc.maMon,
				khoiKienThuc: record.khoiKienThuc.id,
			});
		}
	}, [visibleForm, record, isEdit]);

	const onFinish = (values: any) => {
		const monHocObj = monHocList.find((m) => m.maMon === values.monHoc)!;
		const khoiObj = khoiList.find((k) => k.id === values.khoiKienThuc)!;
		const payload = { ...values, monHoc: monHocObj, khoiKienThuc: khoiObj };

		if (isEdit && record) {
			sua(record.maCauHoi, payload);
		} else {
			them(payload);
		}
	};

	return (
		<Modal
			title={isEdit ? 'Chỉnh sửa Câu hỏi' : 'Thêm mới Câu hỏi'}
			visible={visibleForm}
			onCancel={() => setVisibleForm(false)}
			footer={null}
			destroyOnClose
			width={640}
		>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item
					name='monHoc'
					label='Môn học'
					rules={[{ required: true, message: 'Vui lòng chọn môn học!' }]}
				>
					<Select placeholder='Chọn môn học'>
						{monHocList.map((m) => (
							<Option key={m.maMon} value={m.maMon}>
								{m.maMon} - {m.tenMon}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					name='khoiKienThuc'
					label='Khối kiến thức'
					rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức!' }]}
				>
					<Select placeholder='Chọn khối kiến thức'>
						{khoiList.map((k) => (
							<Option key={k.id} value={k.id}>
								{k.ten}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					name='mucDo'
					label='Mức độ khó'
					rules={[{ required: true, message: 'Vui lòng chọn mức độ!' }]}
				>
					<Select placeholder='Chọn mức độ'>
						{Object.values(MucDo).map((md) => (
							<Option key={md} value={md}>
								{md}
							</Option>
						))}
					</Select>
				</Form.Item>
				<Form.Item
					name='noiDung'
					label='Nội dung câu hỏi'
					rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi!' }]}
				>
					<TextArea rows={4} placeholder='Nhập nội dung câu hỏi...' />
				</Form.Item>
				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						{isEdit ? 'Lưu lại' : 'Thêm mới'}
					</Button>
					<Button onClick={() => setVisibleForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default FormCauHoi;
