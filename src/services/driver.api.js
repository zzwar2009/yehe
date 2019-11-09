import UrlConfig from '../config/host.config';
import { post } from '@/utils/request';

export async function getDriverList(params) {
    return post(UrlConfig.trans_ip, `/Customer/GerList`, params);
}
export async function updDriver(params) {
    return post(UrlConfig.trans_ip, `/Customer`, params);
}
// export async function deleteSupplier(params) {
//     return del(UrlConfig.trans_ip, `/Supplier`, params);
// }
// export async function updateSupplier(params) {
//     return post(UrlConfig.trans_ip, `/Supplier`, params);
// }
