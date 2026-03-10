import { Button, Form, Input, Modal } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormKhoiKienThuc: React.FC = () => {
	const [form] = Form.useForm();
	const { record, isEdit, them, sua, visibleForm, setVisibleForm } =
		useModel('nganhang.khoikienthuc');

	useEffect(() => {
		if (!visibleForm) {
			form.resetFields();
		} else if (isEdit && record) {
			form.setFieldsValue(record);
		}
	}, [visibleForm, record, isEdit]);

	const onFinish = (values: { ten: string }) => {
		if (isEdit && record) {
			sua(record.id, values);
		} else {
			them(values);
		}
	};

	return (
		<Modal
			title={isEdit ? 'Chỉnh sửa Khối kiến thức' : 'Thêm mới Khối kiến thức'}
			visible={visibleForm}
			onCancel={() => setVisibleForm(false)}
			footer={null}
			destroyOnClose
		>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item
					name='ten'
					label='Tên khối kiến thức'
					rules={[{ required: true, message: 'Vui lòng nhập tên khối kiến thức!' }]}
				>
					<Input placeholder='VD: Tổng quan, Chuyên sâu...' />
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

export default FormKhoiKienThuc;
