import { Button, Form, Input, InputNumber, Modal } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const FormMonHoc: React.FC = () => {
	const [form] = Form.useForm();
	const { record, isEdit, them, sua, visibleForm, setVisibleForm } = useModel('nganhang.monhoc');

	useEffect(() => {
		if (!visibleForm) {
			form.resetFields();
		} else if (isEdit && record) {
			form.setFieldsValue(record);
		}
	}, [visibleForm, record, isEdit]);

	const onFinish = (values: any) => {
		if (isEdit && record) {
			sua(record.maMon, values);
		} else {
			them(values);
		}
	};

	return (
		<Modal
			title={isEdit ? 'Chỉnh sửa Môn học' : 'Thêm mới Môn học'}
			visible={visibleForm}
			onCancel={() => setVisibleForm(false)}
			footer={null}
			destroyOnClose
		>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item
					name='maMon'
					label='Mã môn'
					rules={[{ required: true, message: 'Vui lòng nhập mã môn!' }]}
				>
					<Input placeholder='VD: CNTT101' disabled={isEdit} />
				</Form.Item>
				<Form.Item
					name='tenMon'
					label='Tên môn học'
					rules={[{ required: true, message: 'Vui lòng nhập tên môn học!' }]}
				>
					<Input placeholder='VD: Lập trình Web' />
				</Form.Item>
				<Form.Item
					name='soTinChi'
					label='Số tín chỉ'
					rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ!' }]}
				>
					<InputNumber min={1} max={10} style={{ width: '100%' }} />
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

export default FormMonHoc;
