/* eslint-disable camelcase */

/**
 * Sample React
 * User: Junhang
 * Date: 2018/10/31 3:02 PM
 */
// const isRelease = true
const isRelease = window.location.hostname === 'oilcashier.tjyunshi.com';
//
const host_ip = isRelease ? 'https://api.tjyunshi.com' : 'http://message.api.starotms.com';
// longin_ip与trans_ip相同
const login_ip = isRelease ? 'https://zdy-api.tjyunshi.com/' : 'http://facai1hao.starotms.cn/';
const webapi_ip = isRelease ? 'https://webapi.tjyunshi.com/' : 'https://dev-webapi.tjyunshi.com/';
const trans_ip = isRelease ? 'https://zdy-api.tjyunshi.com/' : 'http://facai1hao.starotms.cn/';
const UrlConfig = {
    /**
     * Url 全局配置  常用值
     */
    flag: 'consosle',
    is_release: isRelease,
    feature: isRelease ? 'consosle' : 'staging_consosle',
    api_url: `${host_ip}`,
    login_ip,
    webapi_ip,
    webapi_url: `${webapi_ip}api/youhuo/v1/`,
    api_url_v1: `${host_ip}/api/v1.0`,
    upload_files_url: `https://dfs.tjyunshi.com/upload`,
    trans_ip: `${trans_ip}api/v1.0`,
    // new_host :`http://47.97.187.218:8080/api/manage/v1/`
    new_host :`http://118.89.16.143/api/manage/v1/`
    
};

export default UrlConfig;
