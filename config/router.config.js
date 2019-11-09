// import demo from './router/demo.router';
// import oilStation from './router/oilStation.router';
// import addOilPerson from './router/addOilPerson.router';
// import role from './router/role.router';
// import driver from './router/driver.router';
// import transationFlow from './router/transationFlow.router';
// // import userList from './router/userList.router';
import supplier from './router/supplier.router';

const isRelease = false;
const routers = isRelease
    ? [transationFlow]
    : [supplier];

export default [
    // user
    {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
            { path: '/user', redirect: '/user/login' },
            { path: '/user/login', component: './User/Login' },
        ],
    },
    
    // app
    {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        authority: ['admin', 'user'],
        routes: [
            { path: '/', redirect: '/supplier' },
            ...routers,
            {
                path: '/exception/403',
                component: './Exception/403',
            },
            {
                path: '/exception/500',
                component: './Exception/500',
            },
            {
                component: '404',
            },
        ],
    },
];
