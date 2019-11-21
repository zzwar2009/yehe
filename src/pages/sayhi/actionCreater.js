/* eslint-disable */
const namespace = 'sayhi';
export function queryList(payload) {
    return {
        type: `${namespace}/queryList`,
        payload,
    };
}
export function CreateModal(payload) {
    return {
        type: `${namespace}/createModal`,
        payload,
    };
}

export function updateModal(payload) {
    return {
        type: `${namespace}/updateModal`,
        payload,
    };
}

export function UpdateStation(payload) {
    return {
        type: `${namespace}/updateStation`,
        payload,
    };
}

export function showModal(payload) {
    return {
        type: `${namespace}/showModal`,
        payload,
    };
}
export function showPwdModal(payload) {
    return {
        type: `${namespace}/showPwdModal`,
        payload,
    };
}
export function showRelatedStationModal(payload) {
    return {
        type: `${namespace}/showRelatedStationModal`,
        payload,
    };
}

export function createEntity(payload) {
    return {
        type: `${namespace}/createEntity`,
        payload,
    };
}

export function queryEntity(payload) {
    return {
        type: `${namespace}/queryEntity`,
        payload,
    };
}




export function changePwd(payload) {
    return {
        type: `${namespace}/changePwd`,
        payload,
    };
}

export function delEntity(payload) {
    return {
        type: `${namespace}/delEntity`,
        payload,
    };
}

export function initPwdModal(payload) {
    return {
        type: `${namespace}/changePwdModal`,
        payload,
    };
}
export function modifyRelatedStationModal(payload) {
    return {
        type: `${namespace}/modifyRelatedStationModal`,
        payload,
    };
}

export function bindStation(payload) {
    return {
        type: `${namespace}/bindStation`,
        payload,
    };
}
export function unBindStation(payload) {
    return {
        type: `${namespace}/unbindStation`,
        payload,
    };
}
