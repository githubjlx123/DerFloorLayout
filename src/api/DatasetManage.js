
import request from '../utils/request';
import Vue from 'vue';
let _this = new Vue();

//查询图片数据
export const getAnnotationDatasetById = query => {
    return request({
        url: `${_this.$serverUrl}getAnnotationDatasetById`,
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
        url: `${_this.$serverUrl}addDatasetClasses`,
        method: 'post',
        data: params
    })
}
//删除类别
export const deleteDatasetClasses = params => {
    return request({
        url: `${_this.$serverUrl}deleteDatasetClasses`,
        method: 'post',
        data: params
    })
}
//查询类别信息
export const getDatasetClassesById = params => {
    return request({
        url: `${_this.$serverUrl}getDatasetClassesById`,
        method: 'post',
        data: params
    })
}
//修改类别信息
export const updateDatasetClasses = params => {
    return request({
        url: `${_this.$serverUrl}updateDatasetClasses`,
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
//获取详细数据集信息
export const adminGetDatasetDetailById = params => {
    return request({
        url: `${_this.$serverUrl}admin/adminGetDatasetDetailById`,
        method: 'post',
        data: params
    })
}
//用户数据集模糊查询
export const getFuzzyDatasetsByUserId = query =>{
    return request({
        url: `${_this.$serverUrl}getFuzzyDatasetsByUserId`,
        method: 'post',
        data: query
    });
}
//删除数据集信息
export const deleteDatasetById = query =>{
    return request({
        url: `${_this.$serverUrl}deleteDatasetById`,
        method: 'post',
        data: query
    });
}
//删除数据集图片信息 deleteImageDataById
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
        url: `${_this.$serverUrl}getFuzzyImageDataByDatasetIdAndClass`,
        method: 'post',
        data: query
    });
}
//查询该类下面有多少图片 getDatasetClassRelatedNum
export const getDatasetClassRelatedNum = query =>{
    return request({
        url: `${_this.$serverUrl}getDatasetClassRelatedNum`,
        method: 'post',
        data: query
    });
}
//查看数据集信息-表格
export const getDatasetsByUserId = query =>{
    return request({
        url: `${_this.$serverUrl}getDatasetsByUserId`,
        method: 'post',
        data: query
    });
}
//用户查看数据集详情
export const getDatasetById = query =>{
    return request({
        url: `${_this.$serverUrl}getDatasetById`,
        method: 'post',
        data: query
    });
}
//修改数据集详情
export const updateDatasetById = query =>{
    return request({
        url: `${_this.$serverUrl}updateDatasetById`,
        method: 'post',
        data: query
    });
}
//新增数据集 createDataset
export const createDataset = query =>{
    return request({
        url: `${_this.$serverUrl}createDataset`,
        method: 'post',
        data: query
    });
}
//用户通过项目id查询数据集信息
export const getDatasetsByProjectId = query =>{
    return request({
        url: `${_this.$serverUrl}getDatasetsByProjectId`,
        method: 'post',
        data: query
    });
}
//通过数据集id查询数据集列表信息 getDatasetsByDatasetId
export const getClassifyDatasetClasses = query =>{
    return request({
        url: `${_this.$serverUrl}getClassesNameByDatasetId`,
        method: 'post',
        data: query
    });
}
//通过数据集名称模糊查询数据标注页面列表
export const getFuzzyDatasetsByUserIdForAnnotation = query =>{
    return request({
        url: `${_this.$serverUrl}getFuzzyDatasetsByUserIdForAnnotation`,
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

//绘制检测任务数据集图片
export const getDetectImageWithLabelApi = query =>{
    return request({
        url: `${_this.$serverUrl}getDetectImageWithLabel`,
        method: 'post',
        data: query
    });
}
//管理员查看数据集列表
export const getFuzzyDatasetsByName = query =>{
    return request({
        url: `${_this.$serverUrl}admin/getFuzzyDatasetsByName`,
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
export const getClassesNameByDatasetId = query =>{
    return request({
        url: `${_this.$serverUrl}getClassesNameByDatasetId`,
        method: 'post',
        data: query
    });
}
//用户查看某个项目下的数据集下拉框 getDatasetsByProjectIdForList
export const getDatasetsByProjectIdForList = query =>{
    return request({
        url: `${_this.$serverUrl}getDatasetsByProjectIdForList`,
        method: 'post',
        data: query
    });
}
//用户查看数据集下拉框 getDatasetsByUserIdForList
export const getDatasetsByUserIdForList = query =>{
    return request({
        url: `${_this.$serverUrl}getDatasetsByUserIdForList`,
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
//用户通过图片路径获得图片内容
export const getImageByPath = query =>{
    return request({
        url: `${_this.$serverUrl}getImageByPath`,
        method: 'post',
        data: query
    });
}

//用户导出数据集
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

//数据缩略图获取连接
export const getThumbnailByPath = query => {
    return request({
        url: `${_this.$serverUrl}getImageByPathForThumbnail`,
        method: 'post',
        data: query
    });
}

