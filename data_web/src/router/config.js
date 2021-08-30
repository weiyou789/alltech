const config = [
    /*{
        path: '/getData',
        exact: true,
        meta: {
            title: 'mongo数据获取'
        },
        component: () => import('../views/getData')
    },*/
    {
        path: '/dfxData',
        exact: true,
        meta: {
            title: '单分享数据服务平台'
        },
        component: () => import('../views/dfxData')
    },
    {
        path: '/',
        exact: true,
        meta: {
            title: '登录'
        },
        component: () => import('../views/login')
    }
];

export default config;
