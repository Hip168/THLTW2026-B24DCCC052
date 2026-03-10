import { useState } from 'react';

const genId = () => Math.random().toString(36).slice(2, 10).toUpperCase();
import type { MonHoc } from './monhoc';
import type { CauHoi } from './cauhoi';
import { MucDo } from './cauhoi';

export interface CauTrucDe {
	id: string;
	tenCauTruc: string;
	monHoc: MonHoc;
	soLuongTheoMucDo: Record<MucDo, number>;
}

export interface DeThi {
	id: string;
	cauTruc: CauTrucDe;
	danhSachCauHoi: CauHoi[];
	ngayTao: string;
}

export interface SinhDeError {
	mucDo: MucDo;
	yeuCau: number;
	coSan: number;
}

export default () => {
	const [cauTrucList, setCauTrucList] = useState<CauTrucDe[]>([]);
	const [deThiList, setDeThiList] = useState<DeThi[]>([]);
	const [visibleCauTrucForm, setVisibleCauTrucForm] = useState<boolean>(false);
	const [visibleDeThiDetail, setVisibleDeThiDetail] = useState<boolean>(false);
	const [selectedDeThi, setSelectedDeThi] = useState<DeThi | undefined>(undefined);
	const [selectedCauTruc, setSelectedCauTruc] = useState<CauTrucDe | undefined>(undefined);
	const [isEditCauTruc, setIsEditCauTruc] = useState<boolean>(false);

	const themCauTruc = (values: Omit<CauTrucDe, 'id'>) => {
		const newItem: CauTrucDe = { id: genId(), ...values };
		setCauTrucList((prev) => [...prev, newItem]);
		setVisibleCauTrucForm(false);
	};

	const suaCauTruc = (id: string, values: Omit<CauTrucDe, 'id'>) => {
		setCauTrucList((prev) =>
			prev.map((item) => (item.id === id ? { id, ...values } : item)),
		);
		setVisibleCauTrucForm(false);
	};

	const xoaCauTruc = (id: string) => {
		setCauTrucList((prev) => prev.filter((item) => item.id !== id));
	};

	const handleEditCauTruc = (item: CauTrucDe) => {
		setSelectedCauTruc(item);
		setIsEditCauTruc(true);
		setVisibleCauTrucForm(true);
	};

	const handleCreateCauTruc = () => {
		setSelectedCauTruc(undefined);
		setIsEditCauTruc(false);
		setVisibleCauTrucForm(true);
	};

	const sinhDeThi = (
		cauTruc: CauTrucDe,
		nganhangCauHoi: CauHoi[],
	): { ok: true; deThi: DeThi } | { ok: false; errors: SinhDeError[] } => {
		const allCauHoiCuaMon = nganhangCauHoi.filter(
			(c) => c.monHoc.maMon === cauTruc.monHoc.maMon,
		);

		const errors: SinhDeError[] = [];
		const dacChonList: CauHoi[] = [];

		for (const mucDo of Object.values(MucDo)) {
			const soLuongYeuCau = cauTruc.soLuongTheoMucDo[mucDo] ?? 0;
			if (soLuongYeuCau === 0) continue;

			const pool = allCauHoiCuaMon.filter((c) => c.mucDo === mucDo);
			if (pool.length < soLuongYeuCau) {
				errors.push({ mucDo, yeuCau: soLuongYeuCau, coSan: pool.length });
				continue;
			}


			const shuffled = [...pool].sort(() => Math.random() - 0.5);
			dacChonList.push(...shuffled.slice(0, soLuongYeuCau));
		}

		if (errors.length > 0) {
			return { ok: false, errors };
		}

		const deThi: DeThi = {
			id: genId(),
			cauTruc,
			danhSachCauHoi: dacChonList,
			ngayTao: new Date().toISOString(),
		};

		setDeThiList((prev) => [deThi, ...prev]);
		return { ok: true, deThi };
	};

	const xemDeThi = (deThi: DeThi) => {
		setSelectedDeThi(deThi);
		setVisibleDeThiDetail(true);
	};

	const xoaDeThi = (id: string) => {
		setDeThiList((prev) => prev.filter((item) => item.id !== id));
	};

	return {
		cauTrucList,
		deThiList,
		visibleCauTrucForm,
		setVisibleCauTrucForm,
		visibleDeThiDetail,
		setVisibleDeThiDetail,
		selectedDeThi,
		selectedCauTruc,
		isEditCauTruc,
		themCauTruc,
		suaCauTruc,
		xoaCauTruc,
		handleEditCauTruc,
		handleCreateCauTruc,
		sinhDeThi,
		xemDeThi,
		xoaDeThi,
	};
};
