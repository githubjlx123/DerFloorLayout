import request from '../utils/request';
import Vue from 'vue';
let _this = new Vue();
//查询历史测试数据
export const getTestResultsByModelId = query => {
    return request({
        url: `${_this.$serverUrl}getTestResultsByModelId`,
        method: 'post',
        data: query
    });
};
//查询历史测试数据-单独页面查询-比较详细
export const getTestResultsByUserId = query => {
    return request({
        url: `${_this.$serverUrl}getTestResultsByUserId`,
        method: 'post',
        data: query
    });
};
//用户测试图片
export const valOneImage = query => {
    return request({
        url: `${_this.$serverUrl}valOneImage`,
        method: 'post',
        data: query
    });
};
//用户在线部署测试图片
export const deployModelTest = query => {
    return request({
        url: `${_this.$serverUrl}deployModelTest`,
        method: 'post',
        data: query
    });
};



// ========== 德尔地板测试 ==========
export const valDeErOneImage = query => {
    return request({
        url: `${_this.$serverUrl}valDeErOneImage`,
        method: 'post',
        data: query
    });
};