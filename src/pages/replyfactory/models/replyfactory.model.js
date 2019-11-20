/* eslint-disable */
import {
    queryWorkers,
    createEntity,
    delEntity,
    changePwd,
    bindStation,
    unBindStation,
    queryWorkerById,
} from '@/services/replyfactory.api';
import { queryStations } from '@/services/station.api';
const Model = {
    namespace: 'replyfactory',
    state: {
        currentPage: 1,
        dataList: [], // 数据
        totalCount: 0, // 数据总量
        changePwdUserid: undefined, // 要修改密码的用户id
        changePwdModalVisible: false, // 修改密码弹窗显yin
        addOilModalVisible: false, // 是否展示新建弹窗
        actiontype: undefined, // 弹窗动作类型
        formdata: {
            imgList:[],// 图片列表
            name:"", // 意图名称
            replyExtendsList:[],// 文本消息集合
            resourceList:[],// 资源集合
            id:'',
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
                            ...payload
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
                const { userobjname, userobjno, userid } = payload;
                const response = yield call(queryWorkerById, {
                    userId: userid,
                });
                const { code, result } = response;
                if (code === 200 && result) {
                    yield put({
                        type: 'updateModalAfter',
                        payload: {
                            // ...payload,
                            ...result,
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
                imgList:[],// 图片列表
                name:"", // 意图名称
                replyExtendsList:[],// 文本消息集合
                resourceList:'',// 资源集合
                id:'',
            };
            return newstate;
        },

        updateModalAfter(state, { payload }) {
            let newstate = Object.assign({}, state);
            newstate.addOilModalVisible = true;
            newstate.actiontype = 'update';
            const { regionName, startDT, supplierASCode, supplierASName, userobjno } = payload;
            let role = '';
            if (payload.platRoleInfos && payload.platRoleInfos.length > 0) {
                role = payload.platRoleInfos[0].roleId;
            }
            newstate.formdata = {
                ...payload,
                role,
                stationId: userobjno,
                status: String(payload.status),
                station: {
                    regionName,
                    startDT,
                    supplierASCode,
                    supplierASName,
                },
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
