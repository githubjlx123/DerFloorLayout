import request from '../utils/request';
import Vue from 'vue';
let _this = new Vue();

//铺装模拟
export const updateRoomLabelById = query => {
    return request({
        url: `${_this.$serverUrl}updateRoomLabelById`,
        method: 'post',
        data: query
    });
};
