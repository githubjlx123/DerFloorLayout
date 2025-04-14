import request from '../utils/request';
import Vue from 'vue';
let _this = new Vue();

//查询管理员首页信息
export const login = query => {
    return request({
        url: `${_this.$serverUrl}login`,
        method: 'post',
        data: query
    });
};
//日活量
export const addActionUserId = query => {
    return request({
        url: `${_this.$serverUrl}addActionUserId`,
        method: 'post',
        data: query
    });
};
//用户注册
export const registerUser = query => {
    return request({
        url: `${_this.$serverUrl}registerUser`,
        method: 'post',
        data: query
    });
};
