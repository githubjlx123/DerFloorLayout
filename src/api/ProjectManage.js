import request from '../utils/request';
import Vue from 'vue';
let _this = new Vue();

//创建项目 createProject
export const createProject = query =>{
    return request({
        url: `${_this.$serverUrl}createProject`,
        method: 'post',
        data: query
    });
}

//项目信息删除
export const deleteProjectById = query =>{
    return request({
        url: `${_this.$serverUrl}deleteProjectById`,
        method: 'post',
        data: query
    });
}

//项目编辑
export const updateProjectById = query =>{
    return request({
        url: `${_this.$serverUrl}updateProjectById`,
        method: 'post',
        data: query
    });
}

//用户查看项目详细信息
export const getProjectById = query =>{
    return request({
        url: `${_this.$serverUrl}getProjectById`,
        method: 'post',
        data: query
    });
}

//用户项目模糊查询
export const getFuzzyProjectsByUserId = query =>{
    return request({
        url: `${_this.$serverUrl}getFuzzyProjectsByUserId`,
        method: 'post',
        data: query
    });
}




//通过用户ID查询项目下拉框
export const getProjectByUserIdForList = query =>{
    return request({
        url: `${_this.$serverUrl}getProjectByUserIdForList`,
        method: 'post',
        data: query
    });
}




















//管理员查询项目数据
export const getAllProjects = query => {
    return request({
        url: `${_this.$serverUrl}admin/getAllProjects`,
        method: 'post',
        data: query
    });
};
//管理员查询项目详细信息
export const getProjectDetail = query =>{
    return request({
        url: `${_this.$serverUrl}admin/adminGetProjectDetailById`,
        method: 'post',
        data: query
    });
}
//管理员模糊查询
export const getFuzzyProjectsByName = query =>{
    return request({
        url: `${_this.$serverUrl}admin/getFuzzyProjectsByName`,
        method: 'post',
        data: query
    });
}




//查看项目信息
export const getProjectsByUserId = query =>{
    return request({
        url: `${_this.$serverUrl}getProjectsByUserId`,
        method: 'post',
        data: query
    });
}

