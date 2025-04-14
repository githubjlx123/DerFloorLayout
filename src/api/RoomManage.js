import request from '../utils/request';
import Vue from 'vue';
let _this = new Vue();


//删除房间信息
export const deleteRoomById = query =>{
    return request({
        url: `${_this.$serverUrl}deleteRoomById`,
        method: 'post',
        data: query
    });
}


//用户查看最新房间信息
export const getLastRoomsByUserId = query =>{
    return request({
        url: `${_this.$serverUrl}getLastRoomsByUserId`,
        method: 'post',
        data: query
    });
}



// 通过房间信息获取该房间下的户型
export const getFuzzyRoomByHouse = query =>{
    return request({
        url: `${_this.$serverUrl}getFuzzyRoomByHouse`,
        method: 'post',
        data: query
    });
}












// 查询当前户型下所有的房间信息
export const getRoomsByHouseId = query =>{
    return request({
        url: `${_this.$serverUrl}getRoomsByHouseId`,
        method: 'post',
        data: query
    });
}















//查询房间详细信息
export const adminGetRoomDetailById = query => {
    return request({
        url: `${_this.$serverUrl}admin/adminGetRoomDetailById`,
        method: 'post',
        data: query
    });
};
//房间模糊查询
export const getFuzzyRoomsByUserId = query =>{
    return request({
        url: `${_this.$serverUrl}getFuzzyRoomsByUserId`,
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
//获取房间信息
export const getRoomsByUserId = query =>{
    return request({
        url: `${_this.$serverUrl}getRoomsByUserId`,
        method: 'post',
        data: query
    });
}
//房间部署 deployRoom
export const deployRoom = query =>{
    return request({
        url: `${_this.$serverUrl}deployRoom`,
        method: 'post',
        data: query
    });
}
//管理员查询所有房间信息
export const getFuzzyRoomsByName = query =>{
    return request({
        url: `${_this.$serverUrl}admin/getFuzzyRoomsByName`,
        method: 'post',
        data: query
    });
}

//用户通过项目ID查询房间列表
export const getRoomsByProjectId = query =>{
    return request({
        url: `${_this.$serverUrl}getRoomsByProjectId`,
        method: 'post',
        data: query
    });
}
//用户通过数据集ID查询房间下拉框
export const getRoomsByDatasetIdForList = query =>{
    return request({
        url: `${_this.$serverUrl}getRoomsByDatasetIdForList`,
        method: 'post',
        data: query
    });
}
//用户通过房间ID获取房间信息
export const getRoomById = query =>{
    return request({
        url: `${_this.$serverUrl}getRoomById`,
        method: 'post',
        data: query
    });
}
//用户通过房间ID获取训练信息
export const getRoomTrainMessageById = query =>{
    return request({
        url: `${_this.$serverUrl}getRoomTrainMessageById`,
        method: 'post',
        data: query
    });
}
//用户通过房间ID、用户ID中断房间训练
export const breakTrainByRoomId = query =>{
    return request({
        url: `${_this.$serverUrl}breakTrainByRoomId`,
        method: 'post',
        data: query
    });
}
//用户通过用户ID获取用户房间下拉框
export const getRoomsByUserIdForList = query =>{
    return request({
        url: `${_this.$serverUrl}getRoomsByUserIdForList`,
        method: 'post',
        data: query
    });
}
//用户获取高级参数
export const getRoomParams = () =>{
    return request({
        url: `${_this.$serverUrl}getRoomParams`,
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
//用户提交房间训练
export const trainRoom  = query =>{
    return request({
        url: `${_this.$serverUrl}trainRoom `,
        method: 'post',
        data: query
    });
}
//用户恢复房间训练
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

// 房间训练报告
export const getRoomTestMessageById = query => {
    return request({
        url: `${_this.$serverUrl}getRoomTestMessageById`,
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

// 获取房间消耗GPU资源
export const getRoomCostByName = query => {
    return request({
        url: `${_this.$serverUrl}getRoomCostByName`,
        method: 'post',
        data: query
    })
}

// 获取房间模板
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

// 通过用户id号获取该用户上传的网络房间
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

// 通过网络房间id号从数据端获取网络房间文件
export const getNetworkFileById = query => {
    return request({
        url: `${_this.$serverUrl}getNetworkFileById`,
        method: 'post',
        data: query
    })
}

// 修改网络房间信息
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

// 通过用户/管理员id号获取所有网络房间用于表单选择
export const getNetworksByUserIdForList = query => {
    return request({
        url: `${_this.$serverUrl}getNetworksByUserIdForList`,
        method: 'post',
        data: query
    })
}

// 通过id号获取单个房间信息
export const getNetworkById = query => {
    return request({
        url: `${_this.$serverUrl}getNetworkById`,
        method: 'post',
        data: query
    })
}