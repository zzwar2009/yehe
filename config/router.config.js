import yehe from './yehe.router';

const isRelease = false;
const routers = isRelease
    ? [...yehe]
    : [...yehe];

export default [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: routers,
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ]
