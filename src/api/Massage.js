import request from '../utils/request';
import Vue from 'vue';
let _this = new Vue();
//管理员向用户发送消息
export const adminAddMessage = query => {
    return request({
        url: `${_this.$serverUrl}admin/adminAddMessage`,
        method: 'post',
        data: query
    });
};
//用户向管理员发送消息
export const sendMessageToAdmin = query => {
    return request({
        url: `${_this.$serverUrl}userAddMessageToAdmin`,
        method: 'post',
        data: query
    });
};
//用户读取消息后改变消息状态
export const updateMessageStatus = query => {
    return request({
        url: `${_this.$serverUrl}updateMessageUnreadToReadByList`,
        method: 'post',
        data: query
    });
};
//查询未读消息
export const getUnReadMessageCount = query => {
    return request({
        url: `${_this.$serverUrl}getUnReadMessageCount`,
        method: 'post',
        data: query
    });
};
//用户查看已发送反馈信息列表
export const getUserSendMessageById = query => {
    return request({
        url: `${_this.$serverUrl}getUserSendMessageById`,
        method: 'post',
        data: query
    });
};
//管理员查所有发送消息
export const getMessagesByAdminId = query => {
    return request({
        url: `${_this.$serverUrl}admin/getMessagesByAdminId`,
        method: 'post',
        data: query
    });
};
//管理员撤回发送的消息
export const withdrawMessageById = query => {
    return request({
        url: `${_this.$serverUrl}admin/withdrawMessageById`,
        method: 'post',
        data: query
    });
};
//管理员删除消息
export const deleteMessageById = query => {
    return request({
        url: `${_this.$serverUrl}admin/deleteMessageById`,
        method: 'post',
        data: query
    });
};
//管理员模糊查询发送的消息
export const getFuzzyMessagesByAdminId = query => {
    return request({
        url: `${_this.$serverUrl}admin/getFuzzyMessagesByAdminId`,
        method: 'post',
        data: query
    });
};
//用户查询未读消息、已读消息、回收站消息
export const getMessageByUserId = query => {
    return request({
        url: `${_this.$serverUrl}getMessageByUserId`,
        method: 'post',
        data: query
    });
};
//用户将消息至于回收站
export const updateMessageNormalToRecycleByList = query => {
    return request({
        url: `${_this.$serverUrl}updateMessageNormalToRecycleByList`,
        method: 'post',
        data: query
    });
};
//用户将消息还原
export const updateMessageRecycleToNormalByList = query => {
    return request({
        url: `${_this.$serverUrl}updateMessageRecycleToNormalByList`,
        method: 'post',
        data: query
    });
};
//用户将清空回收站
export const updateMessageDestroyByList = query => {
    return request({
        url: `${_this.$serverUrl}updateMessageDestroyByList`,
        method: 'post',
        data: query
    });
};