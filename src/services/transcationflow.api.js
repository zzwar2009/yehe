import UrlConfig from '../config/host.config';
import { post, get } from '@/utils/request';

// export async function fakeAccountLogin(params) {
//   // console.log('params', params)
//   return request(UrlConfig.api_host, '/users/login', {
//       method: 'POST',
//       data: { flag: UrlConfig.flag, ...params },
//   });
// }

export async function getAllFlows(params) {
    return post(UrlConfig.trans_ip, `/OilCharging/GetListApplyRefundInAdvance`, params);
}

export async function getDetail(params) {
    return get(UrlConfig.trans_ip, `/OilCharging/OilChargingDetail`, params);
}

export async function getReconde(params) {
    return get(UrlConfig.trans_ip, `/OilCharging/RefundRecodeByOil`, params);
}

export async function checkRecode(params) {
    // let p = '?'
    // const keys = Object.keys(params)

    // keys.forEach(key => {
    //   p+=`${key}=${params[key]}&`
    // })

    return post(UrlConfig.trans_ip, `/OilCharging/RefundOilAudit`, params);
}

export async function applyRefunOil(params) {
    let p = '?';
    const keys = Object.keys(params);

    keys.forEach(key => {
        p += `${key}=${params[key]}&`;
    });
    return post(UrlConfig.trans_ip, `/OilCharging/RefundOilAddForAdmin${p}`);
}

export async function exportExl(params) {
    return post(UrlConfig.trans_ip, `/OilCharging/ExportExcel`, params);
}
