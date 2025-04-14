import request from '../utils/request';

const SERVER_URL='http://192.168.51.67:8000/'
//管理员上传引导资源
export const addAppArticle = query =>{
    return request({
        url: `${SERVER_URL}app/addArticle`,
        method: 'post',
        data: query
    });
}
