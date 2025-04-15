import request from '../utils/request';
import Vue from 'vue';
let _this = new Vue();

//铺装模拟
export const paveSimulate = query => {
    return request({
        url: `${_this.$serverUrl}paveSimulate`,
        method: 'post',
        data: query
    });
};
export const updateRoomLabelById = query => {
    return request({
        url: `${_this.$serverUrl}updateRoomLabelById`,
        method: 'post',
        data: query
    });
};


// 查询用户铺装模拟结果
export const getFuzzyPaveByUserId = query => {
    return request({
        url: `${_this.$serverUrl}getFuzzyPaveByUserId`,
        method: 'post',
        data: query
    });
};


// 通过id号查询铺装模拟详细方案
export const getPavePlanById = query => {
    return request({
        url: `${_this.$serverUrl}getPavePlanById`,
        method: 'post',
        data: query
    });
};


// 主页中获取最近7天的铺装方案
export const getRecentPaveByUserId = query => {
    return request({
        url: `${_this.$serverUrl}getRecentPaveByUserId`,
        method: 'post',
        data: query
    });
};
