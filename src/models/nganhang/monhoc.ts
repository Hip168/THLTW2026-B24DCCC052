import { useState } from 'react';

export interface MonHoc {
	maMon: string;
	tenMon: string;
	soTinChi: number;
}

export default () => {
	const [data, setData] = useState<MonHoc[]>([]);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [record, setRecord] = useState<MonHoc | undefined>(undefined);
	const [isEdit, setIsEdit] = useState<boolean>(false);

	const them = (values: MonHoc) => {
		setData((prev) => [...prev, values]);
		setVisibleForm(false);
	};

	const sua = (maMon: string, values: MonHoc) => {
		setData((prev) => prev.map((item) => (item.maMon === maMon ? { ...values } : item)));
		setVisibleForm(false);
	};

	const xoa = (maMon: string) => {
		setData((prev) => prev.filter((item) => item.maMon !== maMon));
	};

	const handleEdit = (item: MonHoc) => {
		setRecord(item);
		setIsEdit(true);
		setVisibleForm(true);
	};

	const handleCreate = () => {
		setRecord(undefined);
		setIsEdit(false);
		setVisibleForm(true);
	};

	return {
		data,
		visibleForm,
		setVisibleForm,
		record,
		isEdit,
		them,
		sua,
		xoa,
		handleEdit,
		handleCreate,
	};
};
