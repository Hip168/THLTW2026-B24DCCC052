export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},

	{
		path: '/du-lich',
		name: 'Du Lịch',
		icon: 'CompassOutlined',
		routes: [
			{
				path: '/du-lich/kham-pha',
				name: 'Khám Phá',
				component: './DuLich/KhamPha',
			},
			{
				path: '/du-lich/lich-trinh',
				name: 'Lịch Trình',
				component: './DuLich/LichTrinh',
			},
			{
				path: '/du-lich/ngan-sach',
				name: 'Ngân Sách',
				component: './DuLich/NganSach',
			},
		],
	},
	{
		path: '/admin/du-lich',
		name: 'Quản Trị Du Lịch',
		icon: 'SettingOutlined',
		access: 'isAdmin',
		routes: [
			{
				path: '/admin/du-lich/quan-ly',
				name: 'Quản Lý Điểm Đến',
				component: './Admin/DuLich/QuanLyDiemDen',
			},
			{
				path: '/admin/du-lich/thong-ke',
				name: 'Thống Kê',
				component: './Admin/DuLich/ThongKe',
			},
		],
	},

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
