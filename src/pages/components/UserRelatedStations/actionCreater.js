/* eslint-disable */
const namespace = 'userrs';
export function queryList(payload) {
    return {
        type: `${namespace}/queryList`,
        payload,
    };
}
