import { Button, Divider, Form, Input, InputNumber, Modal, Select, Typography } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import { MucDo } from '@/models/nganhang/cauhoi';
import type { CauTrucDe } from '@/models/nganhang/dethi';

const { Option } = Select;
const { Text } = Typography;

const CauTrucForm: React.FC = () => {
	const [form] = Form.useForm();
	const {
		visibleCauTrucForm,
		setVisibleCauTrucForm,
		selectedCauTruc,
		isEditCauTruc,
		themCauTruc,
		suaCauTruc,
	} = useModel('nganhang.dethi');
	const { data: monHocList } = useModel('nganhang.monhoc');

	useEffect(() => {
		if (!visibleCauTrucForm) {
			form.resetFields();
		} else if (isEditCauTruc && selectedCauTruc) {
			form.setFieldsValue({
				tenCauTruc: selectedCauTruc.tenCauTruc,
				monHoc: selectedCauTruc.monHoc.maMon,
				[MucDo.De]: selectedCauTruc.soLuongTheoMucDo[MucDo.De],
				[MucDo.TrungBinh]: selectedCauTruc.soLuongTheoMucDo[MucDo.TrungBinh],
				[MucDo.Kho]: selectedCauTruc.soLuongTheoMucDo[MucDo.Kho],
				[MucDo.RatKho]: selectedCauTruc.soLuongTheoMucDo[MucDo.RatKho],
			});
		}
	}, [visibleCauTrucForm, selectedCauTruc, isEditCauTruc]);

	const onFinish = (values: any) => {
		const monHocObj = monHocList.find((m) => m.maMon === values.monHoc)!;
		const payload: Omit<CauTrucDe, 'id'> = {
			tenCauTruc: values.tenCauTruc,
			monHoc: monHocObj,
			soLuongTheoMucDo: {
				[MucDo.De]: values[MucDo.De] ?? 0,
				[MucDo.TrungBinh]: values[MucDo.TrungBinh] ?? 0,
				[MucDo.Kho]: values[MucDo.Kho] ?? 0,
				[MucDo.RatKho]: values[MucDo.RatKho] ?? 0,
			},
		};

		if (isEditCauTruc && selectedCauTruc) {
			suaCauTruc(selectedCauTruc.id, payload);
		} else {
			themCauTruc(payload);
		}
	};

	return (
		<Modal
			title={isEditCauTruc ? 'Chỉnh sửa Cấu trúc đề' : 'Thêm mới Cấu trúc đề thi'}
			visible={visibleCauTrucForm}
			onCancel={() => setVisibleCauTrucForm(false)}
			footer={null}
			destroyOnClose
			width={520}
		>
			<Form form={form} layout='vertical' onFinish={onFinish}>
				<Form.Item
					name='tenCauTruc'
					label='Tên cấu trúc đề'
					rules={[{ required: true, message: 'Vui lòng nhập tên cấu trúc!' }]}
				>
					<Input placeholder='VD: Đề cuối kỳ 2024' />
				</Form.Item>
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

				<Divider orientation='left'>
					<Text type='secondary'>Số lượng câu theo mức độ</Text>
				</Divider>

				{Object.values(MucDo).map((md) => (
					<Form.Item key={md} name={md} label={`Mức "${md}"`} initialValue={0}>
						<InputNumber min={0} max={100} style={{ width: '100%' }} />
					</Form.Item>
				))}

				<div className='form-footer'>
					<Button htmlType='submit' type='primary'>
						{isEditCauTruc ? 'Lưu lại' : 'Thêm mới'}
					</Button>
					<Button onClick={() => setVisibleCauTrucForm(false)}>Hủy</Button>
				</div>
			</Form>
		</Modal>
	);
};

export default CauTrucForm;
