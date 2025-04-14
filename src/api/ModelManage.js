import request from '../utils/request';
import Vue from 'vue';
let _this = new Vue();

//查询模型详细信息
export const adminGetModelDetailById = query => {
    return request({
        url: `${_this.$serverUrl}admin/adminGetModelDetailById`,
        method: 'post',
        data: query
    });
};
//模型模糊查询
export const getFuzzyModelsByUserId = query =>{
    return request({
        url: `${_this.$serverUrl}getFuzzyModelsByUserId`,
        method: 'post',
        data: query
    });
}
//删除模型信息
export const deleteModelById = query =>{
    return request({
        url: `${_this.$serverUrl}deleteModelById`,
        method: 'post',
        data: query
    });
}
//获取网络信息 getNetworks
export const getNetworks = query =>{
    return request({
        url: `${_this.$serverUrl}getNetworks`,
        method: 'post',
        data: query
    });
}
//获取模型信息
export const getModelsByUserId = query =>{
    return request({
        url: `${_this.$serverUrl}getModelsByUserId`,
        method: 'post',
        data: query
    });
}
//模型部署 deployModel
export const deployModel = query =>{
    return request({
        url: `${_this.$serverUrl}deployModel`,
        method: 'post',
        data: query
    });
}
//管理员查询所有模型信息
export const getFuzzyModelsByName = query =>{
    return request({
        url: `${_this.$serverUrl}admin/getFuzzyModelsByName`,
        method: 'post',
        data: query
    });
}
//用户查看最新模型信息
export const getLastModelsByUserId = query =>{
    return request({
        url: `${_this.$serverUrl}getLastModelsByUserId`,
        method: 'post',
        data: query
    });
}
//用户通过项目ID查询模型列表
export const getModelsByProjectId = query =>{
    return request({
        url: `${_this.$serverUrl}getModelsByProjectId`,
        method: 'post',
        data: query
    });
}
//用户通过数据集ID查询模型下拉框
export const getModelsByDatasetIdForList = query =>{
    return request({
        url: `${_this.$serverUrl}getModelsByDatasetIdForList`,
        method: 'post',
        data: query
    });
}
//用户通过模型ID获取模型信息
export const getModelById = query =>{
    return request({
        url: `${_this.$serverUrl}getModelById`,
        method: 'post',
        data: query
    });
}
//用户通过模型ID获取训练信息
export const getModelTrainMessageById = query =>{
    return request({
        url: `${_this.$serverUrl}getModelTrainMessageById`,
        method: 'post',
        data: query
    });
}
//用户通过模型ID、用户ID中断模型训练
export const breakTrainByModelId = query =>{
    return request({
        url: `${_this.$serverUrl}breakTrainByModelId`,
        method: 'post',
        data: query
    });
}
//用户通过用户ID获取用户模型下拉框
export const getModelsByUserIdForList = query =>{
    return request({
        url: `${_this.$serverUrl}getModelsByUserIdForList`,
        method: 'post',
        data: query
    });
}
//用户获取高级参数
export const getModelParams = () =>{
    return request({
        url: `${_this.$serverUrl}getModelParams`,
        method: 'post',
    });
}
//用户获取对应的优化器算法参数
export const getOptimizerParamsByName  = query =>{
    return request({
        url: `${_this.$serverUrl}getOptimizerParamsByName `,
        method: 'post',
        data: query
    });
}
//用户获取对应的学习率衰减策略参数
export const getLRdeacyParams  = query =>{
    return request({
        url: `${_this.$serverUrl}getLRdeacyParams `,
        method: 'post',
        data: query
    });
}
//用户提交模型训练
export const trainModel  = query =>{
    return request({
        url: `${_this.$serverUrl}trainModel `,
        method: 'post',
        data: query
    });
}
//用户恢复模型训练
export const restoreTrain  = query =>{
    return request({
        url: `${_this.$serverUrl}restoreTrain `,
        method: 'post',
        data: query
    });
}
//用户检验资源是否足够
export const checkLeastResource  = query =>{
    return request({
        url: `${_this.$serverUrl}checkLeastResource `,
        method: 'post',
        data: query
    });
}

// 模型训练报告
export const getModelTestMessageById = query => {
    return request({
        url: `${_this.$serverUrl}getModelTestMessageById`,
        method: 'post',
        data: query
    })
}

// 获取当前GPU显存信息
export const getCurrentGPUMessage = query => {
    return request({
        url: `${_this.$serverUrl}getCurrentGPUMessage`,
        method: 'post',
        data: query
    })
}

// 获取模型消耗GPU资源
export const getModelCostByName = query => {
    return request({
        url: `${_this.$serverUrl}getModelCostByName`,
        method: 'post',
        data: query
    })
}

// 获取模型模板
export const getNetworkTemplateFile = query => {
    return request({
        url: `${_this.$serverUrl}getNetworkTemplateFile`,
        method: 'post',
        data: query
    })
}

// 上传算法
export const uploadTemplateNetwork = query => {
    return request({
        url: `${_this.$serverUrl}uploadTemplateNetwork`,
        method: 'post',
        data: query
    })
}

// 通过用户id号获取该用户上传的网络模型
export const getNetworksByUserId = query => {
    return request({
        url: `${_this.$serverUrl}getNetworksByUserId`,
        method: 'post',
        data: query
    })
}

// 通过网络名与用户id模糊查询符合的网络信息
export const getFuzzyNetworksByUserId = query => {
    return request({
        url: `${_this.$serverUrl}getFuzzyNetworksByUserId`,
        method: 'post',
        data: query
    })
}

// 通过网络模型id号从数据端获取网络模型文件
export const getNetworkFileById = query => {
    return request({
        url: `${_this.$serverUrl}getNetworkFileById`,
        method: 'post',
        data: query
    })
}

// 修改网络模型信息
export const updateNetworkById = query => {
    return request({
        url: `${_this.$serverUrl}updateNetworkById`,
        method: 'post',
        data: query
    })
}

// 删除算法
export const deleteNetworkById = query => {
    return request({
        url: `${_this.$serverUrl}deleteNetworkById`,
        method: 'post',
        data: query
    })
}

// 通过用户/管理员id号获取所有网络模型用于表单选择
export const getNetworksByUserIdForList = query => {
    return request({
        url: `${_this.$serverUrl}getNetworksByUserIdForList`,
        method: 'post',
        data: query
    })
}

// 通过id号获取单个模型信息
export const getNetworkById = query => {
    return request({
        url: `${_this.$serverUrl}getNetworkById`,
        method: 'post',
        data: query
    })
}