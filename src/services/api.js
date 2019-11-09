import request, { get, post } from '@/utils/request';
import UrlConfig from '../config/host.config';
// import Version from '@/config/version.config';

/**
 * 用户登录接口
 * @param params
 * @returns {Promise<void>}
 */
export async function loginWithPhoneCode(params = {}) {
    // console.log('params', params)
    // const data = new FormData();
    // data.append('client_id', 'yh_client_mini');
    // data.append('grant_type', 'sms_auth_code');
    // data.append('phone', params.phone);
    // data.append('auth_code', params.code);
    // data.append('scope', 'order_service openid');
    // data.append('cur_version', Version.versionName);
    // data.append('credentials', 'phone');
    // data.append('end_user', 'youhuo_mini_account');

    // data.append('loginName', params.phone);
    // data.append('authCode', params.code);
    // data.append('curVersion', '1.0');
    // data.append('credentials', 'account');
    // data.append('endUser', 'oil_web_yg');
    // 新的登录需要修改成新的参数
    return request(UrlConfig.login_ip, 'api/v1.0/UserLogin', {
        method: 'POST',
        data: {
            loginName: params.phone,
            authCode: params.code,
            curVersion: '1.0',
            credentials: 'account',
            endUser: 'oil_web_yg',
        },
    });
}

export async function getLoginPhoneCode(mobile = '') {
    return request(UrlConfig.webapi_url, '/Account/phonecode', {
        method: 'POST',
        data: {
            mobile,
        },
    });
}

export async function getApiResource(params) {
    return get(UrlConfig.api_url, '/api/Resource', params);
}

export async function createApiResource(params) {
    return post(UrlConfig.api_url, '/api/Resource', params);
}

export async function queryProjectNotice() {
    return request(UrlConfig.api_url, '/v/api/project/notice');
}
