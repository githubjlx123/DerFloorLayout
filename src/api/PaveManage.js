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

// 保存铺装模拟结果
export const saveSimulateResult = query => {
    return request({
        url: `${_this.$serverUrl}saveSimulateResult`,
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