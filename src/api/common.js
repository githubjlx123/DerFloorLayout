import request from '../utils/request';
import Vue from 'vue';
let _this = new Vue();

//用户通过图片路径获得图片内容
export const getImageByPath = query =>{
    return request({
        url: `${_this.$serverUrl}getImageByPath`,
        method: 'post',
        data: query
    });
}