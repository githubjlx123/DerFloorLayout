import request from '../utils/request';
import Vue from 'vue';
let _this = new Vue();

//管理员查看用户列表
export const getAllUsers = params => {
    return request({
        url: `${_this.$serverUrl}admin/getAllUsers`,
        method: 'post',
        data: params
    })
}
//管理员模糊查询用户列表
export const getFuzzyUsersByName = params => {
    return request({
        url: `${_this.$serverUrl}admin/getFuzzyUsersByName`,
        method: 'post',
        data: params
    })
}


//管理员添加用户信息
export const adminAddUser = params => {
    return request({
        url: `${_this.$serverUrl}admin/adminAddUser`,
        method: 'post',
        data: params
    })
}

//管理员编辑用户信息
export const updateUserById = params => {
    return request({
        url: `${_this.$serverUrl}admin/updateUserById`,
        method: 'post',
        data: params
    })
}
//查看单个用户信息
export const getUserById = params => {
    return request({
        url: `${_this.$serverUrl}getUserById`,
        method: 'post',
        data: params
    })
}
//用户修改本人信息
export const editUserInfo = params => {
    return request({
        url: `${_this.$serverUrl}updateUserById`,
        method: 'post',
        data: params
    })
}
//管理员模糊查询用户信息
export const adminGetFuzzyUserByName = params => {
    return request({
        url: `${_this.$serverUrl}admin/adminGetFuzzyUserByName`,
        method: 'post',
        data: params
    })
}
//用户修改密码
export const resetPwd = params => {
    return request({
        url: `${_this.$serverUrl}updateUserPasswordById`,
        method: 'post',
        data: params
    })
}

//检测邮箱checkEmail
export const checkEmail = params => {
    return request({
        url: `${_this.$serverUrl}checkEmail`,
        method: 'post',
        data: params
    })
}

