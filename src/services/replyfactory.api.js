import request from '../utils/request';
import UrlConfig from '@/config/host.config';
// 用户关联油站相关
export async function queryWorkers(params) {
    console.log(params)
    return request(UrlConfig.new_host,'chat/pageReply', {
        method: 'POST',
        data: {
            current:params.pageIndex,
            size:params.pageSize
        }
    });
}

// 根据id查询用户信息
export async function queryWorkerById(params) {
    return request(UrlConfig.trans_ip, '/UserGet', {
        method: 'GET',
        data: params,
    });
}

// 创建
export async function createEntity(params) {
    console.log(params);
    const imgList = params.imgList.map(function(item){
        return item;
    })
    const replyExtendsList = params.replyExtendsList.map(function(item){
        return {
            content:item
        };
    })
    const resourceList = params.resourceList || [];
    return request(UrlConfig.new_host, 'chat/addReply', {
        method: 'POST',
        data: {
            ...params,
            replyExtendsList,
            resourceList:JSON.stringify(resourceList),
            imgList:JSON.stringify(imgList)
        },
    });
}

// 修改密码
export async function changePwd(params) {
    return request(UrlConfig.trans_ip, '/OilUserIUserModifyPassWordForUser', {
        method: 'POST',
        data: params,
    });
}

// 删除油站
export async function delEntity(params) {
    return request(UrlConfig.trans_ip, '/OilUserOilUsersDelete', {
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

// 用户绑定油站
export async function bindStation(params) {
    return request(UrlConfig.trans_ip, '/OilUserOilUserSupplierBind', {
        method: 'GET',
        data: params,
    });
}
// 用户解绑油站
export async function unBindStation(params) {
    return request(UrlConfig.trans_ip, '/OilUserOilUserSupplierUnbind', {
        method: 'GET',
        data: params,
    });
}
