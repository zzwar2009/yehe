import { post } from '@/utils/request1';
import UrlConfig from '@/config/host.config';

export async function login(params) {
    return post(UrlConfig.api_host, 'Account/login', params);
}

export async function getUserinfo(params) {
    return post(UrlConfig.api_host, 'Account/userinfo', params);
}
