/* eslint-disable */
// import {
//     queryWorkers,
//     createEntity,
//     delEntity,
//     changePwd,
//     bindStation,
//     unBindStation,
//     queryWorkerById,
// } from '@/services/refuelworker.api';
import {
    queryWorkers,
    createEntity,updatEntity,
    delEntity,
    changePwd,
    bindStation,
    unBindStation,
    queryWorkerById,
} from '@/services/resource.api';
import { queryStations } from '@/services/station.api';
const Model = {
    namespace: 'resource',
    state: {
        currentPage: 1,
        dataList: [], // 数据
        totalCount: 0, // 数据总量
        changePwdUserid: undefined, // 要修改密码的用户id
        changePwdModalVisible: false, // 修改密码弹窗显yin
        addOilModalVisible: false, // 是否展示新建弹窗
        actiontype: undefined, // 弹窗动作类型
        formdata: {
            "describes": "",// 描述
            "extraInformation": "",// 附属信息
            "fileFormat": "",// 文件格式
            "id": null,// 编号
            "imgList": "",// 图片列表
            "name": "", // 资源名称
            "tag": "",// 标签
            "type": "",// 资源类型
            "years": "" // 年代
        },
        relatedStationModalVisible: false, // 绑定油站弹窗
        relatedStationFormdata: {
            //绑定油站部分表单
            nicknamenative: '', // 姓名
            userid: '', // 用户id
            role: '', // 角色
            station: [], // 相关联的油站
        },
    },
    effects: {
        *queryList({ payload }, { call, put }) {
            try {

                const response = yield call(queryWorkers, payload);
                const { status, entities,total } = response;
                if (status === 'OK') {
                    yield put({
                        type: 'updateList',
                        payload: {
                            result:entities,
                            totalCount:total,
                            pageIndex: payload.current,
                        },
                    });
                }
            } catch (e) {
                console.log(e);
            }
        },

        *createEntity({ payload }, { call, put }) {
            try {
                const response = yield call(createEntity, payload);
                return new Promise(resolve => {
                    resolve(response);
                });
            } catch (e) {
                console.log(e);
            }
        },

        *updatEntity({ payload }, { call, put }) {
            try {
                const response = yield call(updatEntity, payload);
                return new Promise(resolve => {
                    resolve(response);
                });
            } catch (e) {
                console.log(e);
            }
        },
        
        *changePwd({ payload }, { call, put }) {
            try {
                const response = yield call(changePwd, {
                    password: payload.pwd,
                    loginName: payload.userid,
                });
                return new Promise(resolve => {
                    resolve(response);
                });
            } catch (e) {
                console.log(e);
            }
        },

        *delEntity({ payload }, { call, put }) {
            try {
                const response = yield call(delEntity, { userId: payload });
                return new Promise(resolve => {
                    resolve(response);
                });
            } catch (e) {
                console.log(e);
            }
        },

        *createModal({ payload }, { call, put }) {
            try {
                if (payload && payload.id) {
                    //有油站信息
                    yield put({
                        type: 'createModalForm',
                        payload: {
                            ...payload,
                        },
                    });
                } else {
                    // 没有油站信息
                    yield put({
                        type: 'createModalForm',
                        payload: {
                            "describes": "",// 描述
                            "extraInformation": "",// 附属信息
                            "fileFormat": "",// 文件格式
                            "id": '',// 编号
                            "imgList": [],// 图片列表
                            "name": "", // 资源名称
                            "tag": "",// 标签
                            "type": "",// 资源类型
                            "years": "" // 年代
                        },
                    });
                }
            } catch (e) {
                console.log(e);
            }
        },
        *bindStation({ payload }, { call, put }) {
            // 绑定油站
            try {
                const queryData = {
                    userId: payload.userid,
                    supplierCode: payload.supplierASCode,
                };
                const response = yield call(bindStation, queryData);
                return new Promise(resolve => {
                    resolve(response);
                });
            } catch (e) {
                console.log(e);
            }
        },

        *unBindStation({ payload }, { call, put }) {
            // 解绑油站
            try {
                const response = yield call(unBindStation, payload);
                return new Promise(resolve => {
                    resolve(response);
                });
            } catch (e) {
                console.log(e);
            }
        },

        *updateModal({ payload }, { call, put }) {
            try {
                const { clickNum,
                    code,
                    createTime,
                    describes,
                    extraInformation,
                    fileFormat,
                    id,
                    imgList,
                    key,
                    name,
                    tag,
                    type,
                    years } = payload;
                const response = yield call(queryWorkerById, {
                    id: id,
                });
                const { status, entity } = response;
                if (status === "OK" && entity) {
                    yield put({
                        type: 'updateModalAfter',
                        payload: {
                            // ...payload,
                            ...entity,
                        },
                    });
                } else {
                    // yield put({
                    //     type: 'updateModalAfter',
                    //     payload: {
                    //         ...payload,
                    //     },
                    // });
                }
            } catch (e) {
                console.log(e);
            }
        },
    },
    reducers: {
        updateList(state, { payload }) {
            let newstate = Object.assign({}, state);
            newstate.dataList = payload.result;
            newstate.totalCount = payload.totalCount;
            newstate.pageIndex = payload.pageIndex;
            return newstate;
        },

        showModal(state, { payload }) {
            let newstate = Object.assign({}, state);
            newstate.addOilModalVisible = payload;
            return newstate;
        },
        showPwdModal(state, { payload }) {
            let newstate = Object.assign({}, state);
            newstate.changePwdModalVisible = payload;
            return newstate;
        },

        changePwdModal(state, { payload }) {
            // 修改密码
            let newstate = Object.assign({}, state);
            newstate.changePwdModalVisible = true;
            newstate.changePwdUserid = payload;
            return newstate;
        },
        createModalForm(state, { payload }) {
            let newstate = Object.assign({}, state);
            newstate.addOilModalVisible = true;
            newstate.actiontype = 'create';
            newstate.formdata = {
                ...payload, //油站信息
            };
            return newstate;
        },

        updateModalAfter(state, { payload }) {
            let newstate = Object.assign({}, state);
            newstate.addOilModalVisible = true;
            
            newstate.actiontype = 'update';
            const { clickNum,
                code,
                createTime,
                describes,
                extraInformation,
                fileFormat,
                id,
                imgList,
                key,
                name,
                tag,
                type,
                years  } = payload;
            
            newstate.formdata = {
                ...payload,
            };
            console.log(newstate);
            return newstate;
        },

        updateStation(state, { payload }) {
            // 更新油站信息
            let newstate = Object.assign({}, state);
            newstate.formdata.station = {
                ...payload,
            };
            return newstate;
        },

        modifyRelatedStationModal(state, { payload }) {
            // 更新油站信息
            let newstate = Object.assign({}, state);
            const { nicknamenative, userid, role, station, roleDescription } = payload;
            newstate.relatedStationModalVisible = true;
            newstate.relatedStationFormdata = {
                nicknamenative, // 姓名
                userid, // 用户id
                role, // 角色
                roleDescription,
                station: station || [], // 相关联的油站
            };
            return newstate;
        },
        showRelatedStationModal(state, { payload }) {
            let newstate = Object.assign({}, state);
            newstate.relatedStationModalVisible = payload;
            return newstate;
        },
    },
};
export default Model;
