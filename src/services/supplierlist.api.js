import UrlConfig from '../config/host.config';
import { post, del, get } from '@/utils/request';

export async function getSupplierList(params) {
    return post(UrlConfig.trans_ip, `/Supplier/GerList`, params);
}
export async function newSupplier(params) {
    return post(UrlConfig.trans_ip, `/Supplier`, params);
}
export async function deleteSupplier(params) {
    return del(UrlConfig.trans_ip, `/Supplier`, params);
}
export async function updateSupplier(params) {
    return post(UrlConfig.trans_ip, `/Supplier`, params);
}
export async function searchSupplier(params) {
    return get(UrlConfig.trans_ip, `/Supplier/CheckSupplierName`, params);
}
export async function getSuppInfo(params) {
    return get(UrlConfig.trans_ip, `/Supplier`, params);
}
export async function getXS(params) {
    return get(UrlConfig.trans_ip, `/Supplier/GetBuyPSList`, params);
}
export async function insertAS(params) {
    return post(UrlConfig.trans_ip, `/SupplierAS/InsertSupplierAsList`, params.supplierASInfos);
}
export async function getOilList(params) {
    return post(UrlConfig.trans_ip, `/SupplierAS/GerList`, params);
}
