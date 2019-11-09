/* eslint-disable */
const namespace = 'oilstation';
export function getRewardRatioList(payload) {
    return {
        type: `${namespace}/getRewardRatioList`,
        payload,
    };
}
