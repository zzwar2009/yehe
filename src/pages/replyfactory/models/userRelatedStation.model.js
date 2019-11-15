/* eslint-disable */
import { queryStations, createStation, delStation, genStationCid } from '@/services/userrs.api';
const Model = {
    namespace: 'userrsssshh',
    state: {
        dataList: [
            // {
            //     creatime: '2019-09-23T07:16:12.027',
            //     supplierASName: '滨海油站6',
            //     supplierASCode: 'GYS2233-0017',
            // },
        ], // 数据
        totalCount: 0, // 数据总量
    },
    effects: {
        *queryList({ payload }, { call, put }) {
            try {
                const response = yield call(queryStations, { userId: payload.userid });
                const { result, code, totalCount } = response;
                if (code === 200) {
                    yield put({
                        type: 'updateList',
                        payload: {
                            result,
                            totalCount,
                        },
                    });
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
            return newstate;
        },
    },
};
export default Model;
