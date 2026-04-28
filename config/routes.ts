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
		component: './Dashboard',
		icon: 'HomeOutlined',
	},
	{
		path: '/workout-log',
		name: 'Nhật ký tập luyện',
		component: './WorkoutLog',
		icon: 'CalendarOutlined',
	},
	{
		path: '/health-metrics',
		name: 'Chỉ số sức khỏe',
		component: './HealthMetrics',
		icon: 'HeartOutlined',
	},
	{
		path: '/goals',
		name: 'Quản lý mục tiêu',
		component: './Goals',
		icon: 'FlagOutlined',
	},
	{
		path: '/exercise-library',
		name: 'Thư viện bài tập',
		component: './ExerciseLibrary',
		icon: 'BookOutlined',
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
