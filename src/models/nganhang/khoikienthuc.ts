import { useState } from 'react';

const genId = () => Math.random().toString(36).slice(2, 10).toUpperCase();

export interface KhoiKienThuc {
	id: string;
	ten: string;
}

export default () => {
	const [data, setData] = useState<KhoiKienThuc[]>([]);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [record, setRecord] = useState<KhoiKienThuc | undefined>(undefined);
	const [isEdit, setIsEdit] = useState<boolean>(false);

	const them = (values: Omit<KhoiKienThuc, 'id'>) => {
		const newItem: KhoiKienThuc = { id: genId(), ...values };
		setData((prev) => [...prev, newItem]);
		setVisibleForm(false);
	};

	const sua = (id: string, values: Omit<KhoiKienThuc, 'id'>) => {
		setData((prev) => prev.map((item) => (item.id === id ? { ...item, ...values } : item)));
		setVisibleForm(false);
	};

	const xoa = (id: string) => {
		setData((prev) => prev.filter((item) => item.id !== id));
	};

	const handleEdit = (item: KhoiKienThuc) => {
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
