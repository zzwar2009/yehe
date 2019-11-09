import request from '../utils/request';
import UrlConfig from '@/config/host.config';
// 加油工相关 api
// 列表查询

// 获取权限列表
export async function queryOperats(params) {
    return request(UrlConfig.trans_ip, '/OilUserGerList', {
        method: 'GET',
        data: params,
    });
}
// 获取角色列表
export async function queryRoles(params) {
    return request(UrlConfig.trans_ip, '/UserRoleGerRoleList', {
        method: 'GET',
        data: params,
    });
}

// 创建和修改
export async function createEntity(params) {
    const queryData = {
        status: '1',
        ...params,
    };
    return request(UrlConfig.trans_ip, '/UserRoleAddRole', {
        method: 'POST',
        data: {
            platRoleInfo: queryData,
        },
    });
}

// 删除油站
export async function delEntity(params) {
    return request(UrlConfig.trans_ip, `/UserRoleDeleteRoleAndFunction?roleId=${params.id}`, {
        method: 'DELETE',
        data: params,
    });
}
