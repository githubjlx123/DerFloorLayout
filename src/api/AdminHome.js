import request from '../utils/request';
import Vue from 'vue';
let _this = new Vue();

//管理员获取当天用户数据
export const getUsersMessageThisDay = query => {
    return request({
        url: `${_this.$serverUrl}admin/getUsersMessageThisDay`,
        method: 'post',
        data: query
    });
};
//管理员获取设备信息
export const getServerDeviceMessage = query => {
    return request({
        url: `${_this.$serverUrl}admin/getServerDeviceMessage`,
        method: 'post',
        data: query
    });
};

//管理员获取用户反馈信息
export const getUserFeedbackMessage = query => {
    return request({
        url: `${_this.$serverUrl}admin/getUserFeedbackMessage`,
        method: 'post',
        data: query
    });
};

//管理员获取近期活跃与注册情况
export const getUsersAactionMessageRecently = query => {
    return request({
        url: `${_this.$serverUrl}admin/getUsersAactionMessageRecently`,
        method: 'post',
        data: query
    });
};