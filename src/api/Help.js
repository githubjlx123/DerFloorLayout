import request from '../utils/request';
import Vue from 'vue';
let _this = new Vue();

//管理员上传引导资源
export const addSystemImage = query =>{
    return request({
        url: `${_this.$serverUrl}addSystemImage`,
        method: 'post',
        data: query
    });
}
//管理员获取所有引导资源
export const getAllSystemImages = query =>{
    return request({
        url: `${_this.$serverUrl}getAllSystemImages`,
        method: 'post',
        data: query
    });
}
//管理员通过key获取所有引导资源
export const getSystemImagesByKey = query =>{
    return request({
        url: `${_this.$serverUrl}getSystemImagesByKey`,
        method: 'post',
        data: query
    });
}
//管理员通过key删除资源
export const deleteSystemImagesByKey = query =>{
    return request({
        url: `${_this.$serverUrl}deleteSystemImagesByKey`,
        method: 'post',
        data: query
    });
}
//管理员通过key修改资源
export const updateSystemImageByKey = query =>{
    return request({
        url: `${_this.$serverUrl}updateSystemImageByKey`,
        method: 'post',
        data: query
    });
}