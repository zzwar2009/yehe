export default [
      // { path: '/', redirect: '/sysadmin/loginlog' },
      {
        path: '/sysadmin',
        name: 'sysadmin',
        icon: 'smile',
        // redirect: '/sysadmin/loginlog',
        // component: './Welcome',
        routes: [
          { path: '/sysadmin/loginlog', name: 'loginlog', component: './loginlog/index.js' },
        ],
      },
      {
        path: '/proconfig',
        name: 'proconfig',
        icon: 'smile',
        // component: './Welcome',
        routes: [
          { path: '/proconfig/todaynews', name: 'todaynews', component: './Welcome' },
        ],
      },
      {
        path: '/prodata',
        name: 'prodata',
        icon: 'smile',
        // component: './Welcome',
        routes: [
          { path: '/prodata/resource', name: 'resource', component: './resource/index.js' },
          { path: '/prodata/dakagroup', name: 'dakagroup', component: './Welcome' },
        ],
      },
      {
        path: '/talkconfig',
        name: 'talkconfig',
        icon: 'smile',
        // component: './Welcome',
        routes: [
          { path: '/talkconfig/sayhi', name: 'sayhi', component: './sayhi/index.js' },
          { path: '/talkconfig/replyfactory', name: 'replyfactory', component: './replyfactory/index' },
          { path: '/talkconfig/initiativemsg', name: 'initiativemsg', component: './activemessage/index' },
        ],
      },
]