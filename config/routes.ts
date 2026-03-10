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
		path: '/oan-tu-ti',
		name: 'Oẳn Tù Tì',
		icon: 'ThunderboltOutlined',
		component: './OanTuTi',
	},
	{
		name: 'Ngân hàng',
		path: '/ngan-hang',
		icon: 'DatabaseOutlined',
		routes: [
			{
				name: 'Khối kiến thức',
				path: 'khoi-kien-thuc',
				component: './NganHang/KhoiKienThuc',
			},
			{
				name: 'Môn học',
				path: 'mon-hoc',
				component: './NganHang/MonHoc',
			},
			{
				name: 'Câu hỏi',
				path: 'cau-hoi',
				component: './NganHang/CauHoi',
			},
			{
				name: 'Đề thi',
				path: 'de-thi',
				component: './NganHang/DeThi',
			},
		],
	},


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
