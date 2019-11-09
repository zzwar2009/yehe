/* eslint-disable */
const namespace = 'oilstation';
export function queryOilUserList(payload) {
    return {
        type: `${namespace}/queryOilUserList`,
        payload,
    };
}
