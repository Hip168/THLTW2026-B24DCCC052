
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        component: './user/Login',
      },
    ],
  },
  {
    path: '/dashboard',
    name: 'Tổng quan',
    icon: 'DashboardOutlined',
    component: './Dashboard',
  },
  {
    path: '/products',
    name: 'Quản lý sản phẩm',
    icon: 'QrcodeOutlined',
    component: './Products',
  },
  {
    path: '/orders',
    name: 'Quản lý đơn hàng',
    icon: 'SolutionOutlined',
    component: './Orders',
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    component: './exception/404',
  },
];
