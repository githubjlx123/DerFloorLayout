import request from '../utils/request';
import Vue from 'vue';
let _this = new Vue();

//获取部署信息
export const adminGetModelDetailById = params => {
    return request({
        url: `${_this.$serverUrl}admin/adminGetModelDetailById`,
        method: 'post',
        data: params
    })
}

//部署模糊查询
export const getFuzzyDeploysByUserId = query =>{
    return request({
        url: `${_this.$serverUrl}getFuzzyDeploysByUserId`,
        method: 'post',
        data: query
    });
}
//删除部署信息 deleteModelById
export const deleteDeployById = query =>{
    return request({
        url: `${_this.$serverUrl}deleteDeployById`,
        method: 'post',
        data: query
    });
}
//管理员查询部署信息
export const getFuzzyDeploysByName = query =>{
    return request({
        url: `${_this.$serverUrl}admin/getFuzzyDeploysByName`,
        method: 'post',
        data: query
    });
}
//用户获取部署地址
export const getDeployFileById = query =>{
    return request({
        url: `${_this.$serverUrl}getDeployFileById`,
        method: 'post',
        data: query
    });
}