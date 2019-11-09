import request from '../utils/request';
import UrlConfig from '@/config/host.config';

// 油站列表查询
export async function queryStations(params) {
    const { supplierName, ...restParams } = params;
    const resUrl = supplierName
        ? `/SupplierAS/GerList?supplierName=${supplierName}`
        : '/SupplierAS/GerList';
    return request(UrlConfig.trans_ip, resUrl, {
        method: 'POST',
        data: restParams,
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
    return request(UrlConfig.trans_ip, `/SupplierAS?id=${params}`, {
        method: 'DELETE',
    });
}

// 生成油站编号
export async function genStationCid(params) {
    return request(UrlConfig.trans_ip, '/SupplierAS/GetSupplierASCode', {
        method: 'GET',
        data: params,
    });
}

// 获取奖励列表
export async function getRewardRatioList(params) {
    return request(UrlConfig.trans_ip, '/RewardRatio/GetList', {
        method: 'GET',
        data: params,
    });
}

// 获取油站员工列表
export async function queryOilUserList(params) {
    return request(UrlConfig.trans_ip, '/OilUserGerList', {
        method: 'GET',
        data: params,
    });
}
