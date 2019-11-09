/* eslint-disable consistent-return */
import { message as AntMessage } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import router from 'umi/router';
// import { stringify } from 'qs';

import axios from 'axios';

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
};

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        const { data: result } = response;
        if (response.status) {
            if (response.status >= 200 && response.status < 300) {
                response.success = true; //eslint-disable-line
                return result;
            }
            const error = new Error(result);
            response.success = false;
            error.result = response;
            throw error;
        }
    }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} api       The URL we want to request
 * @param  {object} [options] The options we want to pass to "axios"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, api, options) {
    const defaultOptions = {
        credentials: 'include',
    };
    const newOptions = { ...defaultOptions, ...options };
    const token = localStorage.getItem('token');
    const Authorization = token && token.length > 0 ? `${token}` : '';
    if (
        newOptions.method === 'POST' ||
        newOptions.method === 'PUT' ||
        newOptions.method === 'DELETE'
    ) {
        let contentType = 'json';
        if (Object.prototype.toString.call(options.data).indexOf('FormData') > -1) {
            contentType = 'x-www-form-urlencoded';
        }
        newOptions.headers = {
            Accept: 'application/json',
            'Content-Type': `application/${contentType}; charset=utf-8`,
            ...newOptions.headers,
            Authorization,
        };
    } else {
        newOptions.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            ...newOptions.headers,
            Authorization,
        };
        newOptions.params = { ...(newOptions.data || newOptions.params) };
    }

    return new Promise(resolve => {
        axios
            .create()
            .request({
                url: url + api,
                method: options && options.method ? options.method : 'get',
                timeout: 12000,
                ...newOptions,
            })
            .then(checkStatus)
            .then(res => {
                resolve(res);
            })
            .catch(error => {
                const { response } = error;

                if ('stack' in error && 'message' in error) {
                    const { message } = error;
                    if (!message.indexOf('timeout')) {
                        AntMessage.warn('请求超时');
                        resolve({
                            code: 600,
                            description: '请求超时',
                        });
                    } else {
                        if (!response) {
                            AntMessage.warn('请求超时');
                            resolve({
                                code: 600,
                                description: '请求超时',
                            });
                            return;
                        }

                        const { status } = response;
                        if (status === 401) {
                            resolve({
                                code: status,
                                description: '登录超时',
                            });
                            // @HACK
                            /* eslint-disable no-underscore-dangle */
                            window.g_app._store.dispatch({
                                type: 'login/logout',
                            });
                            return;
                        }
                        AntMessage.warn('请求错误');
                        if (Object.prototype.toString.call(response.data).indexOf('Object') > -1) {
                            resolve(response.data);
                        } else {
                            resolve({
                                code: status,
                                description: status ? codeMessage[status] : '',
                            });
                        }
                        if (status === 403) {
                            router.push('/exception/403');
                            return;
                        }
                        if (status <= 504 && status >= 500) {
                            router.push('/exception/500');
                            return;
                        }
                        if (status >= 404 && status < 422) {
                            router.push('/exception/404');
                        }
                    }
                }
                const result = { success: false };
                return result;
            });
    });
}

export const post = (url, api, params) =>
    request(url, api, {
        method: 'POST',
        data: params,
    });

export const del = (url, api, params) =>
    request(url, api, {
        method: 'DELETE',
        data: params,
    });

export const get = (url, api, params) =>
    request(url, api, {
        method: 'GET',
        params,
    });
