import { routerRedux } from 'dva/router';
import { stringify } from 'querystring';
import { fakeAccountLogin, getFakeCaptcha ,login} from '@/services/login';
import { setAuthority ,delAuthority} from '@/utils/authority';

import { setToken ,delToken} from '@/utils/token';
import { getPageQuery } from '@/utils/utils';
const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.status === 'OK') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      const { redirect } = getPageQuery(); // redirect
      delAuthority();
      delToken();
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      payload.currentAuthority='admin';// 设置假的权限，拥有所有权限
      setAuthority(payload.currentAuthority);
      // setToken()
      // 站点油token
      setToken('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiIxMDAxNCIsIlRpbWVTdGFtcCI6MTU3NDQwMzk5MX0.yY-UN_sClSBYzQujDoiy0K8pLPQWo98H6XQ4yxknnqc');
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
