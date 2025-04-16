
import request from '../utils/request';
import Vue from 'vue';
let _this = new Vue();


//新增户型 createHouse
export const createHouse = query =>{
    return request({
        url: `${_this.$serverUrl}createHouse`,
        method: 'post',
        data: query
    });
}

//删除户型信息
export const deleteHouseById = query =>{
    return request({
        url: `${_this.$serverUrl}deleteHouseById`,
        method: 'post',
        data: query
    });
}

//修改户型详情
export const updateHouseById = query =>{
    return request({
        url: `${_this.$serverUrl}updateHouseById`,
        method: 'post',
        data: query
    });
}

//用户查看户型详情
export const getHouseById = query =>{
    return request({
        url: `${_this.$serverUrl}getHouseById`,
        method: 'post',
        data: query
    });
}


//用户户型模糊查询
export const getFuzzyHousesByUserId = query =>{
    return request({
        url: `${_this.$serverUrl}getFuzzyHousesByUserId`,
        method: 'post',
        data: query
    });
}




//数据缩略图获取连接
export const getThumbnailByPath = query => {
    return request({
        url: `${_this.$serverUrl}getImageByPathForThumbnail`,
        method: 'post',
        data: query
    });
}

//用户通过图片路径获得图片内容
export const getImageByPath = query =>{
    return request({
        url: `${_this.$serverUrl}getImageByPath`,
        method: 'post',
        data: query
    });
}


//通过户型名称模糊查询数据标注页面列表
export const getFuzzyHousesByUserIdForAnnotation = query =>{
    return request({
        url: `${_this.$serverUrl}getFuzzyHousesByUserIdForAnnotation`,
        method: 'post',
        data: query
    });
}

//用户查看户型下拉框 getHousesByUserIdForList
export const getHousesByUserIdForList = query =>{
    return request({
        url: `${_this.$serverUrl}getHousesByUserIdForList`,
        method: 'post',
        data: query
    });
}
















//查询图片数据
export const getAnnotationHouseById = query => {
    return request({
        url: `${_this.$serverUrl}getAnnotationHouseById`,
        method: 'post',
        data: query
    });
};
//保存标注数据
export const saveDetectionData = params =>{
    return request({
        url: `${_this.$serverUrl}updateImageDataLabelById`,
        method: 'post',
        data: params
    });
};
//获取模型数据
export const getModelByUserId = params =>{
    return request({
        url: `${_this.$serverUrl}getModelsByUserId`,
        method: 'post',
        data: params
    })
}
//保存图片类别
export const saveImageClass = params => {
    return request({
        url: `${_this.$serverUrl}updateImageDataLabelById`,
        method: 'post',
        data: params
    })
}
//保存类别
export const saveClass = params => {
    return request({
        url: `${_this.$serverUrl}addHouseClasses`,
        method: 'post',
        data: params
    })
}
//删除类别
export const deleteHouseClasses = params => {
    return request({
        url: `${_this.$serverUrl}deleteHouseClasses`,
        method: 'post',
        data: params
    })
}
//查询类别信息
export const getHouseClassesById = params => {
    return request({
        url: `${_this.$serverUrl}getHouseClassesById`,
        method: 'post',
        data: params
    })
}
//修改类别信息
export const updateHouseClasses = params => {
    return request({
        url: `${_this.$serverUrl}updateHouseClasses`,
        method: 'post',
        data: params
    })
}
//删除图片类别信息、清空图片标注信息
export const emptyLabelMessageById = params => {
    return request({
        url: `${_this.$serverUrl}emptyLabelMessageById`,
        method: 'post',
        data: params
    })
}
//获取详细户型信息
export const adminGetHouseDetailById = params => {
    return request({
        url: `${_this.$serverUrl}admin/adminGetHouseDetailById`,
        method: 'post',
        data: params
    })
}


//删除户型图片信息 deleteImageDataById
export const deleteImageDataById = query =>{
    return request({
        url: `${_this.$serverUrl}deleteImageDataById`,
        method: 'post',
        data: query
    });
}
//查询图片信息
export const getFuzzyImageDataByName = query =>{
    return request({
        url: `${_this.$serverUrl}getFuzzyImageDataByHouseIdAndClass`,
        method: 'post',
        data: query
    });
}
//查询该类下面有多少图片 getHouseClassRelatedNum
export const getHouseClassRelatedNum = query =>{
    return request({
        url: `${_this.$serverUrl}getHouseClassRelatedNum`,
        method: 'post',
        data: query
    });
}
//查看户型信息-表格
export const getHousesByUserId = query =>{
    return request({
        url: `${_this.$serverUrl}getHousesByUserId`,
        method: 'post',
        data: query
    });
}


//用户通过项目id查询户型信息
export const getHousesByProjectId = query =>{
    return request({
        url: `${_this.$serverUrl}getHousesByProjectId`,
        method: 'post',
        data: query
    });
}
//通过户型id查询户型列表信息 getHousesByHouseId
export const getClassifyHouseClasses = query =>{
    return request({
        url: `${_this.$serverUrl}getClassesNameByHouseId`,
        method: 'post',
        data: query
    });
}


//解压文件夹unzipFile
export const unzipFileApi = query =>{
    return request({
        url: `${_this.$serverUrl}unzipFile`,
        method: 'post',
        data: query
    });
}

//绘制检测任务户型图片
export const getDetectImageWithLabelApi = query =>{
    return request({
        url: `${_this.$serverUrl}getDetectImageWithLabel`,
        method: 'post',
        data: query
    });
}
//管理员查看户型列表
export const getFuzzyHousesByName = query =>{
    return request({
        url: `${_this.$serverUrl}admin/getFuzzyHousesByName`,
        method: 'post',
        data: query
    });
}
//用户查看检测图片标签位置
export const getDetectLabel = query =>{
    return request({
        url: `${_this.$serverUrl}getImageDataLabelById`,
        method: 'post',
        data: query
    });
}
//用户查看所有检测标签类别
export const getClassesNameByHouseId = query =>{
    return request({
        url: `${_this.$serverUrl}getClassesNameByHouseId`,
        method: 'post',
        data: query
    });
}
//用户查看某个项目下的户型下拉框 getHousesByProjectIdForList
export const getHousesByProjectIdForList = query =>{
    return request({
        url: `${_this.$serverUrl}getHousesByProjectIdForList`,
        method: 'post',
        data: query
    });
}

//用户上传单张分类图片
export const uploadOneClassifyImage = query =>{
    return request({
        url: `${_this.$serverUrl}uploadOneClassifyImage`,
        method: 'post',
        data: query
    });
}
//用户上传单张检测图片
export const uploadOneDetectImage = query =>{
    return request({
        url: `${_this.$serverUrl}uploadOneDetectImage`,
        method: 'post',
        data: query
    });
}

//用户导出户型
export const exportImageDataLabels = query =>{
    return request({
        url: `${_this.$serverUrl}exportImageDataLabels`,
        method: 'post',
        data: query
    })
}

//用户通过相机上传图片
export const uploadOneImageByCamera = query =>{
    return request({
        url: `${_this.$serverUrl}uploadOneImageByCamera`,
        method: 'post',
        data: query
    });
}

// 获取分割图像的标签图片
export const getSegmentImageWithLabel  = query => {
    return request({
        url: `${_this.$serverUrl}getSegmentImageWithLabel`,
        method: 'post',
        data: query
    })
}

