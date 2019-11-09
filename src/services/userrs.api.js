import request from '../utils/request';
import UrlConfig from '@/config/host.config';

// 用户关联油站api
export async function queryStations(params) {
    return request(UrlConfig.trans_ip, '/OilUserOilUserSupplierBindList', {
        method: 'GET',
        data: params,
    });
}

// 创建和修改油站信息
export async function createStation(params) {
    return request(UrlConfig.trans_ip, '/SupplierAS', {
        method: 'POST',
        data: params,
    });
}

// 删除油站
export async function delStation(params) {
    return request(UrlConfig.trans_ip, '/SupplierAS', {
        method: 'DELETE',
        data: params,
    });
}

// 生成油站编号
export async function genStationCid(params) {
    return request(UrlConfig.trans_ip, '/SupplierAS/GetSupplierASCode', {
        method: 'GET',
        data: params,
    });
}
