import { useState } from 'react';
import type { MonHoc } from './monhoc';
import type { KhoiKienThuc } from './khoikienthuc';

const genId = () => Math.random().toString(36).slice(2, 10).toUpperCase();

export enum MucDo {
	De = 'Dễ',
	TrungBinh = 'Trung bình',
	Kho = 'Khó',
	RatKho = 'Rất khó',
}

export interface CauHoi {
	maCauHoi: string;
	monHoc: MonHoc;
	noiDung: string;
	mucDo: MucDo;
	khoiKienThuc: KhoiKienThuc;
}

export interface SearchFilter {
	maMon?: string;
	mucDo?: MucDo;
	khoiId?: string;
	tuKhoa?: string;
}

export default () => {
	const [data, setData] = useState<CauHoi[]>([]);
	const [visibleForm, setVisibleForm] = useState<boolean>(false);
	const [record, setRecord] = useState<CauHoi | undefined>(undefined);
	const [isEdit, setIsEdit] = useState<boolean>(false);
	const [filter, setFilter] = useState<SearchFilter>({});

	const them = (values: Omit<CauHoi, 'maCauHoi'>) => {
		const newItem: CauHoi = { maCauHoi: genId(), ...values };

		setData((prev) => [...prev, newItem]);
		setVisibleForm(false);
	};

	const sua = (maCauHoi: string, values: Omit<CauHoi, 'maCauHoi'>) => {
		setData((prev) =>
			prev.map((item) => (item.maCauHoi === maCauHoi ? { maCauHoi, ...values } : item)),
		);
		setVisibleForm(false);
	};

	const xoa = (maCauHoi: string) => {
		setData((prev) => prev.filter((item) => item.maCauHoi !== maCauHoi));
	};

	const handleEdit = (item: CauHoi) => {
		setRecord(item);
		setIsEdit(true);
		setVisibleForm(true);
	};

	const handleCreate = () => {
		setRecord(undefined);
		setIsEdit(false);
		setVisibleForm(true);
	};

	const filteredData = data.filter((item) => {
		if (filter.maMon && item.monHoc.maMon !== filter.maMon) return false;
		if (filter.mucDo && item.mucDo !== filter.mucDo) return false;
		if (filter.khoiId && item.khoiKienThuc.id !== filter.khoiId) return false;
		if (
			filter.tuKhoa &&
			!item.noiDung.toLowerCase().includes(filter.tuKhoa.toLowerCase())
		)
			return false;
		return true;
	});

	return {
		data,
		filteredData,
		filter,
		setFilter,
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
