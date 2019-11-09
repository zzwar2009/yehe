import { get, post, del } from '@/utils/request';
import UrlConfig from '../config/host.config';

export async function postSmsMessage(params) {
    return post(UrlConfig.api_url_v1, '/Sms/Send', params);
}

export async function getSmsDetail(id) {
    return get(UrlConfig.api_url_v1, `/Sms/message/${id}`);
}

export async function createSmsTemplate(params) {
    return post(UrlConfig.api_url_v1, '/Sms/createTemplate', params);
}

export async function getSmsTemplateDetail(templateId) {
    return get(UrlConfig.api_url_v1, `/Sms/template/${templateId}`);
}

export async function deleteSmsTemplate(templateId) {
    return del(UrlConfig.api_url_v1, `/Sms/template/${templateId}`);
}

export async function getSmsTemplateList() {
    return get(UrlConfig.api_url_v1, '/Sms/template');
}

export async function getSmsQuota() {
    return get(UrlConfig.api_url_v1, '/Sms/quota');
}

export async function getSmsReceiverInfo(phoneNumber) {
    return get(UrlConfig.api_url_v1, `/Sms/receiver/${phoneNumber}`);
}
