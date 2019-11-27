// import request from '@/utils/request';

import request from '../utils/request';
import UrlConfig from '@/config/host.config';
export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}


// export async function fakeAccountLogin(params) {
//   return request('/api/login/account', {
//     method: 'POST',
//     data: params,
//   });

export async function login(params) {
    console.log(params)
    return request(UrlConfig.new_host,'user/login', {
        method: 'POST',
        data: {
          "username": params.userName,
          "verifyCode": '23',
          "password": params.password
        },
        
    });
}

export async function getVerifyImg(params) {
  return request(UrlConfig.new_host,'image/verifycode', {
      method: 'GET',
  });
}


export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

// http://47.97.187.218:8080/api/manage/v1/user/login
