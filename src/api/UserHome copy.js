import request from '../utils/request';
import Vue from 'vue';
let _this = new Vue();
//查询用户上次登录地点与时间
export const getUserLastLoginMessageByUserId = query => {
    return request({
        url: `${_this.$serverUrl}getUserLastLoginMessageByUserId`,
        method: 'post',
        data: query
    });
};
//查询用户项目、数据集、模型总数
export const getSumByUserId = query => {
    return request({
        url: `${_this.$serverUrl}getUserTotalProjectsHomesRoomsCountByUserId`,
        method: 'post',
        data: query
    });
};
//查询用户最新的6个项目
export const getLastProjectsByUserId = query => {
    return request({
        url: `${_this.$serverUrl}getLastProjectsByUserId`,
        method: 'post',
        data: query
    });
};
//查询用户最新的6个数据集
export const getLastDatasetsByUserId = query => {
    return request({
        url: `${_this.$serverUrl}getLastDatasetsByUserId`,
        method: 'post',
        data: query
    });
};
//用户查询最新模型信息
export const getNewestModelByUserId = query => {
    return request({
        url: `${_this.$serverUrl}getNewestModelByUserId`,
        method: 'post',
        data: query
    });
};
//用户查询最新模型信息
export const getUnReadMessageCount = query => {
    return request({
        url: `${_this.$serverUrl}getUnReadMessageCount`,
        method: 'post',
        data: query
    });
};
